const chat_role = require('../../models/voice_role.js');
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
    name: '語音經驗身分組設定',
    cooldown: 10,
    description: '設定語音經驗通知要在哪發送(兼增加、刪除、設定查詢)',
    options: [{
        name: '增加',
        type: ApplicationCommandOptionType.Subcommand,
        description: '當有人的等級達到後要給予身分組',
        options: [{
            name: '等級',
            type: ApplicationCommandOptionType.Integer,
            description: '輸入要在幾等時給予身分組!',
            required: true
        }, {
            name: '身分組',
            type: ApplicationCommandOptionType.Role,
            description: '當到達設定的等級時時，要給甚麼身份組',
            required: true
        }, {
            name: '是否自動刪除',
            type: ApplicationCommandOptionType.Boolean,
            description: '當使用者等級不再是所設定的等級時自動將此身分組刪除(默認為否)',
            required: false
        }]
    }, {
        name: '刪除',
        type: ApplicationCommandOptionType.Subcommand,
        description: '刪除之前的設定',
        options: [{
            name: '等級',
            type: ApplicationCommandOptionType.Integer,
            description: '輸入之前設定的身分組!',
            required: true
        }, {
            name: '身分組',
            type: ApplicationCommandOptionType.Role,
            description: '當到達設定的等級時時，要給甚麼身份組',
            required: true
        }]
    }, {
        name: '設定查詢',
        type: ApplicationCommandOptionType.Subcommand,
        description: '查看之前的設定',
    }],
    video: 'https://docsmhcat.yorukot.me/docs/chat_xp_set',
    UserPerms: '訊息管理',
    emoji: `<:configuration:984010500608249886>`,
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
            const leavel = interaction.options.getInteger("等級")
            const role11 = interaction.options.getRole("身分組")
            const deelete_wheb_not = interaction.options.getBoolean("是否自動刪除")
            const role = role11 ? role11 : {
                id: "dsa"
            }
            chat_role.findOne({
                guild: interaction.channel.guild.id,
                role: role.id,
                leavel: `${leavel}`
            }, async (err, data) => {
                if (interaction.options.getSubcommand() === "增加") {
                    chat_role.find({
                        guild: interaction.channel.guild.id,
                    }, async (err, data111111111111111111) => {
                        if(data111111111111111111.length > 119) return errors("你的設定已經過多，請先刪除一些!")
                        if (Number(role.position) >= Number(interaction.guild.members.me.roles.highest.position)) return errors("我沒有權限給大家這個身分組(請把我的身分組調高)!")
                    if (data) data.delete()
                    data = new chat_role({
                        guild: interaction.channel.guild.id,
                        leavel: leavel,
                        role: role.id,
                        delete_when_not: deelete_wheb_not ? deelete_wheb_not : false
                    })
                    data.save()
                    const announcement_set_embed = new EmbedBuilder()
                        .setTitle(`${client.emoji.channel}語音經驗系統`)
                        .setDescription(`${client.emoji.done}成功\`增加\`/\`修改\`該設定`)
                        .setColor(client.color.greate)
                    interaction.editReply({
                        embeds: [announcement_set_embed]
                    })
                    })
                    
                } else if (interaction.options.getSubcommand() === "設定查詢") {
                    const number = 0
                    chat_role.find({
                        guild: interaction.channel.guild.id,
                    }, async (err, data) => {
                        const data1 = []
                        for (let i = 0; i < data.length; i++) {
                            const role = interaction.guild.roles.cache.get(data[i].role)
                            if (!role) {
                                data[i].delete()
                            }
                            data1.push(data[i])
                        }
                        let testtestestesteteste = []
                        let a1 = data1[number * 12 + 0] ? testtestestesteteste.push({
                            name: `第${number*12 + 1}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 0].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 0].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 0].delete_when_not}`,
                            inline: true
                        }) : null
                        let a2 = data1[number * 12 + 1] ? testtestestesteteste.push({
                            name: `第${number*12 + 2}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 1].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 1].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 1].delete_when_not}`,
                            inline: true
                        }) : null
                        let a3 = data1[number * 12 + 2] ? testtestestesteteste.push({
                            name: `第${number*12 + 3}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 2].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 2].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 2].delete_when_not}`,
                            inline: true
                        }) : null
                        let a4 = data1[number * 12 + 3] ? testtestestesteteste.push({
                            name: `第${number*12 + 4}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 3].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 3].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 3].delete_when_not}`,
                            inline: true
                        }) : null
                        let a5 = data1[number * 12 + 4] ? testtestestesteteste.push({
                            name: `第${number*12 + 5}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 4].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 4].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 4].delete_when_not}`,
                            inline: true
                        }) : null
                        let a6 = data1[number * 12 + 12] ? testtestestesteteste.push({
                            name: `第${number*12 + 6}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 5 + 12].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 5].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 5].delete_when_not}`,
                            inline: true
                        }) : null
                        let a7 = data1[number * 12 + 6] ? testtestestesteteste.push({
                            name: `第${number*12 + 7}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 6].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 6].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 6].delete_when_not}`,
                            inline: true
                        }) : null
                        let a8 = data1[number * 12 + 7] ? testtestestesteteste.push({
                            name: `第${number*12 + 8}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 7].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 7].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 7].delete_when_not}`,
                            inline: true
                        }) : null
                        let a9 = data1[number * 12 + 8] ? testtestestesteteste.push({
                            name: `第${number*12 + 9}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 8].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 8].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 8].delete_when_not}`,
                            inline: true
                        }) : null
                        let a10 = data1[number * 12 + 9] ? testtestestesteteste.push({
                            name: `第${number*12 + 10}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 9].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 9].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 9].delete_when_not}`,
                            inline: true
                        }) : null
                        let a11 = data1[number * 12 + 10] ? testtestestesteteste.push({
                            name: `第${number*12 + 11}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 10].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 10].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 10].delete_when_not}`,
                            inline: true
                        }) : null
                        let a12 = data1[number * 12 + 11] ? testtestestesteteste.push({
                            name: `第${number*12 + 12}個:`,
                            value: `<:levelup:990254382845157406> **等級:**` + `\`${data1[number * 12 + 11].leavel}\`\n<:roleplaying:985945121264635964> **身分組:**<@&${data1[number * 12 + 11].role}>` + `\n${client.emoji.delete} **是否自動刪除身分組:**${data1[number * 12 + 11].delete_when_not}`,
                            inline: true
                        }) : null

                        const bt100 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(`${number - 1}voice_leave_role`)
                        .setEmoji("<:previous:986067803910066256>")
                        .setLabel('上一頁')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(number - 1 === -1 ? true : false),
                        new ButtonBuilder()
                        .setCustomId(`${number + 1}voice_leave_role`)
                        .setEmoji("<:next:986067802056167495>")
                        .setLabel('下一頁')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(number + 1 >= Math.ceil(data1.length / 12) ? true : false),
                    );
                        interaction.editReply({
                            embeds: [
                                new EmbedBuilder()
                                .setTitle(`${client.emoji.channel} 以下是語音經驗身分組的所有設定!!`)
                                .setFields(testtestestesteteste)
                                .setColor(`Random`)
                                .setFooter({text: `總共: ${data1.length} 筆資料\n第 ${number + 1} / ${Math.ceil(data1.length / 12)} 頁(按按鈕會自動更新喔!`})
                            ],
                            components: [bt100]
                        })
                    })
                } else {
                    if (data) {
                        data.delete()
                        const announcement_set_embed = new EmbedBuilder()
                            .setTitle(`${client.emoji.delete}語音經驗系統`)
                            .setDescription(`${client.emoji.done}成功刪除該設定`)
                            .setColor(client.color.greate)
                        return interaction.editReply({
                            embeds: [announcement_set_embed]
                        })
                    } else {
                        return errors("你沒有設定過這個選項!")
                    }
                }
            })

        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}