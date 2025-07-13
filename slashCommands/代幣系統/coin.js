const coin = require("../../models/coin.js");
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
    name: '代幣查詢',
    cooldown: 10,
    description: '查詢你有多少代幣',
    options: [{
        name: '使用者',
        type: ApplicationCommandOptionType.User,
        description: '要查詢的使用者',
        required: false,
    }],
    video: 'https://docsmhcat.yorukot.meocs/coin',
    emoji: `<:money:997374193026994236>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply({
            ephemeral: true
        });
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            const aaaaa = interaction.options.getUser("使用者")
            const user = aaaaa ? aaaaa.id : interaction.member.id
            coin.findOne({
                guild: interaction.guild.id,
                member: user
            }, async (err, data) => {
                if (!data) {
                    errors("你還沒有任何代幣欸使用`/簽到`或是多講話，都可以獲得代幣喔!")
                } else {
                    gift_change.findOne({
                        guild: interaction.guild.id,
                    }, async (err, data11111) => {
                        const good = new EmbedBuilder()
                            .setTitle(`<:money:997374193026994236>${aaaaa ? aaaaa.username : "你"}目前有:\`${data.coin}\`個代幣!`)
                            .setDescription(`<:question:997374195229003776>我該如何獲取代幣?\n使用\`/簽到\`或是多多聊天都可以拿到代幣喔\n<a:catjump:984807173529931837>對了對了，代幣數到了${!data11111 ? 500 : data11111.coin_number}可以進行扭蛋喔!\n如果代幣足夠也可以到代幣商城逛逛!`)
                            .setFooter({
                                text: `${aaaaa ? aaaaa.username : "你"}還差:${!data11111 ? 500 : data11111.coin_number - (data.coin) > 0 ? `你還差${!data11111 ? 500 : data11111.coin_number - (data.coin)}就可以扭蛋了，加油!!`: "你可以扭蛋了!!使用`/扭蛋`進行扭蛋"}`,
                                iconURL: interaction.member.displayAvatarURL({
                                    dynamic: true
                                })
                            })
                            .setColor('Random')
                        interaction.editReply({
                            embeds: [good],
                            ephemeral: true
                        })
                    })
                }
            })

        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}