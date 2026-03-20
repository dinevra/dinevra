package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"dinevra-backend/internal/domain"
	"dinevra-backend/internal/usecase"
)

type OrderHandler struct {
	OrderUsecase usecase.OrderUsecase
}

func NewOrderHandler(r *gin.RouterGroup, uc usecase.OrderUsecase) {
	handler := &OrderHandler{
		OrderUsecase: uc,
	}

	orderGrp := r.Group("/orders")
	{
		orderGrp.POST("", handler.CreateOrder)
		orderGrp.GET("/kitchen/:kitchen_id", handler.GetOrdersByKitchen)
		orderGrp.PATCH("/:id/advance", handler.AdvanceStatus)
	}
}

func (h *OrderHandler) CreateOrder(c *gin.Context) {
	var order domain.Order
	if err := c.ShouldBindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.OrderUsecase.CreateOrder(c.Request.Context(), &order); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, order)
}

func (h *OrderHandler) GetOrdersByKitchen(c *gin.Context) {
	kitchenIDStr := c.Param("kitchen_id")
	kitchenID, err := uuid.Parse(kitchenIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid kitchen id format"})
		return
	}

	orders, err := h.OrderUsecase.GetOrdersByKitchen(c.Request.Context(), kitchenID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"orders": orders})
}

func (h *OrderHandler) AdvanceStatus(c *gin.Context) {
	orderIDStr := c.Param("id")
	orderID, err := uuid.Parse(orderIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid order id format"})
		return
	}

	if err := h.OrderUsecase.AdvanceOrderStatus(c.Request.Context(), orderID); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "order status advanced successfully"})
}
