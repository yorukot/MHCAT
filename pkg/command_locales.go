package pkg

import (
	"github.com/bwmarrin/discordgo"
	it "github.com/yorukot/mhcat/locales"
)

func SlashCommandLocalizations(translate_id string) *map[discordgo.Locale]string {
	localizations := map[discordgo.Locale]string{
		discordgo.ChineseTW: it.I18n.Tr("zh-TW", translate_id),
		discordgo.ChineseCN: it.I18n.Tr("zh-CN", translate_id),
	}
	return &localizations
}

func SlashCommandOptionsLocalizations(translate_id string) map[discordgo.Locale]string {
	localizations := map[discordgo.Locale]string{
		discordgo.ChineseTW: it.I18n.Tr("zh-TW", translate_id),
		discordgo.ChineseCN: it.I18n.Tr("zh-CN", translate_id),
		discordgo.EnglishUS: it.I18n.Tr("en", translate_id),
	}
	return localizations
}
