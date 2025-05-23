package slashcommand

import (
	"errors"
	"fmt"
	"regexp"
	"strings"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/charmbracelet/log"
	"github.com/yorukot/mhcat/db"
	it "github.com/yorukot/mhcat/locales"
	"github.com/yorukot/mhcat/model"
	"github.com/yorukot/mhcat/pkg"
)

var ReactionRoleCommand = discordgo.ApplicationCommand{}

// Regular expression to extract emoji information
var customEmojiRegex = regexp.MustCompile(`<:([^:]+):(\d+)>`)
var animatedEmojiRegex = regexp.MustCompile(`<a:([^:]+):(\d+)>`)

func InitReactionRoleCommand() {
	ReactionRoleCommand = discordgo.ApplicationCommand{
		Name:                     it.I18n.Tr("en", "slashcmd.reaction_role.name"),
		Description:              it.I18n.Tr("en", "slashcmd.reaction_role.description"),
		NameLocalizations:        pkg.SlashCommandLocalizations("slashcmd.reaction_role.name"),
		DescriptionLocalizations: pkg.SlashCommandLocalizations("slashcmd.reaction_role.description"),
		Options: []*discordgo.ApplicationCommandOption{
			{
				Name:                     it.I18n.Tr("en", "slashcmd.reaction_role.subcommands.add.name"),
				Description:              it.I18n.Tr("en", "slashcmd.reaction_role.subcommands.add.description"),
				NameLocalizations:        pkg.SlashCommandOptionsLocalizations("slashcmd.reaction_role.subcommands.add.name"),
				DescriptionLocalizations: pkg.SlashCommandOptionsLocalizations("slashcmd.reaction_role.subcommands.add.description"),
				Type:                     discordgo.ApplicationCommandOptionSubCommand,
				Options: []*discordgo.ApplicationCommandOption{
					{
						Name:                     it.I18n.Tr("en", "slashcmd.reaction_role.options.messageURL.name"),
						Description:              it.I18n.Tr("en", "slashcmd.reaction_role.options.messageURL.description"),
						NameLocalizations:        pkg.SlashCommandOptionsLocalizations("slashcmd.reaction_role.options.messageURL.name"),
						DescriptionLocalizations: pkg.SlashCommandOptionsLocalizations("slashcmd.reaction_role.options.messageURL.description"),
						Type:                     discordgo.ApplicationCommandOptionString,
						Required:                 true,
					},
					{
						Name:                     it.I18n.Tr("en", "slashcmd.reaction_role.options.emoji.name"),
						Description:              it.I18n.Tr("en", "slashcmd.reaction_role.options.emoji.description"),
						NameLocalizations:        pkg.SlashCommandOptionsLocalizations("slashcmd.reaction_role.options.emoji.name"),
						DescriptionLocalizations: pkg.SlashCommandOptionsLocalizations("slashcmd.reaction_role.options.emoji.description"),
						Type:                     discordgo.ApplicationCommandOptionString,
						Required:                 true,
					},
					{
						Name:                     it.I18n.Tr("en", "slashcmd.reaction_role.options.role.name"),
						Description:              it.I18n.Tr("en", "slashcmd.reaction_role.options.role.description"),
						NameLocalizations:        pkg.SlashCommandOptionsLocalizations("slashcmd.reaction_role.options.role.name"),
						DescriptionLocalizations: pkg.SlashCommandOptionsLocalizations("slashcmd.reaction_role.options.role.description"),
						Type:                     discordgo.ApplicationCommandOptionRole,
						Required:                 true,
					},
					{
						Name:                     it.I18n.Tr("en", "slashcmd.reaction_role.options.notify.name"),
						Description:              it.I18n.Tr("en", "slashcmd.reaction_role.options.notify.description"),
						NameLocalizations:        pkg.SlashCommandOptionsLocalizations("slashcmd.reaction_role.options.notify.name"),
						DescriptionLocalizations: pkg.SlashCommandOptionsLocalizations("slashcmd.reaction_role.options.notify.description"),
						Type:                     discordgo.ApplicationCommandOptionBoolean,
						Required:                 false,
					},
				},
			},
			{
				Name:                     it.I18n.Tr("en", "slashcmd.reaction_role.subcommands.delete.name"),
				Description:              it.I18n.Tr("en", "slashcmd.reaction_role.subcommands.delete.description"),
				NameLocalizations:        pkg.SlashCommandOptionsLocalizations("slashcmd.reaction_role.subcommands.delete.name"),
				DescriptionLocalizations: pkg.SlashCommandOptionsLocalizations("slashcmd.reaction_role.subcommands.delete.description"),
				Type:                     discordgo.ApplicationCommandOptionSubCommand,
				Options: []*discordgo.ApplicationCommandOption{
					{
						Name:                     it.I18n.Tr("en", "slashcmd.reaction_role.options.number.name"),
						Description:              it.I18n.Tr("en", "slashcmd.reaction_role.options.number.description"),
						NameLocalizations:        pkg.SlashCommandOptionsLocalizations("slashcmd.reaction_role.options.number.name"),
						DescriptionLocalizations: pkg.SlashCommandOptionsLocalizations("slashcmd.reaction_role.options.number.description"),
						Type:                     discordgo.ApplicationCommandOptionInteger,
						Required:                 false,
					},
					{
						Name:                     it.I18n.Tr("en", "slashcmd.reaction_role.options.messageURL.name"),
						Description:              it.I18n.Tr("en", "slashcmd.reaction_role.options.messageURL.description"),
						NameLocalizations:        pkg.SlashCommandOptionsLocalizations("slashcmd.reaction_role.options.messageURL.name"),
						DescriptionLocalizations: pkg.SlashCommandOptionsLocalizations("slashcmd.reaction_role.options.messageURL.description"),
						Type:                     discordgo.ApplicationCommandOptionString,
						Required:                 false,
					},
					{
						Name:                     it.I18n.Tr("en", "slashcmd.reaction_role.options.emoji.name"),
						Description:              it.I18n.Tr("en", "slashcmd.reaction_role.options.emoji.description"),
						NameLocalizations:        pkg.SlashCommandOptionsLocalizations("slashcmd.reaction_role.options.emoji.name"),
						DescriptionLocalizations: pkg.SlashCommandOptionsLocalizations("slashcmd.reaction_role.options.emoji.description"),
						Type:                     discordgo.ApplicationCommandOptionString,
						Required:                 false,
					},
				},
			},
			{
				Name:                     it.I18n.Tr("en", "slashcmd.reaction_role.subcommands.list.name"),
				Description:              it.I18n.Tr("en", "slashcmd.reaction_role.subcommands.list.description"),
				NameLocalizations:        pkg.SlashCommandOptionsLocalizations("slashcmd.reaction_role.subcommands.list.name"),
				DescriptionLocalizations: pkg.SlashCommandOptionsLocalizations("slashcmd.reaction_role.subcommands.list.description"),
				Type:                     discordgo.ApplicationCommandOptionSubCommand,
			},
		},
	}
}

