const gift = require("../../models/gift.js");
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
    name: '扭蛋獎池增加',
    cooldown: 10,
    description: '增加扭蛋的獎池',
    options: [{
        name: '獎品名稱',
        type: ApplicationCommandOptionType.String,
        description: '輸入這個獎品叫甚麼，以及簡單概述',
        required: true,
    }, {
        name: '機率',
        type: ApplicationCommandOptionType.Number,
        description: '輸入中獎機率(百分比)ex:10 代表10% 0.1代表0.1%',
        required: true,
    }, {
        name: '獎品代碼',
        type: ApplicationCommandOptionType.String,
        description: '填上獎品的代碼ex:stram序號nitro連結等',
        required: false,
    }, {
        name: '自動刪除',
        type: ApplicationCommandOptionType.Boolean,
        description: '抽中後是否自動刪除(預設為true，如果填否的話連獎品數量都不會變)',
        required: false,
    }, {
        name: '獎品數量',
        type: ApplicationCommandOptionType.Integer,
        description: '該獎品的數量',
        required: false,
    }, {
        name: '給予硬幣',
        type: ApplicationCommandOptionType.Integer,
        description: '當抽中後是否要給予代幣',
        required: false,
    }],
    video: 'https://docsmhcat.yorukot.me/docs/prize_add',
    emoji: `<:add1:981722904251215872>`,
    UserPerms: '訊息管理',
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
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors("你沒有權限使用這個指令")
            const gift_name = interaction.options.getString("獎品名稱")
            if(gift_name > 200) return errors('獎品名稱不能這麼長!(需小於200)')
            const gift_code = interaction.options.getString("獎品代碼")
            const gift_chence = interaction.options.getNumber("機率")
            const auto_delete1 = interaction.options.getBoolean("自動刪除")
            const auto_delete = auto_delete1 === false ? auto_delete1 : true
            const gift_count1 = interaction.options.getInteger("獎品數量")
            const give_coin1 = interaction.options.getInteger("給予硬幣")
            const give_coin = give_coin1 ? give_coin1 : 0
            const gift_count = gift_count1 ? gift_count1 : 1
            if (gift_count <= 0) return errors("獎品必須大於1")
            gift.find({
                guild: interaction.guild.id,
            }, async (err, data) => {
                if (data.length > 24) return errors('你的獎品數量已經過多了!!請先刪除部分獎品!')
                gift.findOne({
                    guild: interaction.guild.id,
                    gift_name: gift_name,
                }, async (err, data) => {
                    if (!data) {
                        const data = new gift({
                            guild: interaction.guild.id,
                            gift_name: gift_name,
                            gift_code: gift_code,
                            gift_chence: gift_chence ? gift_chence : null,
                            auto_delete: auto_delete,
                            gift_count: gift_count,
                            give_coin: give_coin
                        })
                        data.save()
                        return interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(client.emoji.done + "設置成功")
                                .addFields({
                                    name: '<:id:985950321975128094> **獎品名:**',
                                    value: `${gift_name}`,
                                    inline: true
                                }, {
                                    name: '<:dice:997374185322057799> **獎品機率:**',
                                    value: `${gift_chence}`,
                                    inline: true
                                }, {
                                    name: '<:security:997374179257102396> **獎品代碼:**',
                                    value: gift_code ? `${gift_code}` : "該獎品無代碼",
                                    inline: true
                                }, {
                                    name: '<:counter:994585977207140423> **獎品數量:**',
                                    value: `${gift_count}個`,
                                    inline: true
                                }, {
                                    name: '<:trashbin:995991389043163257> **自動刪除:**',
                                    value: `${auto_delete}`,
                                    inline: true
                                }, {
                                    name: '<:givemoney:1019632789110399068> **給予代幣數:**',
                                    value: `${give_coin}個`,
                                    inline: true
                                })
                                .setColor(client.color.greate)
                            ],
                            ephemeral: true
                        })
                    } else {
                        return errors("獎品名稱重複，請將之前的刪除或等待被抽中!")
                    }
                })
            })
        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}