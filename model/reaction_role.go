package model

import "time"

type ReactionRole struct {
	ID        string    `json:"_id" bson:"_id"`
	Guild     string    `json:"guild" bson:"guild"`
	Message   string    `json:"message" bson:"message"`
	React     string    `json:"react" bson:"react"`
	Role      string    `json:"role" bson:"role"`
	Notify    bool      `json:"notify" bson:"notify"`
	CreatedAt time.Time `json:"createdAt" bson:"createdAt"`
}
