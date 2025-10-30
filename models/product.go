package models

type Product struct {
	ID          uint   `json:"id" gorm:"primaryKey"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Price       int    `json:"price"`    // в тенге
	Quantity    int    `json:"quantity"` // количество на складе
	Category    string `json:"category"` // например: Масло, Антифриз, Фильтр
	Image       string `json:"image"`
}
