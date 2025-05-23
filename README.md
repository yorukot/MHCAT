# mhcat

## Configuration

MHCAT uses environment variables for configuration. You can set these in your system environment or use a `.env` file in the project root.

### Environment Variables

Copy the template file to create your `.env` file:

```bash
cp config/template.env .env
```

Then edit the `.env` file and fill in the following values:

```
# Discord Bot Token
DISCORD_TOKEN=your_discord_token

# MongoDB Configuration
MONGODB_CONNECT_STRING=mongodb://localhost:27017
MONGODB_DATABASE_NAME=mhcat

# Image Configuration
FOOTER_ICON_URL=https://i.imgur.com/AQAodBA.png
```

Required variables:
- `DISCORD_TOKEN`: Your Discord bot token
- `MONGODB_CONNECT_STRING`: MongoDB connection string

Optional variables:
- `MONGODB_DATABASE_NAME`: Name of the MongoDB database (default: "mhcat")
- `FOOTER_ICON_URL`: URL for the footer icon (default: "https://i.imgur.com/AQAodBA.png")