const message_reaction = require("../../models/message_reaction.js");
const {
    ApplicationCommandType,
    ButtonStyle,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    SelectMenuBuilder,
    ButtonBuilder,
    EmbedBuilder,
    Collector,
    Discord,
    AttachmentBuilder,
    ModalBuilder,
    TextInputBuilder,
    PermissionsBitField
} = require('discord.js');
const os = require("os");
const process = require('process');
const { ClusterClient, getInfo } = require('discord-hybrid-sharding');

const language_flag = {
    "id": "🇮🇩",
    "da": "🇹🇦",
    "de": "🇩🇪",
    "en-GB": "🇬🇧",
    "en-US": "🇺🇸",
    "es-ES": "🇪🇸",
    "fr": "🇫🇷",
    "hr": "🇭🇷",
    "it": "🇮🇹",
    "lt": "🇱🇹",
    "hu": "🇭🇺",
    "nl": "🇳🇱",
    "no": "🇳🇴",
    "pl": "🇵🇱",
    "pt-BR": "🇧🇷",
    "ro": "🇷🇴",
    "fi": "🇫🇮",
    "sv-SE": "🇸🇪",
    "vi": "🇻🇮",
    "tr": "🇹🇷",
    "cs": "🇨🇿",
    "el": "🇸🇻",
    "bg": "🇧🇬",
    "ru": "🇷🇺",
    "uk": "🇺🇦",
    "hi": "🇮🇳",
    "th": "🇹🇭",
    "zh-CN": "🇨🇳",
    "ja": "🇯🇵",
    "zh-TW": "🇹🇼",
    "ko": "🇰🇷"
}

