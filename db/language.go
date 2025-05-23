package db

import (
	"context"
	"time"

	"github.com/yorukot/mhcat/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func FindGuildLanguageSetting(guildId string) (data model.Lanuage, err error) {
	filter := bson.M{"guildId": guildId}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = languageCollection.FindOne(ctx, filter).Decode(&data)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return data, nil
		}
		return data, err
	}

	return data, err
}

func FileOneAndUpdateGuildLanguageSetting(insertData model.Lanuage) (data model.Lanuage, err error) {
	filter := bson.M{"guildId": insertData.GuildId}
	updateData := bson.M{"$set": insertData}

	mongodbOptions := options.FindOneAndUpdate().SetUpsert(true).SetReturnDocument(options.After)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = languageCollection.FindOneAndUpdate(ctx, filter, updateData, mongodbOptions).Decode(&data)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return data, nil
		}
		return data, err
	}

	return data, err
}
