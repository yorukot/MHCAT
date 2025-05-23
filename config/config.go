package cfg

import (
	"os"

	"github.com/charmbracelet/log"
	"github.com/joho/godotenv"
)

type BotConfigType struct {
	DiscordToken         string
	MongodbConnectString string
	MongodbDatabaseName  string
}

type ImageConfigType struct {
	FooterIconUrl string
}

var BotConfig BotConfigType
var ImageConfig ImageConfigType

// LoadConfig loads configuration from environment variables
func LoadConfig() {
	// Load .env file if it exists
	err := godotenv.Load()
	if err != nil {
		log.Info("No .env file found, using environment variables")
	}

	BotConfig.DiscordToken = os.Getenv("DISCORD_TOKEN")
	BotConfig.MongodbConnectString = os.Getenv("MONGODB_CONNECT_STRING")
	BotConfig.MongodbDatabaseName = os.Getenv("MONGODB_DATABASE_NAME")

	// Set default database name if not provided
	if BotConfig.MongodbDatabaseName == "" {
		BotConfig.MongodbDatabaseName = "mhcat"
	}

	// Validate required configs
	if BotConfig.DiscordToken == "" {
		log.Warn("DISCORD_TOKEN environment variable is not set")
	}

	if BotConfig.MongodbConnectString == "" {
		log.Warn("MONGODB_CONNECT_STRING environment variable is not set")
	}
}

// LoadImageConfig loads image configuration from environment variables
func LoadImageConfig() {
	ImageConfig.FooterIconUrl = os.Getenv("FOOTER_ICON_URL")

	// Set default icon URL if not provided
	if ImageConfig.FooterIconUrl == "" {
		ImageConfig.FooterIconUrl = "https://i.imgur.com/AQAodBA.png"
	}
}
