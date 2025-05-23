package cmd

import (
	"context"
	"fmt"
	"slices"
	"time"

	"github.com/charmbracelet/log"
	cfg "github.com/yorukot/mhcat/config"
	"github.com/yorukot/mhcat/db"
	slashcommand "github.com/yorukot/mhcat/slash_command"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func initConfig() {
	cfg.LoadConfig()
}

func initImageConfig() {
	cfg.LoadImageConfig()
}

// initCommand initializes the slash command
func initCommand() {
	slashcommand.InitLocalesCommand()
	slashcommand.InitReactionRoleCommand()
}

func connectToMongodb() {
	var err error
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.BotConfig.MongodbConnectString))

	if err != nil {
		log.Error("Error connect to mongodb", err)
		return
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Error("Fail to connect to mongodb", err)
		return
	}
	db.Database = client.Database(cfg.BotConfig.MongodbDatabaseName)

	ctx, cancel = context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	collections, _ := db.Database.ListCollectionNames(ctx, bson.D{})

	// if database doesn't exist than create one
	if len(collections) == 0 {
		log.Info(fmt.Sprintf("Database '%s' does not exist. Creating...", db.Database.Name()))

		ctx, cancel = context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		_, err := db.Database.Collection("temp").InsertOne(ctx, bson.M{"check": true})
		if err != nil {
			log.Fatal(err)
		}
		log.Info(fmt.Sprintf("Database '%s' created successfully.", db.Database.Name()))
	} else if slices.Contains(collections, "temp") && len(collections) > 1 {

		ctx, cancel = context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		db.Database.Collection("temp").Drop(ctx)
	}

	db.DatabaseCollectionSet()

	log.Info("Successful connect to mongodb")
}
