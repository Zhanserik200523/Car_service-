package main

import (
	"car-service/controllers"
	"car-service/database"
	"car-service/middlewares"
	"github.com/gin-gonic/gin"
	"log"
)
import "github.com/joho/godotenv"

func init() {
	if err := godotenv.Load(); err != nil {
		log.Fatal("❌ .env файл не загружен")
	}
}

func main() {
	database.ConnectDB()

	r := gin.Default()

	// Статика (если надо будет)
	r.Static("/static", "./static")

	r.LoadHTMLGlob("templates/*")

	r.GET("/login", func(c *gin.Context) {
		c.HTML(200, "login.html", nil)
	})

	r.GET("/register", func(c *gin.Context) {
		c.HTML(200, "register.html", nil)
	})

	r.GET("/", func(c *gin.Context) {
		c.HTML(200, "index.html", nil)
	})

	r.GET("/add-car", func(c *gin.Context) {
		c.HTML(200, "add_car.html", nil)
	})
	r.GET("/cars", func(c *gin.Context) {
		c.HTML(200, "cars.html", nil)
	})
	r.GET("/profile", func(c *gin.Context) {
		c.HTML(200, "profile.html", nil)
	})
	r.GET("/appointment", func(c *gin.Context) {
		c.HTML(200, "appointment.html", nil)
	})
	r.GET("/admin_panel", func(c *gin.Context) {
		c.HTML(200, "admin_panel.html", nil)
	})
	r.GET("/services", func(c *gin.Context) {
		c.HTML(200, "services.html", nil)
	})
	r.GET("/catalog_services", func(c *gin.Context) {
		c.HTML(200, "catalog_services.html", nil)
	})
	r.GET("/products", func(c *gin.Context) {
		c.HTML(200, "products.html", nil)
	})
	r.GET("/catalog_products", func(c *gin.Context) {
		c.HTML(200, "catalog_products.html", nil)
	})

	// Группа API
	api := r.Group("/api")
	{
		api.POST("/register", controllers.Register)
		api.POST("/login", controllers.Login)
		api.GET("/services", controllers.GetServices)
		api.GET("/products", controllers.GetProducts)

		// Защищённые маршруты
		protected := api.Group("/")
		protected.Use(middlewares.AuthMiddleware())
		protected.GET("/cars", controllers.GetCars)
		protected.DELETE("/cars/:id", controllers.DeleteCar)
		protected.PUT("/cars/:id", controllers.UpdateCar)
		protected.GET("/profile", controllers.GetProfile)
		protected.POST("/change-password", controllers.ChangePassword)
		protected.POST("/upload-avatar", controllers.UploadAvatar)
		protected.POST("/update-profile", controllers.UpdateProfile)
		protected.POST("/appointment", controllers.CreateAppointment)
		protected.GET("/appointments", controllers.GetUserAppointments)
		protected.DELETE("/appointments/:id", controllers.DeleteAppointment)
		//protected.GET("/products", controllers.GetProducts)

		{
			protected.POST("/add-car", controllers.AddCar)
			// Потом сюда добавим /profile, /appointments и т.д.
		}
		admin := protected.Group("/admin", middlewares.AdminOnly())
		admin.DELETE("/users/:id", controllers.DeleteUserByAdmin)
		admin.GET("/users", controllers.GetAllUsers)
		admin.GET("/appointments", controllers.GetAllAppointments)
		admin.PUT("/users/:id/role", controllers.UpdateUserRole)
		admin.POST("/services", controllers.AddService)
		admin.GET("/services", controllers.GetServices)
		admin.DELETE("/services/:id", controllers.DeleteService)
		admin.POST("/products", controllers.CreateProduct)
		admin.DELETE("/products/:id", controllers.DeleteProduct)
		admin.PUT("/services/:id", controllers.UpdateService)
		admin.PUT("/products/:id", controllers.UpdateProduct)
	}

	r.Run(":8080")
}