func ReactionRoleCommandRun(s *discordgo.Session, i *discordgo.InteractionCreate) {
	options := i.ApplicationCommandData().Options
	if len(options) == 0 {
		return
	}

	// Get guild's language setting or default to English
	guildLanguage := "en"
	language, err := db.FindGuildLanguageSetting(i.GuildID)
	if err == nil {
		guildLanguage = language.Language
	}

	subcommand := options[0]
	switch subcommand.Name {
	case "add":
		handleAddReactionRole(s, i, subcommand.Options, guildLanguage)
	case "delete":
		handleDeleteReactionRole(s, i, subcommand.Options, guildLanguage)
	case "list":
		handleListReactionRoles(s, i, guildLanguage)
	}
}

func handleAddReactionRole(s *discordgo.Session, i *discordgo.InteractionCreate, options []*discordgo.ApplicationCommandInteractionDataOption, guildLanguage string) {
	// Check if the user has permission to manage roles
	permissions, err := s.State.UserChannelPermissions(i.Member.User.ID, i.ChannelID)
	if err != nil || permissions&discordgo.PermissionManageRoles == 0 {
		// Check if user is server owner (owners have all permissions)
		guild, err := s.State.Guild(i.GuildID)
		if err != nil {
			guildErr := errors.New("could not access guild information")
			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Embeds: []*discordgo.MessageEmbed{
						pkg.ErrorEmbed("slashcmd.reaction_role.error.guild_access", guildErr, guildLanguage),
					},
				},
			})
			return
		}

		// If user is not the server owner, deny access
		if guild.OwnerID != i.Member.User.ID {
			noPermissionErr := errors.New("you do not have permission to manage roles")
			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Embeds: []*discordgo.MessageEmbed{
						pkg.ErrorEmbed("slashcmd.reaction_role.error.no_permission", noPermissionErr, guildLanguage),
					},
				},
			})
			return
		}
	}

	optionMap := make(map[string]*discordgo.ApplicationCommandInteractionDataOption, len(options))
	for _, opt := range options {
		optionMap[opt.Name] = opt
	}

	// Parse message URL to get messageID and channelID
	messageURL := optionMap["message-url"].StringValue()
	urlParts := strings.Split(messageURL, "/")

	// URL format: https://discord.com/channels/GUILD_ID/CHANNEL_ID/MESSAGE_ID
	if len(urlParts) < 7 || !strings.Contains(messageURL, "discord.com/channels/") {
		messageErr := errors.New("invalid message URL, please use a valid Discord message link")
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.invalid_message", messageErr, guildLanguage),
				},
			},
		})
		return
	}

	urlGuildID := urlParts[len(urlParts)-3]
	channelID := urlParts[len(urlParts)-2]
	messageID := urlParts[len(urlParts)-1]

	// Security check: Ensure the message URL is from the same guild
	if urlGuildID != i.GuildID {
		crossGuildErr := errors.New("you can only create reaction roles for messages in this server")
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.cross_guild", crossGuildErr, guildLanguage),
				},
			},
		})
		return
	}

	// Check if user has permission to view the target channel
	targetChannelPermissions, err := s.State.UserChannelPermissions(i.Member.User.ID, channelID)
	if err != nil || targetChannelPermissions&discordgo.PermissionViewChannel == 0 {
		channelAccessErr := errors.New("you do not have permission to access the target channel")
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.channel_access", channelAccessErr, guildLanguage),
				},
			},
		})
		return
	}

	// Parse emoji
	emojiInput := optionMap["emoji"].StringValue()
	var emojiName string

	// Check if it's a custom emoji
	if matches := customEmojiRegex.FindStringSubmatch(emojiInput); len(matches) == 3 {
		// Custom emoji format: <:name:id>
		emojiName = matches[1] + ":" + matches[2]
	} else if matches := animatedEmojiRegex.FindStringSubmatch(emojiInput); len(matches) == 3 {
		// Animated emoji format: <a:name:id>
		emojiName = "a:" + matches[1] + ":" + matches[2]
	} else {
		// Standard emoji
		emojiName = emojiInput
	}

	role := optionMap["role"].RoleValue(s, i.GuildID)

	// Security check: Prevent assigning @everyone role
	if role.ID == i.GuildID {
		everyoneErr := errors.New("you cannot use @everyone role for reaction roles")
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.everyone_role", everyoneErr, guildLanguage),
				},
			},
		})
		return
	}

	// Security check: Prevent assigning managed roles (bot roles, integration roles)
	if role.Managed {
		managedRoleErr := errors.New("you cannot use managed roles (bot roles, integration roles) for reaction roles")
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.managed_role", managedRoleErr, guildLanguage),
				},
			},
		})
		return
	}

	// Check if the target role is higher than the user's highest role
	guild, err := s.State.Guild(i.GuildID)
	if err != nil {
		guildErr := errors.New("could not access guild information")
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.guild_access", guildErr, guildLanguage),
				},
			},
		})
		return
	}

	member, err := s.GuildMember(i.GuildID, i.Member.User.ID)
	if err != nil {
		memberErr := errors.New("could not access member information")
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.member_access", memberErr, guildLanguage),
				},
			},
		})
		return
	}

	// Check if user can manage this role (user's highest role must be higher than target role)
	userHighestRole := getUserHighestRole(guild, member)
	if userHighestRole != nil && role.Position >= userHighestRole.Position && guild.OwnerID != i.Member.User.ID {
		hierarchyErr := errors.New("you cannot manage a role that is higher than or equal to your highest role")
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.role_hierarchy", hierarchyErr, guildLanguage),
				},
			},
		})
		return
	}

	// Check if bot can manage this role
	botMember, err := s.GuildMember(i.GuildID, s.State.User.ID)
	if err != nil {
		botErr := errors.New("could not access bot information")
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.bot_access", botErr, guildLanguage),
				},
			},
		})
		return
	}

	botHighestRole := getUserHighestRole(guild, botMember)
	if botHighestRole != nil && role.Position >= botHighestRole.Position {
		botHierarchyErr := errors.New("bot cannot manage a role that is higher than or equal to its highest role")
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.bot_role_hierarchy", botHierarchyErr, guildLanguage),
				},
			},
		})
		return
	}

	// Default notify to false if not provided
	notify := false
	if notifyOpt, exists := optionMap["notify"]; exists {
		notify = notifyOpt.BoolValue()
	}

	// Verify the message exists
	_, err = s.ChannelMessage(channelID, messageID)
	if err != nil {
		messageErr := errors.New("could not find the specified message, make sure you're using a valid message URL and the bot has access to that channel")
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.invalid_message", messageErr, guildLanguage),
				},
			},
		})
		return
	}

	// Check if the emoji is already in the database
	_, err = db.GetReactionRoleByMessageAndEmoji(messageID, emojiName)
	if err == nil {
		reactionRoleErr := errors.New("the emoji is already in the database")
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.reaction_role_already_exists", reactionRoleErr, guildLanguage),
				},
			},
		})
		return
	}

	// Save reaction role to database
	reactionRole := model.ReactionRole{
		Guild:     i.GuildID,
		Message:   messageID,
		React:     emojiName,
		Role:      role.ID,
		Notify:    notify,
		CreatedAt: time.Now(),
	}

	_, err = db.CreateReactionRole(reactionRole)
	if err != nil {
		log.Error("Error saving reaction role to database", "error", err)
		dbErr := errors.New("failed to save reaction role settings to database: " + err.Error())
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.error_database_operate", dbErr, guildLanguage),
				},
			},
		})
		return
	}

	// Add the reaction to the message
	err = s.MessageReactionAdd(channelID, messageID, emojiName)
	if err != nil {
		log.Error("Error adding reaction to message", "error", err)
		// Continue anyway since the reaction role is saved
	}

	// Respond to the user
	s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Embeds: []*discordgo.MessageEmbed{
				pkg.Successful("slashcmd.reaction_role.successful.successful_setup", guildLanguage, emojiInput, role.Name),
			},
		},
	})
}

