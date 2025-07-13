const chat = require('../../models/chat.js');
const canvacord = require("canvacord")
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
var validateColor = require("validate-color").default;

function checkURL(image) {
    return (image.match(/\.(jpg|png)$/) != null);
}
module.exports = {
    name: '自動聊天頻道刪除',
    cooldown: 10,
    description: '刪除自動聊天頻道要在哪裡發送',
    video: 'https://docsmhcat.yorukot.me/docs/chat_xp_set',
    UserPerms: '訊息管理',
    emoji: `<:delete:985944877663678505>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply();
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed]
                })
            }
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
            chat.findOne({
                guild: interaction.channel.guild.id,
            }, async (err, data) => {
                if (!data) return errors("你沒有設定過，我不知道要刪除甚麼!")
                data.delete()
                const announcement_set_embed = new EmbedBuilder()
                    .setTitle("自動聊天系統")
                    .setDescription(`您的自動聊天頻道成功刪除`)
                    .setColor("Green")
                interaction.editReply({
                    embeds: [announcement_set_embed]
                })

            })
        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}