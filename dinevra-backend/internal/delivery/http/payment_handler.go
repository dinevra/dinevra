package http

import (
	"io/ioutil"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"dinevra-backend/internal/usecase"
)

type PaymentHandler struct {
	PaymentUsecase usecase.PaymentUsecase
}

func NewPaymentHandler(r *gin.RouterGroup, uc usecase.PaymentUsecase) {
	handler := &PaymentHandler{
		PaymentUsecase: uc,
	}

	paymentGrp := r.Group("/payments")
	{
		paymentGrp.POST("/intent", handler.CreateIntent)
		paymentGrp.POST("/webhook", handler.StripeWebhook)
	}
}

func (h *PaymentHandler) CreateIntent(c *gin.Context) {
	var body struct {
		OrderID uuid.UUID `json:"order_id"`
		Amount  float64   `json:"amount"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	secret, err := h.PaymentUsecase.CreatePaymentIntent(c.Request.Context(), body.OrderID, body.Amount)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"client_secret": secret})
}

func (h *PaymentHandler) StripeWebhook(c *gin.Context) {
	payload, err := ioutil.ReadAll(c.Request.Body)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed to read payload"})
		return
	}

	signature := c.GetHeader("Stripe-Signature")

	err = h.PaymentUsecase.HandleStripeWebhook(c.Request.Context(), payload, signature)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.Status(http.StatusOK)
}
