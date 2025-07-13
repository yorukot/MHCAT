const canvacord = require("canvacord")
const code = require('../../models/code.js');
const chatgpt_get = require('../../models/chatgpt_get.js');
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
    name: '查看餘額',
    cooldown: 10,
    description: '查看剩餘餘額',
    //video: 'https://docsmhcat.yorukot.me/commands/announcement.html',
    emoji: `<:logfile:985948561625710663>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply({ephemeral: true}).catch(e => {});
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
                chatgpt_get.findOne({
                    guild: interaction.guild.id,
                }, async (err, data) => {

                    interaction.editReply({
                        embeds: [new EmbedBuilder()
                            .setAuthor({
                                name: `伺服器目前剩於餘額: ${data ? data.price : 0}`,
                                iconURL: 'https://media.discordapp.net/attachments/991337796960784424/1078883215462383697/success.gif',
                            })
                            .setColor('Green')]
                    })
                })

        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}