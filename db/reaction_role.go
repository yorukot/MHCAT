package db

import (
	"context"
	"time"

	"github.com/charmbracelet/log"
	"github.com/yorukot/mhcat/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// CreateReactionRole saves a new reaction role to the database
func CreateReactionRole(reactionRole model.ReactionRole) (model.ReactionRole, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Generate a unique ID
	reactionRole.ID = primitive.NewObjectID().Hex()

	_, err := reactionRoleCollection.InsertOne(ctx, reactionRole)
	if err != nil {
		log.Error("Error inserting reaction role", "error", err)
		return reactionRole, err
	}

	return reactionRole, nil
}

// GetReactionRoleByMessageAndEmoji retrieves a reaction role by message ID and emoji
func GetReactionRoleByMessageAndEmoji(messageID, emoji string) (model.ReactionRole, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var reactionRole model.ReactionRole
	filter := bson.M{"message": messageID, "react": emoji}

	err := reactionRoleCollection.FindOne(ctx, filter).Decode(&reactionRole)
	if err != nil {
		return reactionRole, err
	}

	return reactionRole, nil
}

// GetReactionRolesByGuild retrieves all reaction roles for a specific guild
func GetReactionRolesByGuild(guildID string) ([]model.ReactionRole, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var reactionRoles []model.ReactionRole
	filter := bson.M{"guild": guildID}

	cursor, err := reactionRoleCollection.Find(ctx, filter)
	if err != nil {
		return reactionRoles, err
	}
	defer cursor.Close(ctx)

	if err = cursor.All(ctx, &reactionRoles); err != nil {
		log.Error("Error decoding reaction roles", "error", err)
		return reactionRoles, err
	}

	return reactionRoles, nil
}

// DeleteReactionRole removes a reaction role from the database
func DeleteReactionRole(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": id}
	_, err := reactionRoleCollection.DeleteOne(ctx, filter)
	if err != nil {
		log.Error("Error deleting reaction role", "error", err, "id", id)
		return err
	}

	return nil
}
