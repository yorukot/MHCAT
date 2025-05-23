package handler

import (
	"github.com/bwmarrin/discordgo"
	slashcommand "github.com/yorukot/mhcat/slash_command"
)

func OnSlashCommand(s *discordgo.Session, i *discordgo.InteractionCreate) {
	if h, ok := commandHandlers[i.ApplicationCommandData().Name]; ok {
		h(s, i)
	}
}

var commandHandlers = map[string]func(s *discordgo.Session, i *discordgo.InteractionCreate){
	"set-language":  slashcommand.LocalesCommandRun,
	"reaction-role": slashcommand.ReactionRoleCommandRun,
}
