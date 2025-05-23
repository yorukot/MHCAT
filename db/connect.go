package db

import (
	"context"
	"time"

	"github.com/charmbracelet/log"
	"go.mongodb.org/mongo-driver/mongo"
)

var Database *mongo.Database

var (
	languageCollection     *mongo.Collection
	reactionRoleCollection *mongo.Collection
)

func DatabaseCollectionSet() {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Create language collection
	err := Database.CreateCollection(ctx, "language")
	if err != nil {
		log.Error("Fail create language collection", err)
	}
	languageCollection = Database.Collection("language")

	// Create reaction role collection
	err = Database.CreateCollection(ctx, "reaction_roles")
	if err != nil {
		log.Error("Fail create reaction_roles collection", err)
	}
	reactionRoleCollection = Database.Collection("reaction_roles")
}
