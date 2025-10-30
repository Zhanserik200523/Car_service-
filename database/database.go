package database

import (
	"car-service/models"
	"fmt"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	dsn := "host=localhost user=postgres password=20050330 dbname=car_service port=5432 sslmode=disable"

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Ошибка подключения к базе данных: ", err)
	}

	fmt.Println("Успешное подключение к базе данных!")
	DB.AutoMigrate(&models.User{}, &models.Car{}, &models.Appointment{}, &models.Service{}, &models.Product{})
}

//package database
//
//import (
//	"car-service/models"
//	"fmt"
//	"log"
//	"os"
//
//	"gorm.io/driver/postgres"
//	"gorm.io/gorm"
//)
//
//var DB *gorm.DB
//
//func ConnectDB() {
//	dsn := fmt.Sprintf(
//		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
//		os.Getenv("DB_HOST"),
//		os.Getenv("DB_PORT"),
//		os.Getenv("DB_USER"),
//		os.Getenv("DB_PASSWORD"),
//		os.Getenv("DB_NAME"),
//	)
//
//	var err error
//	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
//	if err != nil {
//		log.Fatal("❌ Ошибка подключения к базе данных:", err)
//	}
//
//	fmt.Println("✅ Успешное подключение к базе данных!")
//
//	// Миграция моделей
//	DB.AutoMigrate(&models.User{}, &models.Car{}, &models.Appointment{}, &models.Service{}, &models.Product{})
//}
