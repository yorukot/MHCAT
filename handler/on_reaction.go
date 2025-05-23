package handler

import (
	"github.com/bwmarrin/discordgo"
	"github.com/charmbracelet/log"
	"github.com/yorukot/mhcat/db"
	it "github.com/yorukot/mhcat/locales"
)

// OnReaction handles the MessageReactionAdd event
func OnReaction(s *discordgo.Session, r *discordgo.MessageReactionAdd) {
	// Ignore bot reactions
	if r.UserID == s.State.User.ID {
		return
	}

	// Format emoji identifier for database lookup
	var emojiIdentifier string
	if r.Emoji.ID != "" {
		// For custom emoji
		if r.Emoji.Animated {
			emojiIdentifier = "a:" + r.Emoji.Name + ":" + r.Emoji.ID
		} else {
			emojiIdentifier = r.Emoji.Name + ":" + r.Emoji.ID
		}
	} else {
		// For standard emoji
		emojiIdentifier = r.Emoji.Name
	}

	// Get the reaction role configuration - try new format first
	reactionRole, err := db.GetReactionRoleByMessageAndEmoji(r.MessageID, emojiIdentifier)
	if err != nil && r.Emoji.ID != "" {
		// If not found with new format and it's a custom emoji, try old format (emoji ID only) for backward compatibility
		reactionRole, err = db.GetReactionRoleByMessageAndEmoji(r.MessageID, r.Emoji.ID)
		if err != nil {
			// Not a reaction role message or emoji
			return
		}
	} else if err != nil {
		// Not a reaction role message or emoji
		return
	}

	// Add the role to the user
	err = s.GuildMemberRoleAdd(r.GuildID, r.UserID, reactionRole.Role)
	if err != nil {
		log.Error("Failed to add role to user", "error", err, "userID", r.UserID, "roleID", reactionRole.Role)
		return
	}

	// Send notification if enabled
	if reactionRole.Notify {
		// Get guild's language setting or default to English
		guildLanguage := "en"
		language, err := db.FindGuildLanguageSetting(r.GuildID)
		if err == nil {
			guildLanguage = language.Language
		}

		// Get role details
		role, err := s.State.Role(r.GuildID, reactionRole.Role)
		if err != nil {
			log.Error("Failed to get role details", "error", err, "roleID", reactionRole.Role)
			return
		}

		// Create DM channel with the user
		dmChannel, err := s.UserChannelCreate(r.UserID)
		if err != nil {
			log.Error("Failed to create DM channel", "error", err, "userID", r.UserID)
			return
		}

		// Send DM to the user
		message := it.I18n.Tr(guildLanguage, "role.notification.assigned", role.Name)
		_, err = s.ChannelMessageSend(dmChannel.ID, message)
		if err != nil {
			log.Error("Failed to send DM", "error", err, "userID", r.UserID)
		}
	}
}

// OnReactionRemove handles the MessageReactionRemove event
func OnReactionRemove(s *discordgo.Session, r *discordgo.MessageReactionRemove) {
	// Ignore bot reactions
	if r.UserID == s.State.User.ID {
		return
	}

	// Format emoji identifier for database lookup
	var emojiIdentifier string
	if r.Emoji.ID != "" {
		// For custom emoji
		if r.Emoji.Animated {
			emojiIdentifier = "a:" + r.Emoji.Name + ":" + r.Emoji.ID
		} else {
			emojiIdentifier = r.Emoji.Name + ":" + r.Emoji.ID
		}
	} else {
		// For standard emoji
		emojiIdentifier = r.Emoji.Name
	}

	// Get the reaction role configuration - try new format first
	reactionRole, err := db.GetReactionRoleByMessageAndEmoji(r.MessageID, emojiIdentifier)
	if err != nil && r.Emoji.ID != "" {
		// If not found with new format and it's a custom emoji, try old format (emoji ID only) for backward compatibility
		reactionRole, err = db.GetReactionRoleByMessageAndEmoji(r.MessageID, r.Emoji.ID)
		if err != nil {
			// Not a reaction role message or emoji
			return
		}
	} else if err != nil {
		// Not a reaction role message or emoji
		return
	}

	// Remove the role from the user
	err = s.GuildMemberRoleRemove(r.GuildID, r.UserID, reactionRole.Role)
	if err != nil {
		log.Error("Failed to remove role from user", "error", err, "userID", r.UserID, "roleID", reactionRole.Role)
		return
	}

	// Send notification if enabled
	if reactionRole.Notify {
		// Get guild's language setting or default to English
		guildLanguage := "en"
		language, err := db.FindGuildLanguageSetting(r.GuildID)
		if err == nil {
			guildLanguage = language.Language
		}

		// Get role details
		role, err := s.State.Role(r.GuildID, reactionRole.Role)
		if err != nil {
			log.Error("Failed to get role details", "error", err, "roleID", reactionRole.Role)
			return
		}

		// Create DM channel with the user
		dmChannel, err := s.UserChannelCreate(r.UserID)
		if err != nil {
			log.Error("Failed to create DM channel", "error", err, "userID", r.UserID)
			return
		}

		// Send DM to the user
		message := it.I18n.Tr(guildLanguage, "role.notification.removed", role.Name)
		_, err = s.ChannelMessageSend(dmChannel.ID, message)
		if err != nil {
			log.Error("Failed to send DM", "error", err, "userID", r.UserID)
		}
	}
}
