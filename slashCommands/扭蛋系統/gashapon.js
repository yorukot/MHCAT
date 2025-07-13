const coin = require("../../models/coin.js");
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
const {
    channels
} = require("../../index.js");
module.exports = {
    name: '扭蛋',
    cooldown: 1,
    description: '進行扭蛋，有機會抽中各種大獎喔!!!!',
    options: [{
        name: '連抽',
        type: ApplicationCommandOptionType.String,
        description: '如果需要連抽的話可以使用這個指令',
        required: false,
        choices: [{
                name: '5連抽(無buff)',
                value: '5'
            },
            {
                name: '10連抽(多送一抽)',
                value: '11'
            },
            {
                name: '15連抽(多送兩抽)',
                value: '17'
            },
            {
                name: '20連抽(多送三抽)',
                value: '23'
            },
        ],
    }],
    video: 'https://docsmhcat.yorukot.meocs/gashapon',
    emoji: `<:gashapon:997374176526610472>`,
    run: async (client, interaction, options, perms) => {
        try {
            await interaction.deferReply().catch(e => {});

            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.followUp({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            const dsadsadsa = interaction.options.getString("連抽")
            const draw = dsadsadsa ? Number(dsadsadsa) === 5 ? 5 : Number(dsadsadsa) === 11 ? 10 : Number(dsadsadsa) === 17 ? 15 : 20 : 1
            const poiuytr = dsadsadsa ? Number(dsadsadsa) : 1
            coin.findOne({
                guild: interaction.guild.id,
                member: interaction.member.id
            }, async (err, data) => {
                if (!data) {
                    errors("你還沒有任何代幣欸使用`/簽到`或是多講話，都可以獲得代幣喔!")
                    return
                } else {

                    gift_change.findOne({
                        guild: interaction.guild.id,
                    }, async (err, data11111) => {
                        gift.find({
                            guild: interaction.guild.id,
                        }, async (err, data11) => {
                            if (data11.length === 0) {
                                errors("獎池裡沒有獎品，只會抽到空氣喔;w;")
                                return
                            }

                            if (data.coin < (!data11111 ? 500 * draw : data11111.coin_number * draw)) return errors(`必須要有\`${!data11111 ? 500*draw : data11111.coin_number*draw}\`個代幣才能進行扭蛋`)
                            const msgg = await interaction.followUp({
                                content: "https://cdn.discordapp.com/attachments/991337796960784424/997105505640136794/giphy.gif"
                            })
                            const {
                                DropTable
                            } = require('drop-table');
                            let testtttt = 0
                            const aaaa1 = []
                            const testsetse1 = []
                            for (let i = 0; i < poiuytr; i++) {
                                const hgsdaa = []
                                const aaaa = []
                                const testsetse = []
                                setTimeout(() => {
                                    gift.find({
                                        guild: interaction.guild.id,
                                    }, async (err, data11) => {
                                        let table = new DropTable();
                                        let i = 0
                                        for (let index = 0; index < data11.length; index++) {
                                            i = i + data11[index].gift_chence
                                            table.addItem({
                                                'name': data11[index].gift_name,
                                                'data': {
                                                    'token': data11[index].gift_code
                                                },
                                                'weight': data11[index].gift_chence
                                            })
                                        }
                                        const dsadsasa = (100 - i) <= 0 ? 0.000000000000000000000000000000000000000000000000000000000000001 : (100 - i)
                                        table.addItem({
                                            'name': '空氣QQ<:peepoHugMilk:994650902050906234>別氣餒，下一次定是你!!',
                                            'weight': dsadsasa
                                        });

                                        const result = table.drop();
                                        table.removeItem(result.name);
                                        if (result.data && result.data.token !== null) {
                                            let aaaaaaaaa = {
                                                name: '<:id:985950321975128094> **獎品名:**' + `${result.name}`,
                                                value: `<:security:997374179257102396> **獎品代碼:**${result.data.token}`,
                                                inline: true
                                            }
                                            testsetse.push(aaaaaaaaa)
                                            testsetse1.push(aaaaaaaaa)
                                        }
                                        const name = result.name
                                        if (!name.includes('空氣QQ') && !name.includes('別氣餒，下一次定是你')) {
                                            hgsdaa.push(name)
                                        }
                                        aaaa.push(result.name)
                                        aaaa1.push(result.name)
                                        gift_change.findOne({
                                            guild: interaction.guild.id,
                                        }, async (err, data11111) => {
                                            if (!data11111) return
                                            const channel = interaction.guild.channels.cache.get(data11111.channel)
                                            if (!channel) return
                                            if (hgsdaa.length === 0) return
                                            channel.send({
                                                embeds: [
                                                    new EmbedBuilder()
                                                    .setTitle("<:celebration:997374188060946495> **有人中獎了!**")
                                                    .setDescription(`<:id:985950321975128094> **中獎人:** <@${interaction.user.id}>\n` + "<a:gift:954018543211532289> **中獎禮物:**" + `\`\`\`${hgsdaa.join('\n')}\`\`\``)
                                                    .setColor("Random")
                                                ]
                                            })
                                        })
                                        if (hgsdaa.length !== 0) {
                                            for (let i = 0; i < aaaa.length; i++) {
                                                gift.findOne({
                                                    guild: interaction.guild.id,
                                                    gift_name: aaaa[i]
                                                }, async (err, data1111111) => {
                                                    if (!data1111111) return
                                                    if (data1111111.give_coin) {
                                                        testtttt = testtttt + data1111111.give_coin
                                                    }
                                                    if (!data1111111.auto_delete) {
                                                        return
                                                    } else {
                                                        if (data1111111.gift_count === 1) {
                                                            data1111111.delete()
                                                        } else {
                                                            data1111111.collection.updateOne(({
                                                                guild: interaction.guild.id,
                                                                gift_name: aaaa[i]
                                                            }), {
                                                                $set: {
                                                                    gift_count: data1111111.gift_count - 1
                                                                }
                                                            })
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                        for (let i = 0; i < aaaa.length; i++) {
                                            gift.findOne({
                                                guild: interaction.guild.id,
                                                gift_name: aaaa[i]
                                            }, async (err, data1111111) => {
                                                if (!data1111111) return
                                                if (data1111111.give_coin) {
                                                    coin.findOne({
                                                        guild: interaction.guild.id,
                                                        member: interaction.member.id
                                                    }, async (err, data) => {
                                                        if (!data) return
                                                        data.collection.updateOne(({
                                                            guild: interaction.channel.guild.id,
                                                            member: interaction.member.id
                                                        }), {
                                                            $set: {
                                                                coin: data.coin + data1111111.give_coin
                                                            }
                                                        })
                                                    })
                                                }
                                                if (!data1111111.auto_delete) {
                                                    return
                                                } else {
                                                    if (data1111111.gift_count === 1) {
                                                        data1111111.delete()
                                                    } else {
                                                        data1111111.collection.updateOne(({
                                                            guild: interaction.guild.id,
                                                            gift_name: aaaa[i]
                                                        }), {
                                                            $set: {
                                                                gift_count: data1111111.gift_count - 1
                                                            }
                                                        })
                                                    }
                                                }

                                            })
                                        }
                                        data.collection.updateOne(({
                                            guild: interaction.channel.guild.id,
                                            member: interaction.member.id
                                        }), {
                                            $set: {
                                                coin: data.coin - (!data11111 ? 500 * draw : data11111.coin_number * draw) + testtttt
                                            }
                                        })
                                    });
                                }, i * 285)
                            }
                            setTimeout(() => {

                                msgg.edit({
                                    content: null,
                                    embeds: [new EmbedBuilder()
                                        .setTitle("<:gashapon:997374176526610472> 扭蛋系統")
                                        .setDescription(`<:fireworks:997374182016958494><:fireworks:997374182016958494>你扭中了:\n${aaaa1.join('\n')}`)
                                        .setColor("Random")
                                        .setFooter({
                                            text: "如扭中的獎品有獎品代碼，將會私訊給您!",
                                            iconURL: interaction.member.displayAvatarURL({
                                                dynamic: true
                                            })
                                        })
                                    ]
                                })
                                if (testsetse1.length !== 0) {
                                    interaction.member.send({
                                        embeds: [
                                            new EmbedBuilder()
                                            .setTitle('<:fireworks:997374182016958494> 恭喜你中獎!!')
                                            .setColor('Random')
                                            .setFields(testsetse1)
                                        ]
                                    })
                                }
                            }, 8500);
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