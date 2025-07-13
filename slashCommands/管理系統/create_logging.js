const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const logging = require('../../models/logging.js');
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
module.exports = {
    name: 'set-log-channel',
    name_localizations: {
        "zh-TW": "設置日誌",
        "zh-CN": "设置日志",
        "en-US": "set-log-channel",
        "en-GB": "set-log-channel",
    },
    cooldown: 10,
	description: 'Set where log messages should send',
	description_localizations: {
		"en-US": "Set where log messages should send",
        "en-GB": "Set where log messages should send",
		"zh-TW": "設置日誌訊息要在哪發送",
        "zh-CN": "设置日志讯息要在哪发送",
	},
    options: [{
        name: 'channel',
        name_localizations: {
            "en-US": "channel",
            "en-GB": "channel",
            "zh-TW": "頻道",
            "zh-CN": "頻道",
        },
        type: ApplicationCommandOptionType.Channel,
        channel_types: [0,5],
	    description: 'Enter log channel!',
	    description_localizations: {
		    "en-US": "Enter log channel!",
            "en-GB": "Enter log channel!",
		    "zh-TW": "輸入日誌頻道!",
            "zh-CN": "输入日志频道",
	    },
        required: true,
    }],
    //video: 'https://docsmhcat.yorukot.me/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:logfile:985948561625710663>`,
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
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
            const channel = interaction.options.getChannel("channel")
            const channel_id = channel.id
            const loggin_embed = new EmbedBuilder()
                .setTitle("<:logfile:985948561625710663> 日誌系統")
                .setDescription(`**請選擇您需要的日誌(未來會更新更多喔)** \n目前的選擇:`)
                .setColor("#FFDC35")
                .setFooter({
                    text: 'MHCAT帶給你最棒的Discord體驗!',
                    iconURL: `${client.user.avatarURL()}`
                })
            const loggin_create = new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                    .setCustomId('loggin_create')
                    .setPlaceholder('請選擇您需要的日誌')
                    .setMaxValues(4)
                    .setMinValues(1)
                    .addOptions({
                        label: '訊息更新',
                        description: '當訊息編輯時發送日誌',
                        value: '訊息更新',
                    }, {
                        label: '訊息刪除',
                        description: '當訊息刪除時發送日誌',
                        value: '訊息刪除',
                    }, {
                        label: '頻道更新',
                        description: '當頻道更新時發送日誌',
                        value: '頻道更新',
                    }, {
                        label: '用戶語音狀態更新',
                        description: '當用戶離開或加入或是靜音之類的時發送這個通知',
                        value: '用戶語音更新',
                    }),
                );
            let msgg = await interaction.editReply({
                embeds: [loggin_embed],
                components: [loggin_create]
            });
            const filter = i => {
                return i.user.id === interaction.user.id;
            };
            const collector = msgg.createMessageComponentCollector({
                componentType: 3,
                time: 10 * 60 * 1000,
                filter
            });

            collector.on("collect", (interaction01) => {
                logging.findOne({
                    guild: interaction.channel.guild.id,
                }, async (err, data) => {
                    if (data) data.delete()

                    function get_true_or_false(permission) {
                        return interaction01.values.includes(permission) ? true : false
                    }
                    // 度資料庫的內容進行更新
                    data = new logging({
                        guild: interaction.guild.id,
                        channel_id: channel_id,
                        message_update: get_true_or_false('訊息更新'),
                        message_delete: get_true_or_false('訊息刪除'),
                        channel_update: get_true_or_false('頻道更新'),
                        member_voice_update: get_true_or_false('用戶語音更新')
                    })
                    data.save()
                    // 設定embed & send embed
                    const announcement_set_embed = new EmbedBuilder()
                    .setTitle("<:logfile:985948561625710663> 日誌系統")
                    .setDescription(`**請選擇您需要的日誌(未來會更新更多喔)** \n目前的選擇:\`${interaction01.values.join('`,`')}\``)
                    .setColor("#FFDC35")
                    .setFooter({
                        text: 'MHCAT帶給你最棒的Discord體驗!',
                        iconURL: `${client.user.avatarURL()}`
                    })
                    interaction01.update({
                        embeds: [announcement_set_embed]
                    })
    
                })
            })
        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}