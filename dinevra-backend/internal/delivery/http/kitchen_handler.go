package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"dinevra-backend/internal/domain"
	"dinevra-backend/internal/usecase"
)

type KitchenHandler struct {
	KitchenUsecase usecase.KitchenUsecase
}

func NewKitchenHandler(r *gin.RouterGroup, uc usecase.KitchenUsecase) {
	handler := &KitchenHandler{KitchenUsecase: uc}
	kGrp := r.Group("/kitchens")
	{
		kGrp.POST("", handler.CreateKitchen)
		kGrp.GET("/location/:location_id", handler.GetKitchensByLocation)
		kGrp.PUT("/:id/config", handler.UpdateKitchenConfig)
		kGrp.PATCH("/:id/status", handler.ToggleKitchenStatus)
	}
}

func (h *KitchenHandler) CreateKitchen(c *gin.Context) {
	var k domain.Kitchen
	if err := c.ShouldBindJSON(&k); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.KitchenUsecase.CreateKitchen(c.Request.Context(), &k); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, k)
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
