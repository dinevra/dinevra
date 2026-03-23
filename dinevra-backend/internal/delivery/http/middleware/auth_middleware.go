package middleware

import (
	"errors"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "authorization header required"})
			c.Abort()
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "authorization header format must be Bearer {token}"})
			c.Abort()
			return
		}

		tokenString := parts[1]
		secret := os.Getenv("JWT_SECRET")
		if secret == "" {
			secret = "dinevra-dev-secret-change-in-production"
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("unexpected signing method")
			}
			return []byte(secret), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token claims"})
			c.Abort()
			return
		}

		// Set claims in context for downstream handlers
		c.Set("user_id", claims["sub"])
		c.Set("org_id", claims["org_id"])
		c.Set("role", claims["role"])
		c.Next()
	}
}

func RoleMiddleware(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("role")
		if !exists {
			c.JSON(http.StatusForbidden, gin.H{"error": "role information missing"})
			c.Abort()
			return
		}

		roleStr := userRole.(string)
		
		// Super Admin can do everything
		if roleStr == "super_admin" {
			c.Next()
			return
		}

		isAuthorized := false
		for _, role := range roles {
			if role == roleStr {
				isAuthorized = true
				break
			}
		}

		if !isAuthorized {
			c.JSON(http.StatusForbidden, gin.H{"error": "unauthorized for this role"})
			c.Abort()
			return
		}

		c.Next()
	}
}

func GetOrgID(c *gin.Context) (uuid.UUID, error) {
	orgIDStr, exists := c.Get("org_id")
	if !exists {
		return uuid.Nil, errors.New("org_id missing from context")
	}
	return uuid.Parse(orgIDStr.(string))
}
