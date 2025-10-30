package controllers

import (
	"car-service/database"
	"car-service/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

func DeleteUserByAdmin(c *gin.Context) {
	userID := c.Param("id")

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Пользователь не найден"})
		return
	}

	// Защита от удаления самого себя (опционально)
	adminID, _ := c.Get("user_id")
	if user.ID == adminID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Нельзя удалить самого себя"})
		return
	}

	database.DB.Delete(&user)
	c.JSON(http.StatusOK, gin.H{"message": "Пользователь удалён"})
}
func UpdateUserRole(c *gin.Context) {
	userID := c.Param("id")

	var input struct {
		Role string `json:"role" binding:"required"` // "user" или "admin"
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверные данные"})
		return
	}

	if input.Role != "user" && input.Role != "admin" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Роль должна быть 'user' или 'admin'"})
		return
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Пользователь не найден"})
		return
	}

	user.Role = input.Role
	database.DB.Save(&user)

	c.JSON(http.StatusOK, gin.H{"message": "Роль обновлена"})
}