// getUserHighestRole returns the highest role for a member in a guild
func getUserHighestRole(guild *discordgo.Guild, member *discordgo.Member) *discordgo.Role {
	var highestRole *discordgo.Role

	// Find the highest role from member's roles
	for _, roleID := range member.Roles {
		for _, role := range guild.Roles {
			if role.ID == roleID {
				if highestRole == nil || role.Position > highestRole.Position {
					highestRole = role
				}
				break
			}
		}
	}

	// If no roles found, return @everyone role as fallback
	if highestRole == nil {
		for _, role := range guild.Roles {
			if role.ID == guild.ID { // @everyone role has same ID as guild
				return role
			}
		}
	}

	return highestRole
}

func handleDeleteReactionRole(s *discordgo.Session, i *discordgo.InteractionCreate, options []*discordgo.ApplicationCommandInteractionDataOption, guildLanguage string) {
	// Check if the user has permission to manage roles
	permissions, err := s.State.UserChannelPermissions(i.Member.User.ID, i.ChannelID)
	if err != nil || permissions&discordgo.PermissionManageRoles == 0 {
		// Check if user is server owner (owners have all permissions)
		guild, err := s.State.Guild(i.GuildID)
		if err != nil {
			guildErr := errors.New("could not access guild information")
			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Embeds: []*discordgo.MessageEmbed{
						pkg.ErrorEmbed("slashcmd.reaction_role.error.guild_access", guildErr, guildLanguage),
					},
				},
			})
			return
		}

		// If user is not the server owner, deny access
		if guild.OwnerID != i.Member.User.ID {
			noPermissionErr := errors.New("you do not have permission to manage roles")
			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Embeds: []*discordgo.MessageEmbed{
						pkg.ErrorEmbed("slashcmd.reaction_role.error.no_permission", noPermissionErr, guildLanguage),
					},
				},
			})
			return
		}
	}

	optionMap := make(map[string]*discordgo.ApplicationCommandInteractionDataOption, len(options))
	for _, opt := range options {
		optionMap[opt.Name] = opt
	}

	var reactionRole *model.ReactionRole

	// Check if user provided a number (preferred method)
	if numberOpt, exists := optionMap["number"]; exists {
		number := int(numberOpt.IntValue())

		// Get all reaction roles for this guild
		reactionRoles, err := db.GetReactionRolesByGuild(i.GuildID)
		if err != nil {
			log.Error("Error getting reaction roles from database", "error", err)
			dbErr := errors.New("failed to get reaction roles from database: " + err.Error())
			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Embeds: []*discordgo.MessageEmbed{
						pkg.ErrorEmbed("slashcmd.reaction_role.error.error_database_operate", dbErr, guildLanguage),
					},
				},
			})
			return
		}

		// Validate number range
		if number < 1 || number > len(reactionRoles) {
			invalidNumberErr := errors.New("invalid number, please use a number from the reaction role list")
			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Embeds: []*discordgo.MessageEmbed{
						pkg.ErrorEmbed("slashcmd.reaction_role.error.invalid_number", invalidNumberErr, guildLanguage),
					},
				},
			})
			return
		}

		// Get the reaction role by index (number - 1)
		reactionRole = &reactionRoles[number-1]

	} else {
		// Fallback to original method: message URL + emoji
		messageURLOpt, hasURL := optionMap["message-url"]
		emojiOpt, hasEmoji := optionMap["emoji"]

		if !hasURL || !hasEmoji {
			missingParamsErr := errors.New("please provide either a number from the list, or both message URL and emoji")
			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Embeds: []*discordgo.MessageEmbed{
						pkg.ErrorEmbed("slashcmd.reaction_role.error.missing_parameters", missingParamsErr, guildLanguage),
					},
				},
			})
			return
		}

		// Parse message URL to get messageID
		messageURL := messageURLOpt.StringValue()
		urlParts := strings.Split(messageURL, "/")

		if len(urlParts) < 7 || !strings.Contains(messageURL, "discord.com/channels/") {
			messageErr := errors.New("invalid message URL, please use a valid Discord message link")
			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Embeds: []*discordgo.MessageEmbed{
						pkg.ErrorEmbed("slashcmd.reaction_role.error.invalid_message", messageErr, guildLanguage),
					},
				},
			})
			return
		}

		urlGuildID := urlParts[len(urlParts)-3]
		channelID := urlParts[len(urlParts)-2]
		messageID := urlParts[len(urlParts)-1]

		// Security check: Ensure the message URL is from the same guild
		if urlGuildID != i.GuildID {
			crossGuildErr := errors.New("you can only delete reaction roles for messages in this server")
			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Embeds: []*discordgo.MessageEmbed{
						pkg.ErrorEmbed("slashcmd.reaction_role.error.cross_guild", crossGuildErr, guildLanguage),
					},
				},
			})
			return
		}

		// Check if user has permission to view the target channel
		targetChannelPermissions, err := s.State.UserChannelPermissions(i.Member.User.ID, channelID)
		if err != nil || targetChannelPermissions&discordgo.PermissionViewChannel == 0 {
			channelAccessErr := errors.New("you do not have permission to access the target channel")
			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Embeds: []*discordgo.MessageEmbed{
						pkg.ErrorEmbed("slashcmd.reaction_role.error.channel_access", channelAccessErr, guildLanguage),
					},
				},
			})
			return
		}

		// Parse emoji
		emojiInput := emojiOpt.StringValue()
		var emojiName string

		if matches := customEmojiRegex.FindStringSubmatch(emojiInput); len(matches) == 3 {
			emojiName = matches[1] + ":" + matches[2]
		} else if matches := animatedEmojiRegex.FindStringSubmatch(emojiInput); len(matches) == 3 {
			emojiName = "a:" + matches[1] + ":" + matches[2]
		} else {
			emojiName = emojiInput
		}

		// Find the reaction role - try new format first, then old format for backward compatibility
		foundReactionRole, err := db.GetReactionRoleByMessageAndEmoji(messageID, emojiName)
		if err != nil {
			// If not found with new format, try old format (emoji ID only) for backward compatibility
			if matches := customEmojiRegex.FindStringSubmatch(emojiInput); len(matches) == 3 {
				// Try with just the emoji ID (old format)
				emojiID := matches[2]
				foundReactionRole, err = db.GetReactionRoleByMessageAndEmoji(messageID, emojiID)
			} else if matches := animatedEmojiRegex.FindStringSubmatch(emojiInput); len(matches) == 3 {
				// Try with just the emoji ID (old format)
				emojiID := matches[2]
				foundReactionRole, err = db.GetReactionRoleByMessageAndEmoji(messageID, emojiID)
			}

			if err != nil {
				notFoundErr := errors.New("reaction role not found for this message and emoji")
				s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
					Type: discordgo.InteractionResponseChannelMessageWithSource,
					Data: &discordgo.InteractionResponseData{
						Embeds: []*discordgo.MessageEmbed{
							pkg.ErrorEmbed("slashcmd.reaction_role.error.not_found", notFoundErr, guildLanguage),
						},
					},
				})
				return
			}
		}
		reactionRole = &foundReactionRole
	}

	// Get the role to check hierarchy
	role, err := s.State.Role(i.GuildID, reactionRole.Role)
	if err != nil {
		roleErr := errors.New("could not find the role associated with this reaction role")
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.invalid_role", roleErr, guildLanguage),
				},
			},
		})
		return
	}

	// Check if the target role is higher than the user's highest role
	guild, err := s.State.Guild(i.GuildID)
	if err != nil {
		guildErr := errors.New("could not access guild information")
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.guild_access", guildErr, guildLanguage),
				},
			},
		})
		return
	}

	member, err := s.GuildMember(i.GuildID, i.Member.User.ID)
	if err != nil {
		memberErr := errors.New("could not access member information")
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.member_access", memberErr, guildLanguage),
				},
			},
		})
		return
	}

	// Check if user can manage this role (user's highest role must be higher than target role)
	userHighestRole := getUserHighestRole(guild, member)
	if userHighestRole != nil && role.Position >= userHighestRole.Position && guild.OwnerID != i.Member.User.ID {
		hierarchyErr := errors.New("you cannot manage a role that is higher than or equal to your highest role")
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.role_hierarchy", hierarchyErr, guildLanguage),
				},
			},
		})
		return
	}

	// Check if bot can manage this role
	botMember, err := s.GuildMember(i.GuildID, s.State.User.ID)
	if err != nil {
		botErr := errors.New("could not access bot information")
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.bot_access", botErr, guildLanguage),
				},
			},
		})
		return
	}

	botHighestRole := getUserHighestRole(guild, botMember)
	if botHighestRole != nil && role.Position >= botHighestRole.Position {
		botHierarchyErr := errors.New("bot cannot manage a role that is higher than or equal to its highest role")
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.bot_role_hierarchy", botHierarchyErr, guildLanguage),
				},
			},
		})
		return
	}

	// Delete from database
	err = db.DeleteReactionRole(reactionRole.ID)
	if err != nil {
		log.Error("Error deleting reaction role from database", "error", err)
		dbErr := errors.New("failed to delete reaction role from database: " + err.Error())
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.error_database_operate", dbErr, guildLanguage),
				},
			},
		})
		return
	}

	// Respond to the user
	s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Embeds: []*discordgo.MessageEmbed{
				pkg.Successful("slashcmd.reaction_role.successful.successful_delete", guildLanguage, reactionRole.React),
			},
		},
	})
}

