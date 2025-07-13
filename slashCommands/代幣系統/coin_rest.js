const coin = require("../../models/coin.js");
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
    name: '代幣重製',
    cooldown: 100,
    description: '重製所有人的代幣，或者是進行代幣改變幣值',
    options: [{
        name: '除以多少',
        type: ApplicationCommandOptionType.Integer,
        description: '要對所有人的代幣除以多少(這個可以用來解決貨幣通彭)，不選的話就是全部清除!',
        required: false,
    }],
    UserPerms: '服主',
    video: 'https://docs.mhcat.xyz/docs/coin',
    emoji: `<:money:997374193026994236>`,
    run: async (client, interaction, options, perms) => {
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            const error_embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | 只有服主可以使用這個指令!`).setColor("Red");
            if (interaction.member.id !== interaction.guild.ownerId) return interaction.reply({
                embeds: [error_embed],
                ephemeral: true
            })
            const aaaaa = interaction.options.getInteger("除以多少")
            interaction.reply({
                content: ":warning: | 一但重製，___**將無法復原**___，如確定要還原請於60秒內輸入\`^確認^\`(只有一次機會)!!!"
            });
            const filter = m => (m.member.id === interaction.member.id);
            const collector = interaction.channel.createMessageCollector({
                filter,
                max: 1,
                time: 60000
            })
            collector.on('collect', m => {
                function mmmmm(content) {
                    const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                    m.reply({
                        embeds: [embed]
                    })
                }
                if (m.content !== "^確認^") return mmmmm("你輸入了錯誤的確認!因此視為取消還原")
                coin.find({
                    guild: interaction.guild.id,
                }, async (err, data) => {
                    if (!data.length === 0) {
                        errors("這伺服器沒有任何的代幣喔!")
                    } else {
                        for (let index = 0; index < data.length; index++) {
                            if(!aaaaa){
                                data[index].delete()
                            }else{
                                data[index].collection.updateOne(({
                                    guild: interaction.channel.guild.id,
                                    member: data[index].member
                                }), {
                                    $set: {
                                        coin: Math.round(data[index].coin / aaaaa)
                                    }
                                })
                                
                            }
                            if(index === data.length -1){
                                return m.reply({
                                    embeds: [
                                        new EmbedBuilder()
                                        .setTitle(client.emoji.delete + "成功重製伺服器內所有代幣")
                                        .setColor(client.color.greate)
                                    ],
                                })
                            }
                        }
                    }
                })
            });


        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}