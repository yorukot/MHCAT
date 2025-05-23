# MHCAT Discord Bot - Coolify Deployment Guide

This guide will help you deploy the MHCAT Discord Bot on Coolify.

## Prerequisites

1. A Coolify instance (v4.x)
2. A Discord Bot Token
3. A MongoDB database (can be external or deployed on Coolify)
4. Git repository access

## Deployment Steps

### 1. Create New Application in Coolify

1. Log into your Coolify dashboard
2. Click "New Resource" → "Application"
3. Choose "Docker Compose" as the build pack
4. Connect your Git repository

### 2. Configure Git Repository

- **Repository URL**: `https://github.com/your-username/mhcat.git`
- **Branch**: `main`
- **Build Pack**: Docker Compose
- **Docker Compose File**: `docker-compose.yml`

### 3. Set Environment Variables

In the Coolify dashboard, add the following environment variables:

#### Required Variables
```
DISCORD_TOKEN=your_discord_bot_token_here
MONGODB_URI=mongodb://username:password@host:port/database
MONGODB_DATABASE=mhcat
```

#### Optional Variables
```
DEFAULT_LANGUAGE=en
```

### 4. Deploy

1. Click "Deploy" in your Coolify dashboard
2. Monitor the build logs
3. Once deployed, check the application logs to ensure it's running correctly

## Environment Variables Details

### DISCORD_TOKEN
- **Type**: Secret
- **Description**: Your Discord bot token from Discord Developer Portal
- **Required**: Yes

### MONGODB_URI
- **Type**: Secret
- **Description**: MongoDB connection string
- **Format**: `mongodb://username:password@host:port/database`
- **Required**: Yes

### MONGODB_DATABASE
- **Type**: String
- **Description**: Name of the MongoDB database
- **Default**: `mhcat`
- **Required**: Yes

### DEFAULT_LANGUAGE
- **Type**: String
- **Description**: Default language for the bot
- **Options**: `en` (English) or `zh-TW` (Traditional Chinese)
- **Default**: `en`
- **Required**: No

## MongoDB Setup Options

### Option 1: External MongoDB (Recommended)
Use MongoDB Atlas or any external MongoDB service:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mhcat
```

### Option 2: Deploy MongoDB on Coolify
1. Create a new "Database" resource in Coolify
2. Choose MongoDB
3. Configure username/password
4. Use the internal connection string in your bot configuration

## Troubleshooting

### Bot Not Starting
1. Check environment variables are set correctly
2. Verify Discord token is valid
3. Ensure MongoDB connection is working

### Permission Issues
1. Verify bot has necessary Discord permissions
2. Check bot is added to your Discord server
3. Ensure bot role has required permissions

## Updating the Bot

Coolify will automatically rebuild and redeploy when you push changes to your Git repository. The Docker layer caching will ensure dependencies aren't reinstalled unless `go.mod` or `go.sum` changes. 