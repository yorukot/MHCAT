package cmd

import (
	"github.com/bwmarrin/discordgo"
	slashcommand "github.com/yorukot/mhcat/slash_command"
)

var slashCommandsList = []*discordgo.ApplicationCommand{
	&slashcommand.LocalesCommand,
	&slashcommand.ReactionRoleCommand,
}
