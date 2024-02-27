package db

import (
	"fmt"
	"os"
	"stellar/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB
var err error

func Init() {
	DB, err = gorm.Open(postgres.Open(os.Getenv("DSN")), &gorm.Config{
		Logger: logger.Discard.LogMode(logger.Error),
	})
	if err != nil {
		panic(err.Error())
	}
	fmt.Println("Connected to DB")

	migrationErr := DB.AutoMigrate(
		&models.User{},
    &models.Message{},
	)
	if migrationErr != nil {
		panic(err.Error())
	}

	fmt.Println("DB Migration complete")
}