func handleListReactionRoles(s *discordgo.Session, i *discordgo.InteractionCreate, guildLanguage string) {

	// Check if the user has permission to manage roles
	permissions, err := s.State.UserChannelPermissions(i.Member.User.ID, i.ChannelID)
	if err != nil || permissions&discordgo.PermissionManageRoles == 0 {
		// Check if user is server owner (owners have all permissions)
		guild, err := s.State.Guild(i.GuildID)
		if err != nil {
			guildErr := errors.New("could not access guild information")
			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Embeds: []*discordgo.MessageEmbed{
						pkg.ErrorEmbed("slashcmd.reaction_role.error.guild_access", guildErr, guildLanguage),
					},
				},
			})
			return
		}

		// If user is not the server owner, deny access
		if guild.OwnerID != i.Member.User.ID {
			noPermissionErr := errors.New("you do not have permission to manage roles")
			s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
				Type: discordgo.InteractionResponseChannelMessageWithSource,
				Data: &discordgo.InteractionResponseData{
					Embeds: []*discordgo.MessageEmbed{
						pkg.ErrorEmbed("slashcmd.reaction_role.error.no_permission", noPermissionErr, guildLanguage),
					},
				},
			})
			return
		}
	}

	// Get all reaction roles for this guild
	reactionRoles, err := db.GetReactionRolesByGuild(i.GuildID)
	if err != nil {
		log.Error("Error getting reaction roles from database", "error", err)
		dbErr := errors.New("failed to get reaction roles from database: " + err.Error())
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					pkg.ErrorEmbed("slashcmd.reaction_role.error.error_database_operate", dbErr, guildLanguage),
				},
			},
		})
		return
	}

	if len(reactionRoles) == 0 {
		s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
			Type: discordgo.InteractionResponseChannelMessageWithSource,
			Data: &discordgo.InteractionResponseData{
				Embeds: []*discordgo.MessageEmbed{
					{
						Title: it.I18n.Tr(guildLanguage, "slashcmd.reaction_role.list.no_roles"),
						Color: pkg.SuccessfulColor,
					},
				},
			},
		})
		return
	}

	// Build the list
	var description strings.Builder
	for idx, rr := range reactionRoles {
		// Format the entry with i18n - show message ID instead of searching for channel
		description.WriteString(fmt.Sprintf("**%d.** %s: `%s`\n",
			idx+1,
			it.I18n.Tr(guildLanguage, "slashcmd.reaction_role.list.message_id"),
			rr.Message))

		// Format emoji properly for display
		var displayEmoji string
		if strings.Contains(rr.React, ":") {
			// This is a custom emoji stored as "name:id" or "a:name:id" (new format)
			if strings.HasPrefix(rr.React, "a:") {
				// Animated emoji: "a:name:id" -> "<a:name:id>"
				displayEmoji = "<" + rr.React + ">"
			} else {
				// Regular custom emoji: "name:id" -> "<:name:id>"
				displayEmoji = "<:" + rr.React + ">"
			}
		} else {
			// Check if it's a pure emoji ID (old format compatibility)
			if len(rr.React) > 10 && strings.TrimSpace(rr.React) != "" {
				// This looks like an emoji ID (old format), try to get emoji info
				emoji, err := s.State.Emoji(i.GuildID, rr.React)
				if err == nil {
					// Successfully found the emoji, format it properly
					if emoji.Animated {
						displayEmoji = fmt.Sprintf("<a:%s:%s>", emoji.Name, emoji.ID)
					} else {
						displayEmoji = fmt.Sprintf("<:%s:%s>", emoji.Name, emoji.ID)
					}
				} else {
					// Couldn't find emoji info, display as fallback
					displayEmoji = fmt.Sprintf("<:unknown:%s>", rr.React)
				}
			} else {
				// This is a standard Unicode emoji, display as-is
				displayEmoji = rr.React
			}
		}

		description.WriteString(fmt.Sprintf("   %s: %s\n",
			it.I18n.Tr(guildLanguage, "slashcmd.reaction_role.list.emoji"),
			displayEmoji))

		description.WriteString(fmt.Sprintf("   %s: <@&%s>\n",
			it.I18n.Tr(guildLanguage, "slashcmd.reaction_role.list.role"),
			rr.Role))

		// Handle missing notify field (backward compatibility)
		notifyText := it.I18n.Tr(guildLanguage, "slashcmd.reaction_role.list.notify_no")
		if rr.Notify {
			notifyText = it.I18n.Tr(guildLanguage, "slashcmd.reaction_role.list.notify_yes")
		}
		description.WriteString(fmt.Sprintf("   %s: %s\n\n",
			it.I18n.Tr(guildLanguage, "slashcmd.reaction_role.list.notify"),
			notifyText))
	}

	s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Embeds: []*discordgo.MessageEmbed{
				{
					Title:       it.I18n.Tr(guildLanguage, "slashcmd.reaction_role.list.title"),
					Description: description.String(),
					Color:       pkg.SuccessfulColor,
				},
			},
		},
	})
}
