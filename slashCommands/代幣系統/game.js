const coin = require("../../models/coin.js");
const aa = require("../../topic.json");
const topic = aa["1"]
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
    name: '代幣遊戲',
    cooldown: 10,
    description: '遊玩有關代幣的小遊戲',
    options: [{
        name: '21點',
        type: ApplicationCommandOptionType.Subcommand,
        description: '跟真人遊玩21點!!',
        options: [{
            name: '跟誰玩',
            type: ApplicationCommandOptionType.User,
            description: '輸入你要跟誰玩!',
            required: true,
        }, {
            name: '賭注',
            type: ApplicationCommandOptionType.Integer,
            description: '輸入你的賭注!',
            required: true,
        }]
    }, {
        name: '知識王',
        type: ApplicationCommandOptionType.Subcommand,
        description: '跟真人對比誰的知識性高!!',
        options: [{
            name: '跟誰玩',
            type: ApplicationCommandOptionType.User,
            description: '輸入你要跟誰玩!',
            required: true,
        }, {
            name: '賭注',
            type: ApplicationCommandOptionType.Integer,
            description: '輸入你的賭注!',
            required: true,
        }]
    }, {
        name: '比大小',
        type: ApplicationCommandOptionType.Subcommand,
        description: '由電腦隨機為兩位抽取兩個數字比大小!!',
        options: [{
            name: '跟誰玩',
            type: ApplicationCommandOptionType.User,
            description: '輸入你要跟誰玩!',
            required: true,
        }, {
            name: '賭注',
            type: ApplicationCommandOptionType.Integer,
            description: '輸入你的賭注!',
            required: true,
        }]
    }],
    video: 'https://docsmhcat.yorukot.mes/coin_increase',
    emoji: `<:blackjack1:1005469910689923142>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply();
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            if (interaction.options.getSubcommand() === "知識王") {
                function getRandomArbitrary(min, max) {
                    min = Math.ceil(min);
                    max = Math.floor(max);
                    return Math.floor(Math.random() * (max - min) + min);
                }
                let main_status = false
                let user_status = false
                let main_chose = ''
                let user_chose = ''
                let times = 0
                let time = 20
                let main_number = 0
                let user_number = 0
                const user = interaction.options.getUser("跟誰玩")
                const number = interaction.options.getInteger("賭注")
                if (number < 0) return errors("賭注必須大於-1")
                coin.findOne({
                    guild: interaction.guild.id,
                    member: user.id
                }, async (err, usercoin) => {
                    if (!usercoin || usercoin.coin < number) return errors("對方沒有這麼多代幣可以玩喔!!")
                    coin.findOne({
                        guild: interaction.guild.id,
                        member: interaction.member.id
                    }, async (err, mainusercoin) => {
                        if (!mainusercoin || mainusercoin.coin < number) return errors("你沒有這麼多代幣可以玩喔!!")
                        let question = topic[getRandomArbitrary(0, topic.length)]
                        let nums = [0, 1, 2, 3]
                        let ranNums = []
                        i = nums.length,
                            j = 0;
                        while (i--) {
                            j = Math.floor(Math.random() * (i + 1));
                            ranNums.push(nums[j]);
                            nums.splice(j, 1);
                        }
                        const emoji_abcd = [
                            "<:lettera:1007246307674570753>",
                            "<:letterb:1007245313758740530>",
                            "<:c_:1007245311695126588>",
                            "<:d1:1007245309719625788>"
                        ]
                        let button1 = [];
                        for (let i = 0; i < 4; i++) {
                            button1.push(
                                new ButtonBuilder()
                                .setCustomId(question.unanser[ranNums[i]])
                                .setEmoji(emoji_abcd[i])
                                .setStyle(ButtonStyle.Primary)
                            )
                        }
                        let opthion = new ActionRowBuilder()
                            .addComponents(
                                button1
                            );
                        const agreate = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId("yesssss")
                                .setLabel('點我接受遊玩')
                                .setEmoji("<:halloween_yes:1005480105642041354>")
                                .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                .setCustomId("nooooo")
                                .setLabel('點我拒絕遊玩')
                                .setEmoji("<a:YuiHeadShake:1005480366167040021>")
                                .setStyle(ButtonStyle.Danger),
                            );
                        const agreate1 = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId("yesssss")
                                .setLabel('點我接受遊玩')
                                .setEmoji("<:halloween_yes:1005480105642041354>")
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setCustomId("nooooo")
                                .setLabel('點我拒絕遊玩')
                                .setEmoji("<a:YuiHeadShake:1005480366167040021>")
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true),
                            );
                        const message = await interaction.followUp({
                            content: `<@${user.id}>`,
                            embeds: [
                                new EmbedBuilder()
                                .setTitle("<:idea:1007312008179351624> 知識王")
                                .setDescription(`<@${interaction.member.id}>**邀請<@${user.id}>玩知識王\n將會消耗你**\`${number}\`**進行賭注\n是否願意?\n<a:warn:1000814885506129990> 一但同意如中途放棄則視為敗北**`)
                                .setFooter({
                                    text: "請於30秒內回覆，如無回復則視為拒絕"
                                })
                                .setColor("Random")
                            ],
                            components: [agreate]
                        })
                        const filter = i => ((i.member.id === user.id || i.member.id === interaction.member.id) && message.id === i.message.id);
                        const collector1 = interaction.channel.createMessageComponentCollector({
                            componentType: 2,
                            filter,
                            time: 30 * 1000,
                        })
                        collector1.on('collect', async (interaction01) => {
                            const id = interaction01.customId;
                            if (id === `yesssss`) {
                                usercoin.collection.updateOne(({
                                    guild: interaction.channel.guild.id,
                                    member: user.id
                                }), {
                                    $set: {
                                        coin: usercoin.coin - Number(number)
                                    }
                                })
                                mainusercoin.collection.updateOne(({
                                    guild: interaction.channel.guild.id,
                                    member: interaction.member.id
                                }), {
                                    $set: {
                                        coin: mainusercoin.coin - Number(number)
                                    }
                                })
                                if (interaction01.member.id === interaction.member.id) {
                                    return interaction01.reply({
                                        embeds: [
                                            new EmbedBuilder()
                                            .setTitle("<a:Discord_AnimatedNo:1015989839809757295> | 你不是被邀請者，無法選擇接受!")
                                            .setColor(client.color.error)
                                        ],
                                        ephemeral: true
                                    })
                                }
                                collector1.stop()
                                interaction01.reply({
                                    embeds: [
                                        new EmbedBuilder()
                                        .setTitle(`${client.emoji.done} | 你成功接受了邀請!`)
                                        .setColor(client.color.greate)
                                    ],
                                    ephemeral: true
                                })
                                setTimeout(() => {
                                    message.edit({
                                        content: "<:idea:1007312008179351624> **| 知識王**",
                                        embeds: [new EmbedBuilder()
                                            .setTitle("<:startbutton1:1005838813274325022> 遊戲已開始")
                                            .setDescription(`**類型:**\`${question.type}\`**\n<:q_:1007244629923598377> 題目:\n${question.question}\n
<:lettera:1007246307674570753> ${question.unanser[ranNums[0]]}\n<:letterb:1007245313758740530> ${question.unanser[ranNums[1]]}\n<:c_:1007245311695126588> ${question.unanser[ranNums[2]]}\n<:d1:1007245309719625788> ${question.unanser[ranNums[3]]}

<a:warn:1000814885506129990> 請於<t:${Math.round((new Date(new Date().getTime() + (15 * 1000)) / 1000))}:R>選擇，超過時間則視為棄賽**`)
                                            .setColor("Random")
                                        ],
                                        components: [opthion]
                                    })
                                }, 500);
                                const collector11 = interaction.channel.createMessageComponentCollector({
                                    componentType: 2,
                                    filter,
                                    time: 60 * 8 * 1000,
                                })
                                const aaaa = setInterval(() => {
                                    time = time - 1
                                    if (time < 0) {
                                        clearInterval(aaaa)
                                        collector11.stop()
                                        coin.findOne({
                                            guild: interaction.guild.id,
                                            member: user.id
                                        }, async (err, usercoin) => {
                                            coin.findOne({
                                                guild: interaction.guild.id,
                                                member: interaction.member.id
                                            }, async (err, mainusercoin) => {
                                                usercoin.collection.updateOne(({
                                                    guild: interaction.channel.guild.id,
                                                    member: user.id
                                                }), {
                                                    $set: {
                                                        coin: usercoin.coin + Number(user_status ? number * 2 : 0)
                                                    }
                                                })
                                                mainusercoin.collection.updateOne(({
                                                    guild: interaction.channel.guild.id,
                                                    member: interaction.member.id
                                                }), {
                                                    $set: {
                                                        coin: mainusercoin.coin + Number(main_status ? number * 2 : 0)
                                                    }
                                                })
                                            })
                                        })
                                        return message.edit({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setTitle(`${client.emoji.error} | ${user_status ? '' : `${user.username}`} ${main_status ? '' : `${interaction.member.user.username}`} 超過回應時間，自動判定棄賽!`)
                                                .setColor(client.color.error)
                                            ],
                                            components: []
                                        })
                                    }
                                }, 1000);
                                collector11.on('collect', async (interaction01) => {
                                    const id = interaction01.customId;
                                    if (id === `${question.anser}`) {
                                        get_point = time * 50
                                        if (interaction01.member.id === interaction.member.id) {
                                            if (main_status) {
                                                return interaction01.reply({
                                                    embeds: [
                                                        new EmbedBuilder()
                                                        .setTitle(`${client.emoji.error} | 你已經選取過了!!!`)
                                                        .setColor(client.color.error)
                                                    ],
                                                    ephemeral: true
                                                })
                                            }
                                            main_chose = id
                                            main_number = main_number + get_point
                                            main_status = true
                                        } else {
                                            if (user_status) {
                                                return interaction01.reply({
                                                    embeds: [
                                                        new EmbedBuilder()
                                                        .setTitle(`${client.emoji.error} | 你已經選取過了!!!`)
                                                        .setColor(client.color.error)
                                                    ],
                                                    ephemeral: true
                                                })
                                            }
                                            user_chose = id
                                            user_number = user_number + get_point
                                            user_status = true
                                        }
                                        interaction01.reply({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setTitle(`${client.emoji.done} | 你選擇了正確的答案:${question.anser}`)
                                                .setDescription(`根據你選取的正確以及時間給予你\`${get_point}\`分`)
                                                .setColor(client.color.greate)
                                            ],
                                            ephemeral: true
                                        })
                                        if (main_status && user_status) {
                                            times = times + 1
                                            main_status = false
                                            user_status = false
                                            time = 20
                                            interaction01.message.edit({
                                                embeds: [new EmbedBuilder()
                                                    .setTitle("<:idea:1007312008179351624> 知識王")
                                                    .setDescription(`**<@${interaction.member.id}> 選擇了:${main_chose}
<:speedometer:1007522466995912734> 目前得分:**\`${main_number}\`**
<@${user.id}> 選擇了:${user_chose}
<:speedometer:1007522466995912734> 目前得分:**\`${user_number}\`**
<:technology:1007522316839829514> 正確答案:${question.anser}
類型:**\`${question.type}\`**
<:q_:1007244629923598377> 題目:\n${question.question}

${question.unanser[ranNums[0]] === question.anser ? `<a:green_tick:994529015652163614>` : `<a:error:980086028113182730>`} | ${question.unanser[ranNums[0]]}\n${question.unanser[ranNums[1]] === question.anser ? `<a:green_tick:994529015652163614>` : `<a:Discord_AnimatedNo:1015989839809757295>`} | ${question.unanser[ranNums[1]]}\n${question.unanser[ranNums[2]] === question.anser ? `<a:green_tick:994529015652163614>` : `<a:error:980086028113182730>`} | ${question.unanser[ranNums[2]]}\n${question.unanser[ranNums[3]] === question.anser ? `<a:green_tick:994529015652163614>` : `<a:Discord_AnimatedNo:1015989839809757295>`} | ${question.unanser[ranNums[3]]}

<a:warn:1000814885506129990> 先別離開!還剩下**\`${5-times}\`**題**`)
                                                    .setColor("Random")
                                                ],
                                                components: []
                                            })
                                            setTimeout(() => {
                                                if (times < 5) {
                                                    question = topic[getRandomArbitrary(0, topic.length)]
                                                    nums = [0, 1, 2, 3]
                                                    ranNums = []
                                                    i = nums.length,
                                                        j = 0;
                                                    while (i--) {
                                                        j = Math.floor(Math.random() * (i + 1));
                                                        ranNums.push(nums[j]);
                                                        nums.splice(j, 1);
                                                    }
                                                    button1 = [];
                                                    for (let i = 0; i < 4; i++) {
                                                        button1.push(
                                                            new ButtonBuilder()
                                                            .setCustomId(question.unanser[ranNums[i]])
                                                            .setEmoji(emoji_abcd[i])
                                                            .setStyle(ButtonStyle.Primary)
                                                        )
                                                    }
                                                    opthion = new ActionRowBuilder()
                                                        .addComponents(
                                                            button1
                                                        );
                                                    interaction01.message.edit({
                                                        embeds: [new EmbedBuilder()
                                                            .setTitle("<:idea:1007312008179351624> 知識王")
                                                            .setDescription(`**<:speedometer:1007522466995912734><@${interaction.member.id}> 目前得分:**\`${main_number}\`**
<:speedometer:1007522466995912734> <@${user.id}> 目前得分:**\`${user_number}\`**
類型:**\`${question.type}\`**
<:q_:1007244629923598377> 題目:\n${question.question}
            
<:lettera:1007246307674570753> ${question.unanser[ranNums[0]]}\n<:letterb:1007245313758740530> ${question.unanser[ranNums[1]]}\n<:c_:1007245311695126588> ${question.unanser[ranNums[2]]}\n<:d1:1007245309719625788> ${question.unanser[ranNums[3]]}

<a:warn:1000814885506129990> 請於<t:${Math.round((new Date(new Date().getTime() + (15 * 1000)) / 1000))}:R>選擇，超過時間則視為棄賽**`)
                                                            .setColor("Random")
                                                        ],
                                                        components: [opthion]
                                                    })
                                                } else {
                                                    clearInterval(aaaa)
                                                    collector11.stop()
                                                    interaction01.message.edit({
                                                        embeds: [new EmbedBuilder()
                                                            .setTitle(`${client.emoji.done} **| 遊戲已結束**`)
                                                            .setDescription(`**
<:businesscreditscore:1007236532421275688> 開始進行結算!
<:speedometer:1007522466995912734> <@${interaction.member.id}>得分:**\`${main_number}\`**
<:speedometer:1007522466995912734> <@${user.id}>得分:**\`${user_number}\`**

**<:referee:1007236839524024340>裁判結果:\n${main_number > user_number ? `<@${interaction.member.id}>獲勝!` : main_number === user_number ? `平手，不加也不減**` : `<@${user.id}>獲勝!`}
${main_number === user_number ? "" : `取得:\`${number*2}\``}`)
                                                            .setColor("Random")
                                                        ],
                                                        components: []
                                                    })
                                                    coin.findOne({
                                                        guild: interaction.guild.id,
                                                        member: user.id
                                                    }, async (err, usercoin) => {
                                                        coin.findOne({
                                                            guild: interaction.guild.id,
                                                            member: interaction.member.id
                                                        }, async (err, mainusercoin) => {
                                                            usercoin.collection.updateOne(({
                                                                guild: interaction.channel.guild.id,
                                                                member: user.id
                                                            }), {
                                                                $set: {
                                                                    coin: usercoin.coin + Number(main_number > user_number ? 0 : main_number === user_number ? number : number * 2)
                                                                }
                                                            })
                                                            mainusercoin.collection.updateOne(({
                                                                guild: interaction.channel.guild.id,
                                                                member: interaction.member.id
                                                            }), {
                                                                $set: {
                                                                    coin: mainusercoin.coin + Number(main_number < user_number ? 0 : main_number === user_number ? number : number * 2)
                                                                }
                                                            })
                                                        })
                                                    })
                                                }
                                            }, 5000);
                                        }
                                    } else {
                                        get_point = 0
                                        if (interaction01.member.id === interaction.member.id) {
                                            if (main_status) {
                                                return interaction01.reply({
                                                    embeds: [
                                                        new EmbedBuilder()
                                                        .setTitle(`${client.emoji.error} | 你已經選取過了!!!`)
                                                        .setColor(client.color.error)
                                                    ],
                                                    ephemeral: true
                                                })
                                            }
                                            main_chose = id
                                            main_number = main_number + get_point
                                            main_status = true
                                        } else {
                                            if (user_status) {
                                                return interaction01.reply({
                                                    embeds: [
                                                        new EmbedBuilder()
                                                        .setTitle(`${client.emoji.error} | 你已經選取過了!!!`)
                                                        .setColor(client.color.error)
                                                    ],
                                                    ephemeral: true
                                                })
                                            }
                                            user_chose = id
                                            user_number = user_number + get_point
                                            user_status = true
                                        }
                                        interaction01.reply({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setTitle(`${client.emoji.error} | 你選擇了錯誤的答案，正確答案:${question.anser}`)
                                                .setDescription(`根據你選取的正確以及時間給予你\`${get_point}\`分`)
                                                .setColor(client.color.error)
                                            ],
                                            ephemeral: true
                                        })
                                        if (main_status && user_status) {
                                            times = times + 1
                                            main_status = false
                                            user_status = false
                                            time = 20
                                            interaction01.message.edit({
                                                embeds: [new EmbedBuilder()
                                                    .setTitle("<:idea:1007312008179351624> 知識王")
                                                    .setDescription(`**<@${interaction.member.id}> 選擇了:${main_chose}
<:speedometer:1007522466995912734> 目前得分:**\`${main_number}\`**
<@${user.id}> 選擇了:${user_chose}
<:speedometer:1007522466995912734> 目前得分:**\`${user_number}\`**
<:technology:1007522316839829514> 正確答案:${question.anser}
類型:**\`${question.type}\`**
<:q_:1007244629923598377> 題目:\n${question.question}

${question.unanser[ranNums[0]] === question.anser ? `<a:green_tick:994529015652163614>` : `<a:Discord_AnimatedNo:1015989839809757295>`} | ${question.unanser[ranNums[0]]}\n${question.unanser[ranNums[1]] === question.anser ? `<a:green_tick:994529015652163614>` : `<a:Discord_AnimatedNo:1015989839809757295>`} | ${question.unanser[ranNums[1]]}\n${question.unanser[ranNums[2]] === question.anser ? `<a:green_tick:994529015652163614>` : `<a:Discord_AnimatedNo:1015989839809757295>`} | ${question.unanser[ranNums[2]]}\n${question.unanser[ranNums[3]] === question.anser ? `<a:green_tick:994529015652163614>` : `<a:Discord_AnimatedNo:1015989839809757295>`} | ${question.unanser[ranNums[3]]}

<a:warn:1000814885506129990> 先別離開!還剩下**\`${5-times}\`**題**`)
                                                    .setColor("Random")
                                                ],
                                                components: []
                                            })
                                            setTimeout(() => {
                                                if (times < 5) {
                                                    question = topic[getRandomArbitrary(0, topic.length)]
                                                    nums = [0, 1, 2, 3]
                                                    ranNums = []
                                                    i = nums.length,
                                                        j = 0;
                                                    while (i--) {
                                                        j = Math.floor(Math.random() * (i + 1));
                                                        ranNums.push(nums[j]);
                                                        nums.splice(j, 1);
                                                    }
                                                    button1 = [];
                                                    for (let i = 0; i < 4; i++) {
                                                        button1.push(
                                                            new ButtonBuilder()
                                                            .setCustomId(question.unanser[ranNums[i]])
                                                            .setEmoji(emoji_abcd[i])
                                                            .setStyle(ButtonStyle.Primary)
                                                        )
                                                    }
                                                    opthion = new ActionRowBuilder()
                                                        .addComponents(
                                                            button1
                                                        );
                                                    interaction01.message.edit({
                                                        embeds: [new EmbedBuilder()
                                                            .setTitle("<:idea:1007312008179351624> 知識王")
                                                            .setDescription(`**<:speedometer:1007522466995912734><@${interaction.member.id}> 目前得分:**\`${main_number}\`**
<:speedometer:1007522466995912734> <@${user.id}> 目前得分:**\`${user_number}\`**
類型:**\`${question.type}\`**
<:q_:1007244629923598377> 題目:\n${question.question}
            
<:lettera:1007246307674570753> ${question.unanser[ranNums[0]]}\n<:letterb:1007245313758740530> ${question.unanser[ranNums[1]]}\n<:c_:1007245311695126588> ${question.unanser[ranNums[2]]}\n<:d1:1007245309719625788> ${question.unanser[ranNums[3]]}

<a:warn:1000814885506129990> 請於<t:${Math.round((new Date(new Date().getTime() + (15 * 1000)) / 1000))}:R>選擇，超過時間則視為棄賽**`)
                                                            .setColor("Random")
                                                        ],
                                                        components: [opthion]
                                                    })
                                                } else {
                                                    clearInterval(aaaa)
                                                    collector11.stop()
                                                    interaction01.message.edit({
                                                        embeds: [new EmbedBuilder()
                                                            .setTitle(`${client.emoji.done} **| 遊戲已結束**`)
                                                            .setDescription(`**
<:businesscreditscore:1007236532421275688> 開始進行結算!
<:speedometer:1007522466995912734> <@${interaction.member.id}>得分:**\`${main_number}\`**
<:speedometer:1007522466995912734> <@${user.id}>得分:**\`${user_number}\`**

**<:referee:1007236839524024340>裁判結果:\n${main_number > user_number ? `<@${interaction.member.id}>獲勝!` : main_number === user_number ? `平手，不加也不減**` : `<@${user.id}>獲勝!`}
${main_number === user_number ? "" : `取得:\`${number*2}\``}`)
                                                            .setColor("Random")
                                                        ],
                                                        components: []
                                                    })
                                                    coin.findOne({
                                                        guild: interaction.guild.id,
                                                        member: user.id
                                                    }, async (err, usercoin) => {
                                                        coin.findOne({
                                                            guild: interaction.guild.id,
                                                            member: interaction.member.id
                                                        }, async (err, mainusercoin) => {
                                                            usercoin.collection.updateOne(({
                                                                guild: interaction.channel.guild.id,
                                                                member: user.id
                                                            }), {
                                                                $set: {
                                                                    coin: usercoin.coin + Number(main_number > user_number ? 0 : main_number === user_number ? number : number * 2)
                                                                }
                                                            })
                                                            mainusercoin.collection.updateOne(({
                                                                guild: interaction.channel.guild.id,
                                                                member: interaction.member.id
                                                            }), {
                                                                $set: {
                                                                    coin: mainusercoin.coin + Number(main_number < user_number ? 0 : main_number === user_number ? number : number * 2)
                                                                }
                                                            })
                                                        })
                                                    })
                                                }
                                            }, 5000);
                                        }
                                    }
                                })
                            } else if (id === "nooooo") {
                                collector1.stop()
                                interaction01.message.edit({
                                    components: [agreate1]
                                })
                                interaction01.reply(`<a:green_tick:994529015652163614> | **<@${interaction01.member.id}>拒絕此次邀請!**`)
                            }
                        })
                    })
                })
            } else if (interaction.options.getSubcommand() === "21點") {
                let main_status = null
                let user_status = null
                let time = 0
                let usernow = true
                let number_emoji = {
                    "1": "<:numberone:1005471516407906324>",
                    "2": "<:number2:1005471518018510950>",
                    "3": "<:number3:1005471519574597672>",
                    "4": "<:numberfour:1005471521147473950>",
                    "5": "<:number5:1005471522649022517>",
                    "6": "<:six:1005471524721020948>",
                    "7": "<:seven:1005471526222581760>",
                    "8": "<:number8:1005471527891898398>",
                    "9": "<:number9:1005471529699655780>",
                    "10": "<:number10:1005471531377360957>",
                    "11": "<:number11:1005471533319335956>",
                    "12": "<:number12:1005471534955102238>",
                    "13": "<:number13:1005471536674775100>"
                }
                let me_number = []
                let main_number = []
                let user_number = []
                const user = interaction.options.getUser("跟誰玩")
                const number = interaction.options.getInteger("賭注")
                if (number < -1) return errors("賭注必須大於-1")
                coin.findOne({
                    guild: interaction.guild.id,
                    member: user.id
                }, async (err, usercoin) => {
                    if (!usercoin || usercoin.coin < number) return errors("對方沒有這麼多代幣可以玩喔!!")
                    coin.findOne({
                        guild: interaction.guild.id,
                        member: interaction.member.id
                    }, async (err, mainusercoin) => {
                        if (!mainusercoin || mainusercoin.coin < number) return errors("你沒有這麼多代幣可以玩喔!!")
                        const null_findmenumber = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId("main_no_card")
                                .setLabel('略過')
                                .setEmoji("<a:YuiHeadShake:1005480366167040021>")
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setCustomId("main_get_card")
                                .setLabel('抽牌')
                                .setEmoji("<:playingcard:1006058772634009700>")
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setCustomId("lookmenumber")
                                .setLabel('查看我的牌')
                                .setEmoji("<:searching:986107902777491497>")
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true),
                            );
                        const main_findmenumber = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId("main_no_card")
                                .setLabel('略過')
                                .setEmoji("<a:YuiHeadShake:1005480366167040021>")
                                .setStyle(ButtonStyle.Danger),
                                new ButtonBuilder()
                                .setCustomId("main_get_card")
                                .setLabel('抽牌')
                                .setEmoji("<:playingcard:1006058772634009700>")
                                .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                .setCustomId("lookmenumber")
                                .setLabel('查看我的牌')
                                .setEmoji("<:searching:986107902777491497>")
                                .setStyle(ButtonStyle.Primary),
                            );
                        const user_findmenumber = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId("user_no_card")
                                .setLabel('略過')
                                .setEmoji("<a:YuiHeadShake:1005480366167040021>")
                                .setStyle(ButtonStyle.Danger),
                                new ButtonBuilder()
                                .setCustomId("user_get_card")
                                .setLabel('抽牌')
                                .setEmoji("<:playingcard:1006058772634009700>")
                                .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                .setCustomId("lookmenumber")
                                .setLabel('查看我的牌')
                                .setEmoji("<:searching:986107902777491497>")
                                .setStyle(ButtonStyle.Primary),
                            );
                        const agreate = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId("yesssss")
                                .setLabel('點我接受遊玩')
                                .setEmoji("<:halloween_yes:1005480105642041354>")
                                .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                .setCustomId("nooooo")
                                .setLabel('點我拒絕遊玩')
                                .setEmoji("<a:YuiHeadShake:1005480366167040021>")
                                .setStyle(ButtonStyle.Danger),
                                new ButtonBuilder()
                                .setCustomId("teach21point")
                                .setLabel('甚麼是21點')
                                .setEmoji("<:question:997374195229003776>")
                                .setStyle(ButtonStyle.Secondary),
                            );
                        const agreate1 = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId("yesssss")
                                .setLabel('點我接受遊玩')
                                .setEmoji("<:halloween_yes:1005480105642041354>")
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setCustomId("nooooo")
                                .setLabel('點我拒絕遊玩')
                                .setEmoji("<a:YuiHeadShake:1005480366167040021>")
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setCustomId("teach21point")
                                .setLabel('甚麼是21點')
                                .setEmoji("<:question:997374195229003776>")
                                .setStyle(ButtonStyle.Secondary)
                            );
                        const message = await interaction.followUp({
                            content: `<@${user.id}>`,
                            embeds: [
                                new EmbedBuilder()
                                .setTitle("<:blackjack:1005469849180459131> 21點小遊戲")
                                .setDescription(`<@${interaction.member.id}>**邀請<@${user.id}>玩21點\n將會消耗你**\`${number}\`**進行賭注\n是否願意?\n<a:warn:1000814885506129990> 一但同意如中途放棄則視為敗北**`)
                                .setFooter({
                                    text: "請於30秒內回覆，如無回復則視為拒絕"
                                })
                                .setColor("Random")
                            ],
                            components: [agreate]
                        })
                        const filter = i => ((i.member.id === user.id || i.member.id === interaction.member.id) && message.id === i.message.id);
                        const collector1 = interaction.channel.createMessageComponentCollector({
                            componentType: 2,
                            filter,
                            time: 30 * 1000,
                        })
                        collector1.on('collect', async (interaction01) => {
                            const id = interaction01.customId;
                            if (id === `yesssss`) {
                                usercoin.collection.updateOne(({
                                    guild: interaction.channel.guild.id,
                                    member: user.id
                                }), {
                                    $set: {
                                        coin: usercoin.coin - Number(number)
                                    }
                                })
                                mainusercoin.collection.updateOne(({
                                    guild: interaction.channel.guild.id,
                                    member: interaction.member.id
                                }), {
                                    $set: {
                                        coin: mainusercoin.coin - Number(number)
                                    }
                                })
                                if (interaction01.member.id === interaction.member.id) {
                                    return interaction01.reply({
                                        embeds: [
                                            new EmbedBuilder()
                                            .setTitle("<a:Discord_AnimatedNo:1015989839809757295> | 你不是被邀請者，無法選擇接受!")
                                            .setColor(client.color.error)
                                        ],
                                        ephemeral: true
                                    })
                                }
                                collector1.stop()
                                const {
                                    DropTable
                                } = require('drop-table');
                                let table = new DropTable();
                                for (let index = 0; index < 4; index++) {
                                    for (let aa = 1; aa < 11; aa++) {
                                        table.addItem({
                                            'name': `${aa}${index}`,
                                            'data': {
                                                number: aa
                                            },
                                            'weight': 1
                                        })
                                    }
                                }

                                function drop(array) {
                                    let xxx = []
                                    for (let x = 0; x < array.length; x++) {
                                        xxx.push(number_emoji[array[x]])
                                    }
                                    return xxx.join(',')

                                }

                                function get_number(array) {
                                    let number = 0
                                    for (let i = 0; i < array.length; i++) {
                                        number = number + Number(array[i])
                                    }
                                    return number
                                }
                                do {
                                    let me_1 = table.drop();
                                    table.removeItem(me_1.name);
                                    me_number.push(`${me_1.data.number}`)
                                } while (get_number(me_number) < 13);

                                let main_1 = table.drop();
                                table.removeItem(main_1.name);
                                main_number.push(`${main_1.data.number}`)
                                let user_1 = table.drop();
                                table.removeItem(user_1.name);
                                user_number.push(`${user_1.data.number}`)
                                interaction01.reply({
                                    content: `${client.emoji.done} | 成功接受!!`,
                                    ephemeral: true
                                })
                                message.edit({
                                    content: `這回合是<@${interaction.member.id}>的，另一位只能查看牌組喔!`,
                                    embeds: [new EmbedBuilder()
                                        .setTitle("<:startbutton1:1005838813274325022> 遊戲已開始")
                                        .setDescription(`\n**已為各位各發一張牌\n請選擇要抽牌還是不抽\n<a:warn:1000814885506129990>請於<t:${Math.round((new Date(new Date().getTime() + (30 * 1000)) / 1000))}:R>選擇，超過時間則視為棄賽(你的賭注會全輸)**`)
                                        .setColor("Random")
                                    ],
                                    components: [main_findmenumber]
                                })
                                const collector11 = interaction.channel.createMessageComponentCollector({
                                    componentType: 2,
                                    filter,
                                    time: 60 * 8 * 1000,
                                })
                                const aaaa = setInterval(() => {
                                    time = time + 1
                                    if (time > 30) {
                                        clearInterval(aaaa)
                                        collector11.stop()
                                        coin.findOne({
                                            guild: interaction.guild.id,
                                            member: user.id
                                        }, async (err, usercoin) => {
                                            coin.findOne({
                                                guild: interaction.guild.id,
                                                member: interaction.member.id
                                            }, async (err, mainusercoin) => {
                                                usercoin.collection.updateOne(({
                                                    guild: interaction.channel.guild.id,
                                                    member: user.id
                                                }), {
                                                    $set: {
                                                        coin: usercoin.coin + Number(usernow ? number * 2 : number * 0)
                                                    }
                                                })
                                                mainusercoin.collection.updateOne(({
                                                    guild: interaction.channel.guild.id,
                                                    member: interaction.member.id
                                                }), {
                                                    $set: {
                                                        coin: mainusercoin.coin + Number(!usernow ? number * 2 : number * 0)
                                                    }
                                                })
                                            })
                                        })
                                        return message.edit({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setTitle(`${client.emoji.error} | \`${usernow ? interaction.member.user.username : user.username}\` 超過回應時間，自動判定棄賽!`)
                                                .setColor(client.color.error)
                                            ],
                                            components: []
                                        })
                                    }
                                }, 1000);
                                collector11.on('collect', async (interaction01) => {
                                    const id = interaction01.customId;
                                    if (id === `lookmenumber`) {
                                        let xxx = []
                                        if (interaction01.member.id === interaction.member.id) {
                                            for (let x = 0; x < main_number.length; x++) {
                                                xxx.push(number_emoji[main_number[x]])
                                            }
                                        } else if (interaction01.member.id === user.id) {
                                            for (let x = 0; x < user_number.length; x++) {
                                                xxx.push(number_emoji[user_number[x]])
                                            }
                                        } else {
                                            return
                                        }
                                        interaction01.reply({
                                            embeds: [
                                                new EmbedBuilder()
                                                .setTitle("<:playingcard:1006058772634009700> 以下是你目前的卡牌")
                                                .setDescription(`${xxx.join(", ")}`)
                                                .setTitle(`共:\`${interaction01.member.id === interaction.member.id ? `${get_number(main_number)}` : `${get_number(user_number)}`}\`點`)
                                                .setColor("Random")
                                            ],
                                            ephemeral: true
                                        })
                                    } else if (id === 'main_get_card' || id === 'main_no_card') {
                                        if (interaction01.member.id === interaction.member.id) {
                                            time = 0
                                            usernow = false
                                            const {
                                                DropTable
                                            } = require('drop-table');
                                            let dsadsa = false;
                                            if (id === `main_get_card`) {
                                                let main_1 = table.drop();
                                                table.removeItem(main_1.name);
                                                main_number.push(`${main_1.data.number}`)
                                                dsadsa = true;
                                                main_status = true;
                                                interaction01.reply({
                                                    embeds: [
                                                        new EmbedBuilder()
                                                        .setTitle(`<a:green_tick:994529015652163614> | 你抽到了: ${number_emoji[main_1.data.number]}`)
                                                        .setColor("Random")
                                                    ],
                                                    ephemeral: true
                                                })
                                            } else {
                                                interaction01.reply({
                                                    embeds: [
                                                        new EmbedBuilder()
                                                        .setTitle(`<a:green_tick:994529015652163614> | 你選擇了略過`)
                                                        .setColor("Random")
                                                    ],
                                                    ephemeral: true
                                                })
                                                main_status = false
                                            }
                                            interaction01.message.edit({
                                                content: `<a:arrow_pink:996242460294512690> | **這回合是<@${user.id}>的，另一位只能查看牌組喔!**`,
                                                embeds: [new EmbedBuilder()
                                                    .setTitle("<:startbutton1:1005838813274325022> 21點小遊戲")
                                                    .setDescription(`<@${interaction.member.id}>**選擇了:**\`${dsadsa ? `抽牌` : `略過`}\n\`**請選擇要抽牌還是不抽\n<a:warn:1000814885506129990>請於<t:${Math.round((new Date(new Date().getTime() + (30 * 1000)) / 1000))}:R>選擇，超過時間則視為棄賽(你的賭注會全輸)**`)
                                                    .setColor("Random")
                                                ],
                                                components: [user_findmenumber]
                                            })
                                        } else {
                                            interaction01.reply({
                                                embeds: [
                                                    new EmbedBuilder()
                                                    .setTitle("<a:Discord_AnimatedNo:1015989839809757295> | 還沒輪到你啦!!")
                                                    .setColor(client.color.error)
                                                ],
                                                ephemeral: true
                                            })
                                        }
                                    } else {
                                        if (id === 'user_get_card' || id === 'user_no_card') {
                                            if (interaction01.member.id === user.id) {
                                                time = 0
                                                usernow = true
                                                let dsadsa = false;
                                                if (id === `user_get_card`) {
                                                    let user_1 = table.drop();
                                                    table.removeItem(user_1.name);
                                                    user_number.push(`${user_1.data.number}`)
                                                    dsadsa = true;
                                                    user_status = true;
                                                    interaction01.reply({
                                                        embeds: [
                                                            new EmbedBuilder()
                                                            .setTitle(`<a:green_tick:994529015652163614> | 你抽到了: ${number_emoji[user_1.data.number]}`)
                                                            .setColor("Random")
                                                        ],
                                                        ephemeral: true
                                                    })
                                                } else {
                                                    user_status = false
                                                    interaction01.reply({
                                                        embeds: [
                                                            new EmbedBuilder()
                                                            .setTitle(`<a:green_tick:994529015652163614> | 你選擇了不抽獎`)
                                                            .setColor("Random")
                                                        ],
                                                        ephemeral: true
                                                    })
                                                }
                                                interaction01.message.edit({
                                                    content: `<a:arrow_pink:996242460294512690> | **這回合是<@${interaction.member.id}>的，另一位只能查看牌組喔!**`,
                                                    embeds: [new EmbedBuilder()
                                                        .setTitle("<:startbutton1:1005838813274325022> 21點小遊戲")
                                                        .setDescription(`<@${user.id}>**選擇了:**\`${dsadsa ? `抽牌` : `略過`}\n\`**請選擇要抽牌還是不抽\n<a:warn:1000814885506129990>請於<t:${Math.round((new Date(new Date().getTime() + (30 * 1000)) / 1000))}:R>選擇，超過時間則視為棄賽(你的賭注會全輸)**`)
                                                        .setColor("Random")
                                                    ],
                                                    components: [main_findmenumber]
                                                })
                                                if ((!main_status && !user_status) || (get_number(main_number) > 21 && get_number(user_number) > 21) || (get_number(main_number) > 21 || get_number(user_number) > 21)) {
                                                    collector11.stop()
                                                    clearInterval(aaaa)
                                                    let user_return = 0
                                                    let main_return = 0
                                                    let contentt = ""
                                                    if (get_number(get_number(me_number))) {
                                                        user_return = Math.floor(number * 1.5)
                                                        contentt = "**裁判結果為:\n莊爆了，各取得賭注的**`1.5`**倍**"
                                                    } else if (get_number(main_number) > 21 && get_number(user_number) > 21) {
                                                        user_return = number
                                                        main_return = number
                                                        contentt = "**裁判結果為:\n兩個都爆，不加不減**"
                                                    } else if (get_number(main_number) > 21 && get_number(user_number) < 22) {
                                                        user_return = Math.floor(number * 2)
                                                        contentt = `**裁判結果為:\n<@${interaction.member.id}>爆了\n<@${user.id}>取得賭注的**\`2\`**倍(共**\`${user_return}\`**)**`
                                                    } else if (get_number(user_number) > 21 && get_number(main_number) < 22) {
                                                        main_return = Math.floor(number * 2)
                                                        contentt = `**裁判結果為:\n<@${user.id}>爆了\n<@${interaction.member.id}>取得賭注的**\`2\`**倍(共**\`${main_return}\`**)**`
                                                    } else if (get_number(user_number) < 22 && get_number(main_number) < 22) {
                                                        if (get_number(main_number) > get_number(user_number)) {
                                                            main_return = Math.floor(number * 2)
                                                            contentt = `**裁判結果為:\n<@${interaction.member.id}>大於<@${user.id}>\n<@${interaction.member.id}>取得賭注的**\`2\`**倍(共**\`${main_return}\`**)**`
                                                        } else if (get_number(main_number) < get_number(user_number)) {
                                                            user_return = Math.floor(number * 2)
                                                            contentt = `**裁判結果為:\n<@${user.id}>大於<@${interaction.member.id}>\n<@${user.id}>取得賭注的**\`2\`**倍**(共**\`${user_return}\`**)**`
                                                        } else if (get_number(main_number) === get_number(user_number)) {
                                                            user_return = number
                                                            main_return = number
                                                            contentt = `**裁判結果為:\n<@${interaction.member.id}>等於<@${user.id}>\n平手，因此不加也不減**`
                                                        }
                                                    }
                                                    coin.findOne({
                                                        guild: interaction.guild.id,
                                                        member: user.id
                                                    }, async (err, usercoin) => {
                                                        coin.findOne({
                                                            guild: interaction.guild.id,
                                                            member: interaction.member.id
                                                        }, async (err, mainusercoin) => {
                                                            usercoin.collection.updateOne(({
                                                                guild: interaction.channel.guild.id,
                                                                member: user.id
                                                            }), {
                                                                $set: {
                                                                    coin: usercoin.coin + Number(user_return)
                                                                }
                                                            })
                                                            mainusercoin.collection.updateOne(({
                                                                guild: interaction.channel.guild.id,
                                                                member: interaction.member.id
                                                            }), {
                                                                $set: {
                                                                    coin: mainusercoin.coin + Number(main_return)
                                                                }
                                                            })
                                                        })
                                                    })

                                                    interaction01.message.edit({
                                                        content: `<a:green_tick:994529015652163614> **| 遊戲已結束!**`,
                                                        embeds: [new EmbedBuilder()
                                                            .setTitle("<:startbutton1:1005838813274325022> 21點小遊戲")
                                                            .setDescription(`**<:businesscreditscore:1007236532421275688> 遊戲已經結束，現在開始結算成績**\n
**莊家總共:**\n${drop(me_number)}**(共**\`${get_number(me_number)}\`**點)**
**<@${interaction.member.id}>總共:**\n${drop(main_number)}**(共**\`${get_number(main_number)}\`**點)**
**<@${user.id}>總共:**\n${drop(user_number)}**(共**\`${get_number(user_number)}\`**點)**\n
<:referee:1007236839524024340> ${contentt}`)
                                                            .setColor("Random")
                                                        ],
                                                        components: []
                                                    })
                                                }
                                            } else {
                                                interaction01.reply({
                                                    embeds: [
                                                        new EmbedBuilder()
                                                        .setTitle("<a:Discord_AnimatedNo:1015989839809757295> | 還沒輪到你啦!!")
                                                        .setColor(client.color.error)
                                                    ],
                                                    ephemeral: true
                                                })
                                            }
                                        }
                                    }
                                })
                            } else if (id === "nooooo") {
                                collector1.stop()
                                interaction01.message.edit({
                                    components: [agreate1]
                                })
                                interaction01.reply(`<a:green_tick:994529015652163614> | **<@${interaction01.member.id}>拒絕此次邀請!**`)
                            }
                        })
                    })
                })
            } else if (interaction.options.getSubcommand() === "比大小") {
                const user = interaction.options.getUser("跟誰玩")
                const number = interaction.options.getInteger("賭注")
                if (number < -1) return errors("賭注必須大於-1")
                coin.findOne({
                    guild: interaction.guild.id,
                    member: user.id
                }, async (err, usercoin) => {
                    if (!usercoin || usercoin.coin < number) return errors("對方沒有這麼多代幣可以玩喔!!")
                    coin.findOne({
                        guild: interaction.guild.id,
                        member: interaction.member.id
                    }, async (err, mainusercoin) => {
                        if (!mainusercoin || mainusercoin.coin < number) return errors("你沒有這麼多代幣可以玩喔!!")
                        const agreate = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId("yesssss")
                                .setLabel('點我接受遊玩')
                                .setEmoji("<:halloween_yes:1005480105642041354>")
                                .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                .setCustomId("nooooo")
                                .setLabel('點我拒絕遊玩')
                                .setEmoji("<a:YuiHeadShake:1005480366167040021>")
                                .setStyle(ButtonStyle.Danger),
                                new ButtonBuilder()
                                .setCustomId("thansize")
                                .setLabel('甚麼是比大小')
                                .setEmoji("<:question:997374195229003776>")
                                .setStyle(ButtonStyle.Secondary),
                            );
                        const agreate1 = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId("yesssss")
                                .setLabel('點我接受遊玩')
                                .setEmoji("<:halloween_yes:1005480105642041354>")
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setCustomId("nooooo")
                                .setLabel('點我拒絕遊玩')
                                .setEmoji("<a:YuiHeadShake:1005480366167040021>")
                                .setStyle(ButtonStyle.Danger)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setCustomId("thansize")
                                .setLabel('甚麼是比大小')
                                .setEmoji("<:question:997374195229003776>")
                                .setStyle(ButtonStyle.Secondary)
                            );
                        const message = await interaction.followUp({
                            content: `<@${user.id}>`,
                            embeds: [
                                new EmbedBuilder()
                                .setTitle("<:numberblocks:1044894385340416031> 比大小")
                                .setDescription(`<@${interaction.member.id}>**邀請<@${user.id}>玩比大小\n將會消耗你**\`${number}\`**進行賭注\n是否願意?\n<a:warn:1000814885506129990> 一但同意如中途放棄則視為敗北**`)
                                .setFooter({
                                    text: "請於30秒內回覆，如無回復則視為拒絕"
                                })
                                .setColor("Random")
                            ],
                            components: [agreate]
                        })
                        const filter = i => ((i.member.id === user.id || i.member.id === interaction.member.id) && message.id === i.message.id);
                        const collector1 = interaction.channel.createMessageComponentCollector({
                            componentType: 2,
                            filter,
                            time: 30 * 1000,
                        })
                        collector1.on('collect', async (interaction01) => {
                            const id = interaction01.customId;
                            if (id === `yesssss`) {
                                usercoin.collection.updateOne(({
                                    guild: interaction.channel.guild.id,
                                    member: user.id
                                }), {
                                    $set: {
                                        coin: usercoin.coin - Number(number)
                                    }
                                })
                                mainusercoin.collection.updateOne(({
                                    guild: interaction.channel.guild.id,
                                    member: interaction.member.id
                                }), {
                                    $set: {
                                        coin: mainusercoin.coin - Number(number)
                                    }
                                })
                                if (interaction01.member.id === interaction.member.id) {
                                    return interaction01.reply({
                                        embeds: [
                                            new EmbedBuilder()
                                            .setTitle("<a:Discord_AnimatedNo:1015989839809757295> | 你不是被邀請者，無法選擇接受!")
                                            .setColor(client.color.error)
                                        ],
                                        ephemeral: true
                                    })
                                }
                                function getRandomIntInclusive(min, max) {
                                    min = Math.ceil(min);
                                    max = Math.floor(max);
                                    return Math.floor(Math.random() * (max - min + 1) + min);
                                  }
                                let member = getRandomIntInclusive(0, 100)
                                let user11111 = getRandomIntInclusive(0, 100)
                                interaction01.message.edit({
                                    content: "<:gashapon:997374176526610472> | **正在為您隨機抽取數字...**\nhttps://cdn.discordapp.com/attachments/991337796960784424/1044634932116463616/1_5qKsAmlzBKZFGBvyivhBog.gif",
                                    embeds: [],
                                    components: []
                                })
                                setTimeout(() => {
                                                    let user_return = 0
                                                    let main_return = 0
                                                    let contentt = ""
                                                   if (member < user11111) {
                                                        user_return = Math.floor(number * 2)
                                                        contentt = `**裁判結果為:\n<@${interaction.member.id}>輸了\n<@${user.id}>取得賭注的**\`2\`**倍(共**\`${user_return}\`**)**`
                                                    } else if (member === user11111) {
                                                        user_return = number
                                                        main_return = number
                                                        contentt = "**裁判結果為:\n平手，不加不減**"
                                                    } else if(member > user11111) {
                                                        main_return = Math.floor(number * 2)
                                                        contentt = `**裁判結果為:\n<@${user.id}>輸了\n<@${interaction.member.id}>取得賭注的**\`2\`**倍(共**\`${main_return}\`**)**`
                                                    }
                                                    coin.findOne({
                                                        guild: interaction.guild.id,
                                                        member: user.id
                                                    }, async (err, usercoin) => {
                                                        coin.findOne({
                                                            guild: interaction.guild.id,
                                                            member: interaction.member.id
                                                        }, async (err, mainusercoin) => {
                                                            usercoin.collection.updateOne(({
                                                                guild: interaction.channel.guild.id,
                                                                member: user.id
                                                            }), {
                                                                $set: {
                                                                    coin: usercoin.coin + Number(user_return)
                                                                }
                                                            })
                                                            mainusercoin.collection.updateOne(({
                                                                guild: interaction.channel.guild.id,
                                                                member: interaction.member.id
                                                            }), {
                                                                $set: {
                                                                    coin: mainusercoin.coin + Number(main_return)
                                                                }
                                                            })
                                                        })
                                                    })
                                    interaction01.message.edit({
                                        content: null,
                                        embeds: [
                                            new EmbedBuilder()
                                            .setTitle('<:numberblocks:1044894385340416031> 比大小結果')
                                            .setColor('Random')
                                            .setDescription(`<@${interaction.member.id}>的數字: ${member}
<@${user.id}>的數字: ${user11111}
<:referee:1007236839524024340> ${contentt}
`
                                            )
                                        ]
                                    })
                                }, 5000);

                            } else if (id === "nooooo") {
                                collector1.stop()
                                interaction01.message.edit({
                                    components: [agreate1]
                                })
                                interaction01.reply(`<a:green_tick:994529015652163614> | **<@${interaction01.member.id}>拒絕此次邀請!**`)
                            }
                        })
                    })
                })
            }
        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}