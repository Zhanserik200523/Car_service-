package controllers

import (
	"car-service/database"
	"car-service/models"
	"car-service/utils"

	"github.com/gin-gonic/gin"
	"net/http"
)

func CreateAppointment(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var input struct {
		CarID     uint   `json:"car_id"`
		ServiceID uint   `json:"service_id"`
		Date      string `json:"date"`
		Time      string `json:"time"` // 👈 Добавили время
		Comment   string `json:"comment"`
	}

	// Валидация данных
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Проверка: занят ли слот на это время
	var existing models.Appointment
	if err := database.DB.Where("date = ? AND time = ?", input.Date, input.Time).First(&existing).Error; err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Этот временной слот уже занят. Пожалуйста, выберите другое время."})
		return
	}

	// Создание записи
	app := models.Appointment{
		UserID:    userID.(uint),
		CarID:     input.CarID,
		ServiceID: input.ServiceID,
		Date:      input.Date,
		Time:      input.Time,
		Comment:   input.Comment,
	}

	if err := database.DB.Create(&app).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при создании записи"})
		return
	}
	go func() {
		car := models.Car{}
		service := models.Service{}
		user := models.User{}

		database.DB.First(&car, app.CarID)
		database.DB.First(&service, app.ServiceID)
		database.DB.First(&user, userID)

		body := "<h3>Новая запись!</h3>" +
			"<p><strong>Клиент:</strong> " + user.Email + "</p>" +
			"<p><strong>Имя:</strong> " + user.FirstName + " " + user.LastName + "</p>" +
			"<p><strong>Машина:</strong> " + car.Brand + " " + car.CarModel + "</p>" +
			"<p><strong>Услуга:</strong> " + service.Name + "</p>" +
			"<p><strong>Дата:</strong> " + app.Date + " " + app.Time + "</p>"

		err := utils.SendAppointmentEmail("zhanserik200523@gmail.com", "Новая запись на СТО", body)
		if err != nil {
			println("❌ Ошибка отправки почты:", err.Error())
		} else {
			println("✅ Письмо успешно отправлено")
		}
	}()

	c.JSON(http.StatusCreated, gin.H{"message": "Вы успешно записались на услугу!"})
}

func GetUserAppointments(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Не авторизован"})
		return
	}

	var appointments []models.Appointment
	if err := database.DB.
		Preload("Car").
		Preload("Service"). // 👈 Добавь это
		Where("user_id = ?", userID).
		Find(&appointments).Error; err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка загрузки записей"})
		return
	}

	c.JSON(http.StatusOK, appointments)
}

func DeleteAppointment(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Не авторизован"})
		return
	}

	appointmentID := c.Param("id")

	var appointment models.Appointment
	if err := database.DB.First(&appointment, appointmentID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Запись не найдена"})
		return
	}

	if appointment.UserID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Нет прав на удаление этой записи"})
		return
	}

	database.DB.Delete(&appointment)

	c.JSON(http.StatusOK, gin.H{"message": "Запись успешно удалена"})
}
func GetAllAppointments(c *gin.Context) {
	var apps []models.Appointment
	database.DB.
		Preload("User").
		Preload("Car").
		Preload("Service").
		Find(&apps)

	c.JSON(http.StatusOK, apps)
}
