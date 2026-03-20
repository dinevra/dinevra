package http_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"dinevra-backend/internal/domain"
	delivery_http "dinevra-backend/internal/delivery/http"
)

// MockOrderUsecase
type MockOrderUsecase struct {}

func (m *MockOrderUsecase) CreateOrder(ctx context.Context, order *domain.Order) error {
	order.ID = uuid.New()
	return nil
}

func (m *MockOrderUsecase) GetOrdersByUnit(ctx context.Context, unitID uuid.UUID) ([]*domain.Order, error) {
	return []*domain.Order{
		{ID: uuid.New(), Status: "pending"},
	}, nil
}

func (m *MockOrderUsecase) AdvanceOrderStatus(ctx context.Context, id uuid.UUID) error {
	return nil
}

func TestCreateOrderHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	
	mockUsecase := &MockOrderUsecase{}
	api := router.Group("/api/v1")
	delivery_http.NewOrderHandler(api, mockUsecase)

	// Build request
	orderPayload := map[string]interface{}{
		"organization_id": uuid.New().String(),
		"location_id":     uuid.New().String(),
		"unit_id":         uuid.New().String(),
		"device_id":       uuid.New().String(),
		"employee_id":     uuid.New().String(),
		"total_amount":    24.50,
		"status":          "pending",
	}
	body, _ := json.Marshal(orderPayload)
	req, _ := http.NewRequest(http.MethodPost, "/api/v1/orders", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	if w.Code != http.StatusCreated {
		t.Fatalf("Expected status code 201, got %v", w.Code)
	}
}
