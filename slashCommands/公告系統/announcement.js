const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const guild = require('../../models/guild.js');
const {
    PermissionFlagsBits
} = require('discord-api-types/v9');
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
module.exports = {
    name: '公告發送',
    description: '發送公告訊息',
    video: 'https://docsmhcat.yorukot.me/docs/ann',
    UserPerms: '訊息管理',
    emoji: `<:megaphone:985943890148327454>`,
    cooldown: 10,
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
            const modal = new ModalBuilder()
                .setCustomId("nal")
                .setTitle('公告系統');
            const tag = new TextInputBuilder()
                .setCustomId("anntag")
                .setLabel("請輸入你要tag誰")
                .setRequired(true)
                .setStyle(TextInputStyle.Short);
            const color = new TextInputBuilder()
                .setCustomId('anncolor')
                .setLabel("請輸入你的公告要甚麼顏色")
                .setRequired(true)
                .setStyle(TextInputStyle.Short);
            const title = new TextInputBuilder()
                .setCustomId('anntitle')
                .setLabel("請輸入你的公告標題")
                .setRequired(true)
                .setStyle(TextInputStyle.Short);
            const content = new TextInputBuilder()
                .setCustomId('anncontent')
                .setLabel("請輸入公告內文")
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph);
            const firstActionRow = new ActionRowBuilder().addComponents(tag);
            const color1 = new ActionRowBuilder().addComponents(color);
            const title1 = new ActionRowBuilder().addComponents(title);
            const content1 = new ActionRowBuilder().addComponents(content);
            modal.addComponents(firstActionRow, color1, title1, content1);
            await interaction.showModal(modal);




        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}