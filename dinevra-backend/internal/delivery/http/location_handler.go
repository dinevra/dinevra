package http

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"dinevra-backend/internal/domain"
	"dinevra-backend/internal/usecase"
)

type LocationHandler struct {
	LocationUsecase usecase.LocationUsecase
}

func NewLocationHandler(r *gin.RouterGroup, uc usecase.LocationUsecase) {
	handler := &LocationHandler{LocationUsecase: uc}
	locGrp := r.Group("/locations")
	{
		locGrp.POST("", handler.CreateLocation)
		locGrp.GET("/org/:org_id", handler.GetLocationsByOrg)
		locGrp.GET("/:id", handler.GetLocationByID)
	}
}

func (h *LocationHandler) CreateLocation(c *gin.Context) {
	var loc domain.Location
	if err := c.ShouldBindJSON(&loc); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.LocationUsecase.CreateLocation(c.Request.Context(), &loc); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, loc)
}

func (h *LocationHandler) GetLocationsByOrg(c *gin.Context) {
	orgID, err := uuid.Parse(c.Param("org_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid auth org id"})
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
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid auth id"})
		return
	}
	location, err := h.LocationUsecase.GetLocationByID(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, location)
}
