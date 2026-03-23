package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"dinevra-backend/internal/delivery/http/middleware"
	"dinevra-backend/internal/domain"
	"dinevra-backend/internal/usecase"
)

type LocationHandler struct {
	LocationUsecase usecase.LocationUsecase
}

func NewLocationHandler(r *gin.RouterGroup, uc usecase.LocationUsecase) {
	handler := &LocationHandler{LocationUsecase: uc}
	
	// Protected routes
	locGrp := r.Group("/locations")
	locGrp.Use(middleware.AuthMiddleware())
	{
		// Admin/OrgAdmin only for write operations
		adminOnly := locGrp.Group("")
		adminOnly.Use(middleware.RoleMiddleware("admin", "org_admin"))
		{
			adminOnly.POST("", handler.CreateLocation)
			adminOnly.PUT("/:id", handler.UpdateLocation)
			adminOnly.DELETE("/:id", handler.DeleteLocation)
		}

		// Read operations (available to all authenticated users in the org, or refined by role later)
		locGrp.GET("", handler.ListLocations)
		locGrp.GET("/:id", handler.GetLocationByID)
		locGrp.GET("/org/:org_id", handler.GetLocationsByOrg)
	}
}

func (h *LocationHandler) CreateLocation(c *gin.Context) {
	var loc domain.Location
	if err := c.ShouldBindJSON(&loc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// For Org Admins, enforce their own Org ID from token
	if role, _ := c.Get("role"); role == "org_admin" {
		orgID, _ := middleware.GetOrgID(c)
		loc.OrganizationID = orgID
	}

	if err := h.LocationUsecase.CreateLocation(c.Request.Context(), &loc); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, loc)
}

func (h *LocationHandler) UpdateLocation(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid location id"})
		return
	}

	var loc domain.Location
	if err := c.ShouldBindJSON(&loc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	loc.ID = id

	// Security check: ensure org_admin is only updating their own org's location
	if role, _ := c.Get("role"); role == "org_admin" {
		orgID, _ := middleware.GetOrgID(c)
		loc.OrganizationID = orgID
	}

	if err := h.LocationUsecase.UpdateLocation(c.Request.Context(), &loc); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, loc)
}

func (h *LocationHandler) DeleteLocation(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid location id"})
		return
	}

	if err := h.LocationUsecase.DeleteLocation(c.Request.Context(), id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "location deactivated successfully"})
}

func (h *LocationHandler) ListLocations(c *gin.Context) {
	orgID, err := middleware.GetOrgID(c)
	if err != nil {
		// Fallback to query param for Super Admin if not in context
		orgIDStr := c.Query("organization_id")
		if orgIDStr != "" {
			orgID, _ = uuid.Parse(orgIDStr)
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "organization_id is required"})
			return
		}
	}

	country := c.Query("country")
	city := c.Query("city")
	status := c.Query("status")

	locations, err := h.LocationUsecase.ListLocations(c.Request.Context(), orgID, country, city, status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"locations": locations})
}

func (h *LocationHandler) GetLocationsByOrg(c *gin.Context) {
	orgID, err := uuid.Parse(c.Param("org_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid organization id"})
		return
	}

	locations, err := h.LocationUsecase.GetLocationsByOrg(c.Request.Context(), orgID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"locations": locations})
}

func (h *LocationHandler) GetLocationByID(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid location id"})
		return
	}
	location, err := h.LocationUsecase.GetLocationByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, location)
}
