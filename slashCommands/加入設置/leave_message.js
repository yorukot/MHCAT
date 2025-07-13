const leave_message = require("../../models/leave_message.js")
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
const {
    EqualsOperation
} = require("sift");
module.exports = {
    name: '退出訊息設置',
    cooldown: 10,
    description: '設定玩家退出時發送甚麼訊息',
    options: [{
        name: '頻道',
        type: ApplicationCommandOptionType.Channel,
        channel_types: [0, 5],
        description: '輸入加入訊息要在那發送!',
        required: true,
    }],
    //video: 'https://docsmhcat.yorukot.meommands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:comments:985944111725019246>`,

    run: async (client, interaction, options, perms) => {
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
            const channel = interaction.options.getChannel("頻道")
            const channel_id = channel.id
            leave_message.findOne({
                guild: interaction.guild.id,
            }, async (err, data) => {
                if (!data) {
                    data = new leave_message({
                        guild: interaction.guild.id,
                        message_content: null,
                        title: null,
                        color: null,
                        channel: channel_id,
                    })
                    data.save()
                } else {
                    data.collection.updateOne(({
                        guild: interaction.channel.guild.id
                    }), {
                        $set: {
                            channel: channel_id
                        }
                    })
                }
                const modal = new ModalBuilder()
                    .setCustomId("nal")
                    .setTitle('退出訊息設置!');
                const color = new TextInputBuilder()
                    .setCustomId('leave_msgcolor')
                    .setLabel("請輸入你的加入訊息要甚麼顏色(要隨機顏色可輸入:Random)")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setValue(data ? data.color !== null ? data.color : '' : '')
                const title1 = new TextInputBuilder()
                    .setCustomId('leave_msgtitle')
                    .setLabel("請輸入訊息標題")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setValue(data ? data.title !== null ? data.title : '' : '')
                const content = new TextInputBuilder()
                    .setCustomId('leave_msgcontent')
                    .setLabel("請輸入訊息內文(如要顯示用戶名可輸入: {MEMBERNAME} )")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setValue(data.message_content !== null ? data.message_content : '')
                const color1 = new ActionRowBuilder().addComponents(color);
                const content1 = new ActionRowBuilder().addComponents(content);
                const title = new ActionRowBuilder().addComponents(title1);
                modal.addComponents(color1, title, content1, );
                await interaction.showModal(modal);
            })


        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}