package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"dinevra-backend/internal/domain"
)

type AuthHandler struct {
	authUsecase domain.AuthUsecase
}

func NewAuthHandler(rg *gin.RouterGroup, authUsecase domain.AuthUsecase) {
	h := &AuthHandler{authUsecase: authUsecase}
	auth := rg.Group("/auth")
	auth.POST("/signup", h.Signup)
	auth.POST("/login", h.Login)
	auth.POST("/kitchen-login", h.KitchenLogin)
}

func (h *AuthHandler) Signup(c *gin.Context) {
	var req domain.SignupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp, err := h.authUsecase.Signup(c.Request.Context(), &req)
	if err != nil {
		if err.Error() == "email already in use" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "signup failed: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, resp)
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req domain.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp, err := h.authUsecase.Login(c.Request.Context(), &req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
		return
	}

	c.JSON(http.StatusOK, resp)
}

func (h *AuthHandler) KitchenLogin(c *gin.Context) {
	var req domain.KitchenLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp, err := h.authUsecase.KitchenLogin(c.Request.Context(), &req)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid kitchen credentials"})
		return
	}

	c.JSON(http.StatusOK, resp)
}
