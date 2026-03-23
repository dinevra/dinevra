package main

import (
	"context"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	delivery_http "dinevra-backend/internal/delivery/http"
	"dinevra-backend/internal/delivery/ws"
	"dinevra-backend/internal/infrastructure/db"
	"dinevra-backend/internal/infrastructure/redis"
	"dinevra-backend/internal/repository/postgres"
	"dinevra-backend/internal/usecase"
)

func main() {
	_ = godotenv.Load()

	ctx := context.Background()
	pool, err := db.ConnectPostgres(ctx)
	if err != nil {
		log.Fatalf("Database initialization failed: %v", err)
	}
	defer pool.Close()

	redisClient, err := redis.ConnectRedis(ctx)
	if err != nil {
		log.Printf("Redis initialization failed: %v", err)
	}

	// WebSocket Hub
	hub := ws.NewHub(redisClient)
	go hub.Run(ctx)
	broadcaster := ws.NewRedisBroadcaster(hub)

	// Repositories
	orderRepo := postgres.NewOrderRepository(pool)
	userRepo := postgres.NewUserRepository(pool)
	orgRepo := postgres.NewOrganizationRepository(pool)
	locRepo := postgres.NewLocationRepository(pool)
	kitchenRepo := postgres.NewKitchenRepository(pool)

	// Usecases
	orderUsecase := usecase.NewOrderUsecase(orderRepo, broadcaster)
	paymentUsecase := usecase.NewPaymentUsecase(orderRepo, broadcaster)
	authUsecase := usecase.NewAuthUsecase(userRepo, orgRepo)
	locUsecase := usecase.NewLocationUsecase(locRepo)
	kitchenUsecase := usecase.NewKitchenUsecase(kitchenRepo, locRepo)

	// Router
	router := gin.Default()

	// CORS — allow Vite dev server and production
	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin,Content-Type,Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	apiV1 := router.Group("/api/v1")
	{
		apiV1.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "healthy", "service": "dinevra-api"})
		})
	}

	// Handlers
	delivery_http.NewOrderHandler(apiV1, orderUsecase)
	delivery_http.NewPaymentHandler(apiV1, paymentUsecase)
	delivery_http.NewAuthHandler(apiV1, authUsecase)
	delivery_http.NewLocationHandler(apiV1, locUsecase)
	delivery_http.NewKitchenHandler(apiV1, kitchenUsecase)

	// WebSocket
	router.GET("/ws", func(c *gin.Context) {
		ws.ServeWs(hub, c)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting Dinevra Core API on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
