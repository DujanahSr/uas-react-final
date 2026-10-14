package response

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type APIResponse struct {
	Status  string      `json:"status"`            // "success" or "error"
	Message string      `json:"message"`           // Human-readable message
	Data    interface{} `json:"data,omitempty"`    // Payload
	Error   interface{} `json:"error,omitempty"`   // Error details if any
}

func Success(c *gin.Context, statusCode int, message string, data interface{}) {
	c.JSON(statusCode, APIResponse{
		Status:  "success",
		Message: message,
		Data:    data,
	})
}

func Error(c *gin.Context, statusCode int, message string, errDetails interface{}) {
	c.JSON(statusCode, APIResponse{
		Status:  "error",
		Message: message,
		Error:   errDetails,
	})
}

func BadRequest(c *gin.Context, message string, errDetails interface{}) {
	Error(c, http.StatusBadRequest, message, errDetails)
}

func NotFound(c *gin.Context, message string) {
	Error(c, http.StatusNotFound, message, nil)
}

func InternalServerError(c *gin.Context, message string, errDetails interface{}) {
	Error(c, http.StatusInternalServerError, message, errDetails)
}

func Conflict(c *gin.Context, message string, errDetails interface{}) {
	Error(c, http.StatusConflict, message, errDetails)
}