module.exports = {
    name: 'info',
    name_localizations: {
        "zh-TW": "資訊",
        "zh-CN": "资讯",
        "en-US": "info",
    },
    description: 'Check all informations.',
    description_localizations: {
        "zh-TW": "各種資訊查詢!",
        "zh-CN": "各种资讯查询!",
        "en-US": "Check all informations.",
    },
    cooldown: 5,
    options: [{
        name: 'user',
        name_localizations: {
            "zh-TW": "使用者",
            "zh-CN": "使用者",
            "en-US": "user",
        },
        type: ApplicationCommandOptionType.Subcommand,
        description: "Check a user's information!",
        description_localizations: {
            "zh-TW": "查看某位使用者的資訊!",
            "zh-CN": "查看某位使用者的资讯!",
            "en-US": "Check a user's information!",
        },
        options: [{
            name: 'user',
            name_localizations: {
                "zh-TW": "使用者",
                "zh-CN": "使用者",
                "en-US": "user",
            },
            type: ApplicationCommandOptionType.User,
            description: 'User to check',
            description_localizations: {
                "zh-TW": "要查詢的使用者",
                "zh-CN": "要查询的使用者",
                "en-US": "User to check",
            },
            required: false,
        }]
    }, {
        name: 'bot',
        name_localizations: {
            "zh-TW": "機器人",
            "zh-CN": "机器人",
            "en-US": "bot",
        },
        type: ApplicationCommandOptionType.Subcommand,
        description: 'MHCAT about',
        description_localizations: {
            "zh-TW": "有關MHCAT的各種資訊",
            "zh-CN": "有关MHCAT的各种资讯",
            "en-US": "MHCAT about",
        },
    }, {
        name: 'shard',
        name_localizations: {
            "zh-TW": "分片",
            "zh-CN": "分片",
            "en-US": "shard",
        },
        type: ApplicationCommandOptionType.Subcommand,
        description: 'MHCat shard informations',
        description_localizations: {
            "zh-TW": "有關MHCAT分片的各種資訊",
            "zh-CN": "有关MHCAT分片的各种资讯",
            "en-US": "MHCAT shard informations",
        },
    }, {
        name: 'guild',
        name_localizations: {
            "zh-TW": "伺服器",
            "zh-CN": "伺服器",
            "en-US": "guild",
        },
        type: ApplicationCommandOptionType.Subcommand,
        description: 'Server informations',
        description_localizations: {
            "zh-TW": "有关这个伺服器的各种资讯",
            "zh-CN": "有关这个伺服器的各种资讯",
            "en-US": "Server informations",
        },
    }],
    //video: 'https://docsmhcat.yorukot.meommands/announcement.html',
    emoji: `<:info:985946738403737620>`,
    run: async (client, interaction, options, perms) => {
            await interaction.deferReply().catch(e => {});

            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            if (interaction.options.getSubcommand() === "bot") {
                const data1 = client.cluster.broadcastEval('this.receiveBotInfo()');
                const a = []
                let guildss = 0
                let membersss = 0
                let result = null
                data1.then(function (result1) {
                    for (let i = 0; i < result1.length; i++) {
                        result = result1
                        const {
                            cluster,
                            shards,
                            guild,
                            members,
                            ram,
                            rssRam,
                            ping,
                            uptime
                        } = result1[i]
                        const test = {
                            name: `<:server:986064124209418251> 分片ID: ${shards}`,
                            value: `\`\`\`fix\n公會數量: ${guild}\n使用者數量: ${members}\n記憶體: ${ram}\\${rssRam} mb\n上線時間:${uptime}\n延遲: ${ping}\`\`\``,
                            inline: true
                        }
                        a.push(test)
                        guildss = guild + guildss
                        membersss = members + membersss
                    }
                })
                const totalRam = Math.round(os.totalmem() / 1024 / 1024);
                const usedRam = Math.round((os.totalmem() - os.freemem()) / 1024 / 1024);
                const osaa = require("os-utils");

                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setEmoji("<:update:1020532095212335235>")
                        .setCustomId('botinfoupdate')
                        .setLabel('更新')
                        .setStyle(ButtonStyle.Success)
                    );
                osaa.cpuUsage(function (v) {
                    const embed = new EmbedBuilder()
                        .setTitle("<a:mhcat:996759164875440219> MHCAT目前系統使用量:")
                        .addFields([{
                                name: "<:cpu:986062422383161424> CPU型號:\n",
                                value: `\`${os.cpus().map((i) => `${i.model}`)[0]}\``,
                                inline: false
                            },
                            {
                                name: "<:cpu:987630931932229632> CPU使用量:\n",
                                value: `\`${(v * 100).toFixed(2)}\`**%**`,
                                inline: true
                            },
                            {
                                name: "<:vagueness:999527612634374184> 集群數量:\n",
                                value: `\`${getInfo().TOTAL_SHARDS}\` **個**`,
                                inline: true
                            },
                            {
                                name: "<:rammemory:986062763598155797> RAM使用量:",
                                value: `\`${usedRam}\\${totalRam}\` **MB**\`(${((usedRam / totalRam) * 100).toFixed(2)}%)\``,
                                inline: true
                            },
                            {
                                name: "<:chronometer:986065703369080884> 開機時間:",
                                value: `**<t:${Math.round((Date.now() / 1000) - process.uptime())}:R>**`,
                                inline: true
                            },
                            {
                                name: "<:server:986064124209418251> 總伺服器:",
                                value: `\`${guildss}\``,
                                inline: true
                            },
                            {
                                name: `<:user:986064391139115028> 總使用者:`,
                                value: `\`${membersss}\``,
                                inline: true
                            },
                        ])
                        .setTimestamp()
                        .setColor('Random')
                    interaction.followUp({
                        embeds: [embed],
                        components: [row]
                    })
                })
            } else if (interaction.options.getSubcommand() === "shard") {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setEmoji("<:update:1020532095212335235>")
                        .setCustomId('shardinfoupdate')
                        .setLabel('更新')
                        .setStyle(ButtonStyle.Success)
                    );
                interaction.followUp({
                    embeds: [
                        new EmbedBuilder()
                        .setColor(`Random`)
                        .setTitle(`<:vagueness:999527612634374184> 以下是每個分片的資訊!!`)
                        .setTimestamp()
                    ],
                    components: [row]
                })
            } else if (interaction.options.getSubcommand() === "user") {
                const user = interaction.options.getUser("user") || interaction.user
                const member = await interaction.guild.members.fetch(user.id)
                const embed = new EmbedBuilder()
                    .setTitle(`<:info:985946738403737620> 以下是${user.username}的資料`)
                    .setColor("Random")
                    .setThumbnail(member.displayAvatarURL({
                        dynamic: true
                    }))
                    .setFields({
                        name: "<:id:1010884394791207003> **使用者ID:**",
                        value: `\`${user.id}\``
                    }, {
                        name: "<:page:992009288232996945> **創建時間:**",
                        value: `<t:${Math.round(user.createdTimestamp / 1000)}>`
                    }, {
                        name: "<:joins:956444030487642112> **加入時間:**",
                        value: `<t:${Math.round(member.joinedTimestamp / 1000)}>`
                    })
                interaction.editReply({
                    embeds: [embed]
                })

            } else if (interaction.options.getSubcommand() === "guild") {
                const embed = new EmbedBuilder()
                    .setTitle(`以下是${interaction.guild.name}的資料`)
                    .setColor("Random")
                    .setThumbnail(interaction.guild.iconURL())
                    .setFields({
                        name: "<:id:1010884394791207003> **伺服器ID:**",
                        value: `\`${interaction.guild.id}\``,
                        inline: true
                    }, {
                        name: "<:Discord_Members:1085959207725043812> **成員數量:**",
                        value: `\`${interaction.guild.memberCount}\`個`,
                        inline: true
                    }, {
                        name: "<a:BoosterBadgesRoll:1085958739313573980> **加成狀態:**",
                        value: `**加成數:**\`${interaction.guild.premiumSubscriptionCount}\`\n**加成等級:**\`${interaction.guild.premiumTier}\``,
                        inline: true
                    }, {
                        name: "<:chronometer:986065703369080884> **創建時間:**",
                        value: `<t:${Math.round(interaction.guild.createdTimestamp / 1000)}> (<t:${Math.round(interaction.guild.createdTimestamp / 1000)}:R>)`,
                        inline: true
                    }, {
                        name: "<:Guild_owner_dark_theme:1085959589071175712> **擁有者:**",
                        value: `<@${interaction.guild.ownerId}>`,
                        inline: true
                    }, {
                        name: "🤔 **Emoji數量:**",
                        value: `\`${interaction.guild.emojis.cache.size}\`個`,
                        inline: true
                    }, {
                        name: "<:google:986870850391277609> **伺服器語言:**",
                        value: `${language_flag[interaction.guild.preferredLocale]}\`(${interaction.guild.preferredLocale})\``,
                        inline: true
                    }, {
                        name: "<:tickmark:985949769224556614> **伺服器驗證等級:**",
                        value: `\`${interaction.guild.verificationLevel}\`**(${interaction.guild.verificationLevel === 1 ? "需通過電子郵件認證" : interaction.guild.verificationLevel === 2 ? "須通過電子郵件認證並成員dc成員5分鐘" : interaction.guild.verificationLevel === 3 ? "必須成為此伺服器成員10分鐘"  : interaction.guild.verificationLevel === 4 ? "必須經過手機認證" : "此伺服器無任何驗證機制"})**`,
                        inline: true
                    })
                    .setImage(interaction.guild.bannerURL({format: "png", size: 1024}) || null)
                interaction.editReply({
                    embeds: [embed]
                })
            }
    }
}