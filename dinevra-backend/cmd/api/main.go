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
	_ = godotenv.Load() // ignore error, as it might be set via env vars

	// Initialize Database
	ctx := context.Background()
	pool, err := db.ConnectPostgres(ctx)
	if err != nil {
		log.Fatalf("Database initialization failed: %v", err)
	}
	defer pool.Close()

	// Initialize Redis
	redisClient, err := redis.ConnectRedis(ctx)
	if err != nil {
		log.Printf("Redis initialization failed: %v", err) // maybe allow failure for dev
	}
	
	// Setup WebSocket Hub
	hub := ws.NewHub(redisClient)
	go hub.Run(ctx)
	broadcaster := ws.NewRedisBroadcaster(hub)

	// Setup Repositories
	orderRepo := postgres.NewOrderRepository(pool)
	// userRepo := postgres.NewUserRepository(pool)
	// deviceRepo := postgres.NewDeviceRepository(pool)

	// Setup Usecases
	orderUsecase := usecase.NewOrderUsecase(orderRepo, broadcaster)
	paymentUsecase := usecase.NewPaymentUsecase(orderRepo, broadcaster)

	// Setup Router
	router := gin.Default()
	apiV1 := router.Group("/api/v1")
	{
		apiV1.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "healthy", "service": "dinevra-api"})
		})
	}

	// Setup Handlers
	delivery_http.NewOrderHandler(apiV1, orderUsecase)
	delivery_http.NewPaymentHandler(apiV1, paymentUsecase)

	// Setup WebSocket route
	router.GET("/ws", func(c *gin.Context) {
		ws.ServeWs(hub, c)
	})

	// Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Starting Dinevra Core API on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
