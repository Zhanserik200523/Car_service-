package controllers

import (
	"car-service/database"
	"car-service/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AddCar(c *gin.Context) {
	var input models.Car

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Получаем user_id из контекста (мы его позже через middleware сохраним)
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Пользователь не авторизован"})
		return
	}

	input.UserID = userID.(uint)

	database.DB.Create(&input)

	c.JSON(http.StatusCreated, gin.H{"message": "Машина успешно добавлена!"})
}
func GetCars(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Пользователь не авторизован"})
		return
	}

	var cars []models.Car
	database.DB.Where("user_id = ?", userID).Find(&cars)

	c.JSON(http.StatusOK, cars)
}
func DeleteCar(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Пользователь не авторизован"})
		return
	}

	// Получаем ID машины из URL
	carID := c.Param("id")

	var car models.Car
	if err := database.DB.First(&car, carID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Машина не найдена"})
		return
	}

	// Проверяем, принадлежит ли машина пользователю
	if car.UserID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Нет доступа к этой машине"})
		return
	}

	database.DB.Delete(&car)

	c.JSON(http.StatusOK, gin.H{"message": "Машина удалена"})
}
func UpdateCar(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Пользователь не авторизован"})
		return
	}

	carID := c.Param("id")

	var car models.Car
	if err := database.DB.First(&car, carID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Машина не найдена"})
		return
	}

	// Проверяем принадлежит ли машина этому пользователю
	if car.UserID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Нет доступа к этой машине"})
		return
	}

	// Получаем новые данные из запроса
	var input struct {
		Brand string `json:"brand"`
		Model string `json:"model"`
		Year  int    `json:"year"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	car.Brand = input.Brand
	car.CarModel = input.Model
	car.Year = input.Year

	database.DB.Save(&car)

	c.JSON(http.StatusOK, gin.H{"message": "Машина успешно обновлена"})
}
