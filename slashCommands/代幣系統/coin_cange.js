const gift_change = require("../../models/gift_change.js");
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
const {
    errorMonitor
} = require("ws");
module.exports = {
    name: 'coin-related-settings',
    name_localizations: {
		"en-US": "coin-related-settings",
		"zh-TW": "代幣相關設定",
        "zh-CN": "代币相关设定",
	},
    cooldown: 10,
	description: 'Various settings related to tokens',
	description_localizations: {
		"en-US": "Various settings related to tokens",
		"zh-TW": "有關代幣的各項設定",
        "zh-CN": "有关代币的各项设定",
	},
    options: [{
        name: 'coin-raffle-takes',
        name_localizations: {
			"en-US": "coin-raffle-takes",
			"zh-TW": "扭蛋所需代幣",
            "zh-CN": "扭蛋所需代幣",
		},
        type: ApplicationCommandOptionType.Integer,
		description: 'The amount of coin raffle requires',
		description_localizations: {
			"en-US": "The amount of coin raffle requires",
			"zh-TW": "每次扭蛋所需的代幣數量",
            "zh-CN": "每次扭蛋所需的代币数量",
		},
        required: true,
    }, {
        name: 'check-in-cooldown-time',
        name_localizations: {
			"en-US": "check-in-cooldown-time",
			"zh-TW": "簽到所需時間",
            "zh-CN": "簽到所需時間",
		},
        type: ApplicationCommandOptionType.Integer,
		description: 'Time between check-in(Unit is hour)(If you want to set it to 0:00, type 0)',
		description_localizations: {
			"en-US": "Time between check-in(Unit is hour)(If you want to set it to 0:00, type 0)",
			"zh-TW": "每次簽到所需時間(單位為小時)(如想設置為0:00重製請打0)",
            "zh-CN": "每次签到所需时间(单位为小时)(如想设置为0:00重新制作请打0)",
		},
        required: true,
    }, {
        name: 'check-in-give-coins',
        name_localizations: {
			"en-US": "check-in-give-coins",
			"zh-TW": "簽到給予代幣數",
            "zh-CN": "簽到給予代幣數",
		},
        type: ApplicationCommandOptionType.Integer,
		description: 'How many amount of coin check-in gives',
		description_localizations: {
			"en-US": "How many amount of coin check-in gives",
			"zh-TW": "每次扭蛋所需的代幣數量",
            "zh-CN": "每次扭蛋所需的代币数量",
		},
        required: true,
    }, {
        name: 'notification-channel',
        name_localizations: {
			"en-US": "notification-channel",
			"zh-TW": "通知頻道",
            "zh-CN": "通知頻道",
		},
        type: ApplicationCommandOptionType.Channel,
        channel_types: [0, 5],
		description: 'Channel to announcement raffle winner',
		description_localizations: {
			"en-US": "Channel to announcement raffle winner",
			"zh-TW": "抽中後的通知頻道",
            "zh-CN": "抽中后的通知频道",
		},
        required: true,
    }, {
        name: 'level-up-multiply-amount',
        name_localizations: {
			"en-US": "level-up-multiply-amount",
			"zh-TW": "等級提升給予倍數",
            "zh-CN": "等級提升給予倍數",
		},
        type: ApplicationCommandOptionType.Number,
        description: 'How many coins you get when you level up.If your level is 9, and the multiply amount is 9,9*10=90',
        description_localizations: {
            "en-US": "How many coins you get when you level up.If your level is 9, and the multiply amount is 9,9*10=90",
            "zh-TW": "等級提升時要給等級幾倍的代幣ex:假設你提升到9等，倍數設10就會得到 9*10=90",
            "zh-CN": "等级提升时要给等级几倍的代币ex:假设你提升到9等，倍数设10就会得到9*10=90",
        },
        required: true,
    }],
    video: 'https://docsmhcat.yorukot.meocs/required_coins',
    emoji: `<:coins:997374177944281190>`,
    UserPerms: '訊息管理',
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply();
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            const number = interaction.options.getInteger("coin-raffle-takes")
            const time = interaction.options.getInteger("check-in-cooldown-time")
            const channel = interaction.options.getChannel("notification-channel")
            const sign_coin = interaction.options.getInteger("check-in-give-coins")
            const xp_multiple = interaction.options.getNumber("level-up-multiply-amount")
            if (number > 999999999) return errors("最高代幣設定數只能是999999999")
            if (sign_coin > 999999999) return errors("最高代幣設定數只能是999999999")
            if (time < 0 && time !== 0) return errors('必須大於-1(0代表0:00重製)')
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
            gift_change.findOne({
                guild: interaction.guild.id,
            }, async (err, data) => {
                if (!data) {
                    data = new gift_change({
                        guild: interaction.guild.id,
                        coin_number: number,
                        sign_coin: sign_coin,
                        channel: channel.id,
                        xp_multiple: xp_multiple,
                        time: time * 60 * 60
                    })
                    data.save()
                } else {
                    data.delete()
                    data = new gift_change({
                        guild: interaction.guild.id,
                        coin_number: number,
                        sign_coin: sign_coin,
                        channel: channel.id,
                        xp_multiple: xp_multiple,
                        time: time * 60 * 60
                    })
                    data.save()
                }
                const good = new EmbedBuilder()
                    .setTitle(`<:money:997374193026994236>成功改變每次扭蛋及抽獎代幣數\n扭蛋所需代幣:\`${number}\`\n簽到給予代幣數:\`${sign_coin}\`\n等級提升給予倍數:\`${xp_multiple}\`\n每次簽到所需時間:\`${time} 小時\``)
                    .setDescription(`通知頻道:${channel}`)
                    .setFooter({
                        text: "MHCAT",
                        iconURL: interaction.member.displayAvatarURL({
                            dynamic: true
                        })
                    })
                    .setColor('Random')
                interaction.editReply({
                    embeds: [good]
                })
            })

        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}