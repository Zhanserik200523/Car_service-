package models

import "gorm.io/gorm"

type Appointment struct {
	gorm.Model
	UserID    uint   `json:"user_id"`
	CarID     uint   `json:"car_id"`
	Date      string `json:"date"`
	Comment   string `json:"comment"`
	ServiceID uint   `json:"service_id"`
	Time      string `json:"time"`

	User    User    `gorm:"foreignKey:UserID"`
	Car     Car     `gorm:"foreignKey:CarID"`
	Service Service `gorm:"foreignKey:ServiceID"`
}
