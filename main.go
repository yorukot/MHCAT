package main

import (
	"fmt"

	"github.com/bwmarrin/discordgo"
	"github.com/spf13/cobra"
	botcmd "github.com/yorukot/mhcat/cmd"
	cfg "github.com/yorukot/mhcat/config"
)

func main() {
	// Root command - starts the bot by default
	rootCmd := &cobra.Command{
		Use:   "",
		Run: func(cmd *cobra.Command, args []string) {
			// Default behavior is to start the bot
			botcmd.Start()
		},
	}

	// Add clear-commands subcommand
	clearCmd := &cobra.Command{
		Use:   "clear-commands",
		Run: func(cmd *cobra.Command, args []string) {
			clearSlashCommands()
		},
	}

	// Add subcommands to root command
	rootCmd.AddCommand(clearCmd)

	// Execute the root command
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
	}
}

// clearSlashCommands removes all slash commands from Discord
func clearSlashCommands() {
	// Load configuration
	cfg.LoadConfig()

	// Create Discord session
	dg, err := discordgo.New("Bot " + cfg.BotConfig.DiscordToken)
	if err != nil {
		fmt.Println("Error creating Discord session:", err)
		return
	}

	// Open connection
	err = dg.Open()
	if err != nil {
		fmt.Println("Error opening connection:", err)
		return
	}
	defer dg.Close()

	// Get application ID
	app, err := dg.Application("@me")
	if err != nil {
		fmt.Println("Error getting application:", err)
		return
	}

	// Delete all global commands
	commands, err := dg.ApplicationCommands(app.ID, "")
	if err != nil {
		fmt.Println("Error getting commands:", err)
		return
	}

	fmt.Printf("Found %d global commands to delete\n", len(commands))
	for _, cmd := range commands {
		fmt.Printf("Deleting command: %s\n", cmd.Name)
		err := dg.ApplicationCommandDelete(app.ID, "", cmd.ID)
		if err != nil {
			fmt.Printf("Error deleting command %s: %v\n", cmd.Name, err)
		}
	}

	fmt.Println("All slash commands have been cleared successfully.")
}
