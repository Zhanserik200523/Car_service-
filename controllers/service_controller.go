package controllers

import (
	"car-service/database"
	"car-service/models"
	"github.com/gin-gonic/gin"
	"net/http"
)

func AddService(c *gin.Context) {
	var input models.Service

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при создании услуги"})
		return
	}

	c.JSON(http.StatusCreated, input)
}

func GetServices(c *gin.Context) {
	var services []models.Service
	database.DB.Find(&services)

	c.JSON(http.StatusOK, services)
}

func DeleteService(c *gin.Context) {
	id := c.Param("id")
	var service models.Service

	if err := database.DB.First(&service, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Услуга не найдена"})
		return
	}

	database.DB.Delete(&service)
	c.JSON(http.StatusOK, gin.H{"message": "Услуга удалена"})
}
func UpdateService(c *gin.Context) {
	id := c.Param("id")
	var service models.Service

	if err := database.DB.First(&service, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Услуга не найдена"})
		return
	}

	var input models.Service
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Обновляем только нужные поля
	service.Name = input.Name
	service.Description = input.Description
	service.Price = input.Price
	service.Duration = input.Duration
	service.Category = input.Category
	service.Specialist = input.Specialist
	service.Image = input.Image
	service.Available = input.Available

	if err := database.DB.Save(&service).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при обновлении услуги"})
		return
	}

	c.JSON(http.StatusOK, service)
}
