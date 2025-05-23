package pkg

import (
	"fmt"

	"github.com/bwmarrin/discordgo"
	cfg "github.com/yorukot/mhcat/config"
	it "github.com/yorukot/mhcat/locales"
)

func ErrorEmbed(message string, err error, locale string) *discordgo.MessageEmbed {
	embed := &discordgo.MessageEmbed{
		Title: it.I18n.Tr(locale, message),
		Color: ErrorColor,
		Footer: &discordgo.MessageEmbedFooter{
			IconURL: cfg.ImageConfig.FooterIconUrl,
			Text:    it.I18n.Tr(locale, "error.report_this_error"),
		},
	}

	// Only add error description if err is not nil
	if err != nil {
		embed.Description = fmt.Sprintf("```%s```", err.Error())
	}

	return embed
}

func Successful(message string, locale string, args ...interface{}) *discordgo.MessageEmbed {
	return &discordgo.MessageEmbed{
		Title: it.I18n.Tr(locale, message, args...),
		Color: SuccessfulColor,
		Footer: &discordgo.MessageEmbedFooter{
			IconURL: cfg.ImageConfig.FooterIconUrl,
			Text:    it.I18n.Tr(locale, "info.bio"),
		},
	}
}
