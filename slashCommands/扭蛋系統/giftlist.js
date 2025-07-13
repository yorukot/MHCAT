const gift = require("../../models/gift.js");
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
    name: '扭蛋獎池查詢',
    cooldown: 10,
    description: '增加扭蛋的獎池',
    video: 'https://docsmhcat.yorukot.me/docs/prize_search',
    emoji: `<:list:992002476360343602>`,
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
            gift.find({
                guild: interaction.guild.id,
            }, async (err, data) => {
                if (data.length === 0) {
                    return errors("目前獎池沒有任何獎品喔!")
                } else {
                    const array = []
                    const e = data.map(
                        (w, i) => `**<:id:985950321975128094> 獎品名:** \n\`${w.gift_name}\`\n**<:dice:997374185322057799> 獎品抽中概率:**\n\`${w.gift_chence}\`%\n`
                    )
                    for (let i = 0; i < data.length; i++) {
                        let arrary111 = {
                            name: `<:id:985950321975128094> 獎品名: ${data[i].gift_name}`,
                            value: `**<:dice:997374185322057799> 獎品中獎機率:** : \`${data[i].gift_chence}\`%\n'<:counter:994585977207140423> **獎品數量:** \`${data[i].gift_count}\``,
                            inline: true
                        }
                        array.push(arrary111)
                    }
                    gift_change.findOne({
                        guild: interaction.guild.id,
                    }, async (err, data1) => {
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`<:list:992002476360343602> 以下是${interaction.guild.name}的獎池`)
                                .setColor('Random')
                                .setDescription(`**<:money:997374193026994236> 扭蛋所需代幣:**\`${!data1 ? 500 : data1.coin_number}\`個\n<:calendar:990254384812290048> **簽到給予代幣數:**\`${data1 ? data1.sign_coin : 25}\`個\n**<:levelup:990254382845157406> 等級提升給予倍數:**\`${data1 ? data1.xp_multiple ? data1.xp_multiple : 0 : 0}\`倍`)
                                .setFields(array)
                                .setFooter({
                                    text: `${interaction.user.tag}的查詢`,
                                    iconURL: interaction.user.displayAvatarURL({
                                        dynamic: true
                                    })
                                })
                            ]
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