# syntax=docker/dockerfile:1
FROM golang:1.23-alpine

# Устанавливаем рабочую директорию
WORKDIR /go/src/app

# Копируем зависимости
COPY go.mod go.sum ./
RUN go mod download

# Копируем остальной код проекта
COPY . .

# Сборка бинарника в /go/src/app
RUN go build -o main .

# Открываем порт
EXPOSE 8080

# Запускаем приложение
CMD ["./main"]
