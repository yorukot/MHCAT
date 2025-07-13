const cron_set = require('../../models/cron_set.js');
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
    PermissionsBitField,
    TextInputStyle
} = require('discord.js');

function checkURL(image) {
    return (image.match(/\.(jpg|png)$/) != null);
}
module.exports = {
    name: 'automatic-notification',
    name_localizations: {
		"en-US": "automatic-notification",
		"zh-TW": "自動通知",
        "zh-CN": "自动通知",
	},
    cooldown: 10,
	description: 'Set where automatic notification should be send',
	description_localizations: {
		"en-US": "Set where automatic notification should be send",
		"zh-TW": "設定自動聊天頻道要在哪裡發送",
        "zh-TW": "设置自动聊天频道要在哪发送",
	},
    options: [{
        name: 'channel',
        name_localizations: {
            "en-US": "channel",
            "zh-TW": "頻道",
            "zh-CN": "頻道",
        },
        type: ApplicationCommandOptionType.Channel,
	    description: 'Enter channel to send!',
	    description_localizations: {
		    "en-US": "Enter channel to send!",
		    "zh-TW": "輸入要發送的頻道!",
            "zh-CN": "输入要发送的频道",
	    },
        channel_types: [0, 5],
        required: true
    }],
    //video: 'https://docsmhcat.yorukot.me/docs/chat_xp_set',
    UserPerms: '訊息管理',
    emoji: `<:configuration:984010500608249886>`,
    video: "https://youtu.be/D43zPrZU5Fw",
    run: async (client, interaction, options, perms) => {
        //try {

        function errors(content) {
            const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red").setDescription(`<a:arrow_pink:996242460294512690> [點我前往教學網址](https://youtu.be/D43zPrZU5Fw)`);
            interaction.reply({
                embeds: [embed]
            })
        }
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
        const channel1 = interaction.options.getChannel("channel")
        const channel = channel1.id
        const id = `${new Date().valueOf()}`
        cron_set.findOne({
            guild: interaction.guild.id,
            id: id
        }, async (err, data) => {
            cron_set.find({
                guild: interaction.guild.id,
            }, async (err, data) => {
                if (data.length >= 10) return errors("一個伺服器最多只能設置10個自動通知，請使用`/備份列表`進行刪除")
            })
            if (data) {
                return errors("很抱歉，出現了未知的錯誤，請重試!")
            } else {
                data = new cron_set({
                    cron: null,
                    guild: interaction.guild.id,
                    channel: channel,
                    id: `${id}`,
                    message: null,
                })
                data.save()
            }
        })
        const modal = new ModalBuilder()
            .setCustomId(`${id}`)
            .setTitle('自動發送通知系統!');
        const tag = new TextInputBuilder()
            .setCustomId("cron_setcron")
            .setLabel("請輸入corn表達式(如想用簡化版，請直接輸入取消或cancel就可以簡易設置corn)")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        const message = new TextInputBuilder()
            .setCustomId("cron_setmsg")
            .setLabel("請輸入文字(如不輸入這項請務必輸入下面三項)")
            .setRequired(false)
            .setStyle(TextInputStyle.Paragraph);
        const color = new TextInputBuilder()
            .setCustomId('cron_setcolor')
            .setLabel("請輸入你的嵌入訊息顏色(如不輸入嵌入訊息相關，請務必輸入文字)")
            .setRequired(false)
            .setStyle(TextInputStyle.Short);
        const title = new TextInputBuilder()
            .setCustomId('cron_settitle')
            .setLabel("請輸入你的嵌入標題(如不輸入嵌入訊息相關，請務必輸入文字)")
            .setRequired(false)
            .setStyle(TextInputStyle.Short);
        const content = new TextInputBuilder()
            .setCustomId('cron_setcontent')
            .setLabel("請輸入嵌入內文(如不輸入嵌入訊息相關，請務必輸入文字)")
            .setRequired(false)
            .setStyle(TextInputStyle.Paragraph);
        const firstActionRow = new ActionRowBuilder().addComponents(tag);
        const color1 = new ActionRowBuilder().addComponents(color);
        const title1 = new ActionRowBuilder().addComponents(title);
        const content1 = new ActionRowBuilder().addComponents(content);
        const message1 = new ActionRowBuilder().addComponents(message);
        modal.addComponents(firstActionRow, message1, color1, title1, content1);
        await interaction.showModal(modal);


        /* } catch (error) {
             const error_send= require('../../functions/error_send.js')
             error_send(error, interaction)
         }*/
    }
}