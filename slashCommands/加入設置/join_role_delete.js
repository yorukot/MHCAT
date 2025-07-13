const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const join_role = require("../../models/join_role.js")
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
    name: '加入身份組刪除',
    cooldown: 10,
    description: '刪除之前設定的加入身份組',
    options: [{
        name: '身分組',
        type: ApplicationCommandOptionType.Role,
        description: '輸入身分組!',
        required: true,
    }],
    video: 'https://docsmhcat.yorukot.me/docs/join_role_delete',
    UserPerms: '訊息管理',
    emoji: `<:delete:985944877663678505>`,
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
            const role1 = interaction.options.getRole("身分組")
            const role = role1.id
            join_role.findOne({
                guild: interaction.guild.id,
                role: role
            }, async (err, data) => {
                if (err) throw err;
                if (!data) {
                    return errors("找不到這個身份組!")
                } else {
                    data.delete()
                }
                const embed = new EmbedBuilder()
                    .setTitle("🪂 加入身分組系統")
                    .setColor(client.color.greate)
                    .setDescription(`<:trashbin:986308183674990592>**成功刪除:**\n身分組: <@${role}>!`)
                interaction.editReply({
                    embeds: [embed]
                })
            })

        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}