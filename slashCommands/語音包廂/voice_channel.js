const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const join_role = require("../../models/join_role.js")
const ticket_js = require('../../models/ticket.js')
const voice_channel = require('../../models/voice_channel.js')
const moment = require('moment')
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

function getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
const {
    errorMonitor
} = require("ws");
module.exports = {
    name: '語音包廂設置',
    cooldown: 10,
    description: '設定語音包廂',
    options: [{
        name: '語音頻道',
        type: ApplicationCommandOptionType.Channel,
        channel_types: [2, 13],
        description: '設定哪個頻道加入後會開啟語音包廂',
        required: true,
    }, {
        name: '設定頻道名稱',
        type: ApplicationCommandOptionType.String,
        description: '設定開啟的語音包廂要叫做甚麼 輸入{name}及代表使用者名稱',
        required: true,
    }, {
        name: '是否予許房主上鎖',
        type: ApplicationCommandOptionType.Boolean,
        description: '設定是否予許房主將活動語音頻道上鎖(房主打指令即可上鎖)',
        required: true,
    }, {
        name: '設定人數上限',
        type: ApplicationCommandOptionType.Integer,
        description: '設定頻道人數上限(如果不填，即為無上限)',
        required: false,
    }, ],
    //video: 'https://docsmhcat.yorukot.me/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:mapsandflags:985949507114131587>`,
    run: async (client, interaction, options, perms) => {
        try {
            await interaction.deferReply();

            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
            const limit1 = interaction.options.getInteger("設定人數上限")
            const channel1 = interaction.options.getChannel("語音頻道")
            const lock = interaction.options.getBoolean('是否予許房主上鎖')
            const channel = channel1.id
            const channel_name = interaction.options.getString("設定頻道名稱")
            if (limit1 && (Number(limit1) > 99 || Number(limit1 < 1))) return errors("必須為1-99的整數!", "參數錯誤")
            const limit = limit1 ? limit1 : 0
            const perant = channel1.parentId === null ? null : channel1.parentId
            voice_channel.findOne({
                guild: interaction.guild.id,
                ticket_channel: channel
            }, async (err, data) => {
                if(data) data.delete()
                    voice_channel.findOne({
                        guild: interaction.guild.id,
                        parent: perant,
                        ticket_channel: channel
                    }, async (err, data) => {
                        if (data && data.ticket_channel !== channel) {
                            const error_embed = new EmbedBuilder()
                                .setTitle("<a:Discord_AnimatedNo:1015989839809757295> | 錯誤")
                                .setColor("Red")
                                .setDescription("這個頻道已經有語音包廂設定了!\n如果需要可以把舊的設定刪除\n使用\`/語音包廂刪除\`")
                            return interaction.editReply({
                                embeds: [error_embed],
                            });
                        }else{
                            data = new voice_channel({
                                guild: interaction.guild.id,
                                ticket_channel: channel,
                                limit: limit,
                                name: channel_name,
                                parent: perant,
                                lock: lock
                            })
                            data.save()
                            const embed = new EmbedBuilder()
                                .setTitle("<a:green_tick:994529015652163614> | 成功進行設定")
                                .setColor("Green")
                                .setDescription("<:Voice:994844272790610011> 你成功對語音包廂進行\`設定\`")
                            interaction.editReply({
                                embeds: [embed],
                            });
                        }
                    })
            })


        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}