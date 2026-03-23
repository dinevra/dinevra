package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"dinevra-backend/internal/delivery/http/middleware"
	"dinevra-backend/internal/domain"
	"dinevra-backend/internal/usecase"
)

type KitchenHandler struct {
	KitchenUsecase usecase.KitchenUsecase
}

func NewKitchenHandler(r *gin.RouterGroup, uc usecase.KitchenUsecase) {
	handler := &KitchenHandler{KitchenUsecase: uc}
	
	// Use a unique prefix to avoid overlap with /locations/:id in LocationHandler
	locKitchens := r.Group("/location-kitchens/:location_id")
	locKitchens.Use(middleware.AuthMiddleware())
	locKitchens.Use(middleware.RoleMiddleware("admin"))
	{
		locKitchens.POST("", handler.CreateKitchen)
		locKitchens.GET("", handler.GetKitchensByLocation)
	}

	// Individual kitchen management routes
	kitchenActions := r.Group("/kitchens/:id")
	kitchenActions.Use(middleware.AuthMiddleware())
	kitchenActions.Use(middleware.RoleMiddleware("admin"))
	{
		kitchenActions.GET("", handler.GetKitchenByID)
		kitchenActions.PUT("", handler.UpdateKitchen)
		kitchenActions.DELETE("", handler.DeleteKitchen)
		kitchenActions.PUT("/config", handler.UpdateKitchenConfig)
		kitchenActions.PATCH("/status", handler.ToggleKitchenStatus)
	}
}

func (h *KitchenHandler) CreateKitchen(c *gin.Context) {
	locID, err := uuid.Parse(c.Param("location_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid location id"})
		return
	}

	var req domain.CreateKitchenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	req.LocationID = locID

	kitchen, err := h.KitchenUsecase.CreateKitchen(c.Request.Context(), &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, kitchen)
}

func (h *KitchenHandler) GetKitchensByLocation(c *gin.Context) {
	locID, err := uuid.Parse(c.Param("location_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid location id"})
		return
	}

	kitchens, err := h.KitchenUsecase.GetKitchensByLocation(c.Request.Context(), locID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"kitchens": kitchens})
}

func (h *KitchenHandler) GetKitchenByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid kitchen id"})
		return
	}

	kitchen, err := h.KitchenUsecase.GetKitchenByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if kitchen == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "kitchen not found"})
		return
	}
	c.JSON(http.StatusOK, kitchen)
}

func (h *KitchenHandler) UpdateKitchen(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid kitchen id"})
		return
	}

	var req domain.UpdateKitchenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	kitchen, err := h.KitchenUsecase.UpdateKitchen(c.Request.Context(), id, &req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, kitchen)
}

func (h *KitchenHandler) DeleteKitchen(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid kitchen id"})
		return
	}

	if err := h.KitchenUsecase.DeleteKitchen(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "kitchen deactivated successfully"})
}

func (h *KitchenHandler) UpdateKitchenConfig(c *gin.Context) {
	kitchenID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid kitchen id format"})
		return
	}
	
	var config domain.KitchenConfiguration
	if err := c.ShouldBindJSON(&config); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	config.KitchenID = kitchenID

	if err := h.KitchenUsecase.UpdateKitchenConfig(c.Request.Context(), &config); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "configuration updated successfully"})
}

func (h *KitchenHandler) ToggleKitchenStatus(c *gin.Context) {
	kitchenID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid kitchen id format"})
		return
	}

	var req struct {
		IsOpen bool `json:"is_open"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.KitchenUsecase.ToggleKitchenStatus(c.Request.Context(), kitchenID, req.IsOpen); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "kitchen status toggled"})
}
