package models

import "gorm.io/gorm"

type Service struct {
	gorm.Model
	Name        string `json:"name" binding:"required"`
	Description string `json:"description" binding:"required"`
	Price       int    `json:"price" binding:"required"`
	Duration    int    `json:"duration" binding:"required"`
	Category    string `json:"category" binding:"required"`
	Image       string `json:"image"` // Фото специалиста
	Specialist  string `json:"specialist"`
	Available   bool   `json:"available"`
}
