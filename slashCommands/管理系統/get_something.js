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
    name: '兌換',
    cooldown: 60,
    description: '兌換代碼',
    //video: 'https://docsmhcat.yorukot.me/commands/announcement.html',
    options: [{
        name: '代碼',
        type: ApplicationCommandOptionType.String,
        description: '輸入您的代碼',
        required: true,
    }],
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

            let code_string = interaction.options.getString('代碼')

            code.findOne({
                code: code_string,
            }, async (err, data_code) => {
                if (!data_code) return errors('找不到這個代碼!')
                if (Date.now() - data_code.time > 60 * 60 * 24 * 7 * 1000) return errors('這個代碼為防止遭人惡意使用，已過期，如果你是代碼擁有者，請前往支援伺服器開啟客服頻道!')
                data_code.delete()
                chatgpt_get.findOne({
                    guild: interaction.guild.id,
                }, async (err, data) => {
                    if (data) data.delete()
                    data = new chatgpt_get({
                        guild: interaction.guild.id,
                        price: data_code.price + (data ? data.price : 0),
                    })
                    data.save()
                    interaction.editReply({
                        embeds: [new EmbedBuilder()
                            .setAuthor({
                                name: '成功兌換代碼!',
                                iconURL: 'https://media.discordapp.net/attachments/991337796960784424/1078883215462383697/success.gif',
                            })
                            .setFooter({text: "你可以使用/查看餘額進行查詢剩餘餘額"})
                            .setColor('Green')]
                    })
                })
            })

        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}