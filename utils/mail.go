package utils

import (
	"gopkg.in/mail.v2"
	"os"
	"strconv"
)

func SendAppointmentEmail(to string, subject string, body string) error {
	m := mail.NewMessage()
	m.SetHeader("From", os.Getenv("SMTP_SENDER")) // example: service@example.com
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	port, _ := strconv.Atoi(os.Getenv("SMTP_PORT"))
	d := mail.NewDialer(
		os.Getenv("SMTP_HOST"),
		port,
		os.Getenv("SMTP_USER"),
		os.Getenv("SMTP_PASSWORD"),
	)

	return d.DialAndSend(m)
}
