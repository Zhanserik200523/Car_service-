package models

import "gorm.io/gorm"

type Car struct {
	gorm.Model
	Brand    string `json:"brand" binding:"required"`
	CarModel string `json:"model" binding:"required"` // изменили имя
	Year     int    `json:"year" binding:"required"`
	UserID   uint   `json:"user_id"`
}
