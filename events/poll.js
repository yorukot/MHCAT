const btn = require("../models/btn.js")
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
    ChartJSNodeCanvas,
    ChartConfiguration,
} = require("chartjs-node-canvas");
const system = require('../models/system.js')
const writeXlsxFile = require('write-excel-file/node')

function getUnique(array) {
    var uniqueArray = [];

    for (var value of array) {
        if (uniqueArray.indexOf(value) === -1) {
            uniqueArray.push(value);
        }
    }
    return uniqueArray;
}

function timeConverter(UNIX_timestamp) {
    const date = new Date(UNIX_timestamp);
    const options = {
        formatMatcher: 'basic',
        timeZone: 'Asia/Taipei',
        timeZoneName: 'long',
        year: 'numeric',
        month: "2-digit",
        day: "2-digit",
        hour12: false
    };
    return date.toLocaleTimeString('zh-TW', options)
}
const canvas = new ChartJSNodeCanvas({
    type: 'jpg',
    width: 500,
    height: 500,
    backgroundColour: "rgb(47,49,54)",
});
canvas.registerFont(`./fonts/font1.ttf`, {
    family: 'font',
});
canvas.registerFont(`./fonts/all.ttf`, {
    family: 'font2',
});
canvas.registerFont(`./fonts/font2.ttf`, {
    family: 'font1',
});

const poll = require('../models/poll.js')
const client = require('../index');

client.on("interactionCreate", async (interaction) => {
    function errors(content, reason) {
        const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setDescription(reason ? reason : null).setColor("Red");
        interaction.editReply({
            embeds: [embed],
            ephemeral: true
        })
    }
        if (interaction.isButton()) {
            if (interaction.customId.includes('poll_')) {
                await interaction.deferReply({
                    ephemeral: true
                });
                let vaule = interaction.customId.replace('poll_', '')
                poll.findOne({
                    guild: interaction.channel.guild.id,
                    messageid: interaction.message.id,
                }, async (err, data) => {
                    if (data) {
                        if (data.end) return errors('該投票已被結束!')
                        let member_join_time = 0
                        data.join_member.forEach(function (join_member_data) {
                            if (join_member_data.id === interaction.member.id) {
                                member_join_time = member_join_time + 1
                            }
                        })
                        let member_choise = []
                        let member_choise_all = []
                        data.join_member.forEach(function (join_member_data) {
                            if (join_member_data.id === interaction.member.id) {
                                member_choise.push(join_member_data.choise)
                                member_choise_all.push(join_member_data)
                            }
                        })
                        let member_delete_array = data.join_member
                        if (member_choise.includes(vaule)) {
                            if (!data.can_change_choose) return errors('很抱歉，該投票不支援更改選項!')
                            member_choise_all.forEach(function (data11111) {
                                if (data11111.choise === vaule) {
                                    var index = member_delete_array.indexOf(data11111);
                                    if (index !== -1) {
                                        member_delete_array.splice(index, 1);
                                    }
                                    data.collection.updateOne(({
                                        guild: interaction.channel.guild.id,
                                        messageid: interaction.message.id
                                    }), {
                                        $set: {
                                            join_member: member_delete_array
                                        }
                                    })
                                    const announcement_set_embed = new EmbedBuilder()
                                        .setTitle(client.emoji.done + ' | 成功取消投給\`' + vaule + '\`!')
                                        .setColor("Green")
                                    interaction.editReply({
                                        embeds: [announcement_set_embed]
                                    })
                                }
                            })
                        } else {
                            if (member_join_time > data.many_choose - 1) return errors('你已經達到該投票最大上限', '如需更改選項，請將原來所選的選項點掉!')
                            let int_member_choise = {
                                id: interaction.user.id,
                                choise: vaule,
                                time: `${Math.round(Date.now())}`
                            }
                            member_delete_array.push(int_member_choise)
                            data.collection.updateOne(({
                                guild: interaction.channel.guild.id,
                                messageid: interaction.message.id
                            }), {
                                $set: {
                                    join_member: member_delete_array
                                }
                            })
                            const announcement_set_embed = new EmbedBuilder()
                                .setTitle(client.emoji.done + ' | 你成功投給\`' + vaule + '\`!')
                                .setColor("Green")
                                .setDescription('如需更改選項，可以再點選一次該選項即可取消投票')
                            interaction.editReply({
                                embeds: [announcement_set_embed]
                            })
                        }
                        setTimeout(async () => {
                            const userIds = new Set();
                            for (const member of (await interaction.guild.members.fetch()).values()) {
                                const user = await client.users.fetch(member.id);
                                if (!userIds.has(user.id) && !user.bot) {
                                    userIds.add(user.id);
                                }
                            }
                            poll.findOne({
                                guild: interaction.channel.guild.id,
                                messageid: interaction.message.id,
                            }, async (err, data11111) => {
                                let member_count111111 = []
                                data11111.join_member.forEach(element => {
                                    member_count111111.push(element.id)
                                });
                                let member_count = getUnique(member_count111111)
                                let embed = new EmbedBuilder()
                                    .setTitle(`<:poll:1023968837965709312> | 投票\n${data11111.question}`)
                                    .setDescription(`<:vote:1023969411369025576> **總投票人數:\`${member_count.length}\` / \`${userIds.size}\`|參與率:\`${(member_count.length / userIds.size * 100).toFixed(2)}\`%**
                    
    <:YellowSmallDot:1023970607429328946> **每人可以投給\`${data11111.many_choose}\`個選項
    <:YellowSmallDot:1023970607429328946> \`${data11111.can_change_choose ? '可以' : '無法'}\`改投其他選項
    <:YellowSmallDot:1023970607429328946> \`${data11111.can_see_result ? '可以' : '無法'}\`看到投票結果
    <:YellowSmallDot:1023970607429328946> \`${data11111.anonymous ? '匿名' : '實名'}\`投票**
                    `)
                                    .setColor('Random')
                                interaction.message.edit({
                                    embeds: [embed],
                                })
                            })
                        }, 50);
                    } else {
                        return
                    }
                })
            } else if (interaction.customId === 'see_result') {
                await interaction.deferReply({
                    ephemeral: true
                });
                poll.findOne({
                    guild: interaction.channel.guild.id,
                    messageid: interaction.message.id,
                }, async (err, data) => {
                    if (!data) return errors('該投票已經過期(超過30天會自動刪除)')
                    if (!data.can_see_result && data.create_member_id !== interaction.user.id) return errors('這個投票不是公開的!', '如需公開該投票，請使用下方選擇器!')
                    if (data.join_member.length === 0) return errors('還沒有人參與投票!')

                    function getdatanumber(data) {
                        let data_array = []
                        for (let index = 0; index < data.choose_data.length; index++) {
                            let test = 0
                            data.join_member.forEach(function (new_data_test) {
                                if (new_data_test.choise === data.choose_data[index]) {
                                    test = test + 1
                                }
                            })
                            data_array.push(test)
                        }
                        return data_array
                    }
                    const data1 = {
                        labels: data.choose_data,
                        datasets: [{
                            label: '投票結果表',
                            data: getdatanumber(data),
                            backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(255, 205, 86)',
                                'rgb(255,88,8)',
                                'rgb(40,255,41)',
                                'rgb(2,255,255)',
                                'rgb(159,52,255)',
                                'rgb(255,211,8)',
                                'rgb(2,247,142)',
                                'rgb(174,87,164)',
                                'rgb(90,90,173)',
                                'rgb(79,157,157)',
                                'rgb(155,255,2)',
                                'rgb(148,148,73)',
                                'rgb(249,249,0)',
                                'rgb(152,75,75)',
                                'rgb(142,142,142)',
                                'rgb(255,160,67)',
                                'rgb(255,68,255)',
                            ],
                            display: true,

                        }]
                    };
                    const configuration = {
                        type: 'pie',
                        data: data1,
                        options: {
                            plugins: {

                                legend: {
                                    display: true,
                                    labels: {
                                        font: {
                                            size: 20,
                                            weight: 'bold',
                                            family: "'font','font1','font2'"
                                        },
                                        color: 'rgb(255,255,255)',
                                    },
                                },
                                title: {
                                    display: true,
                                    text: data.question,
                                    font: {
                                        size: 20,
                                        weight: 'bold',
                                        family: "'font','font1','font2'"
                                    },
                                    color: 'rgb(255,255,255)',
                                },
                            }
                        },
                    };
                    const image = await canvas.renderToBuffer(configuration);
                    const attachment = new AttachmentBuilder(image);
                    let data_array = []
                    for (let index = 0; index < data.choose_data.length; index++) {
                        let test = ''
                        let member_count = 0
                        data.join_member.forEach(function (new_data_test) {
                            if (data.anonymous) {
                                test = '該投票為匿名，無法查看誰有進行投票'
                                if (new_data_test.choise === data.choose_data[index]) {
                                    member_count = member_count + 1
                                }
                            } else if (data.join_member.length > 50) {
                                test = '由於人數過多，無法顯示所有人'
                                if (new_data_test.choise === data.choose_data[index]) {
                                    member_count = member_count + 1
                                }
                            } else if (new_data_test.choise === data.choose_data[index]) {
                                test = test + `<@${new_data_test.id}>`
                                member_count = member_count + 1
                            }
                        })

                        data_array.push({
                            name: data.choose_data[index] + `(共${member_count}人 \`${(member_count /  data.join_member.length * 100).toFixed(2)}\`%)`,
                            value: test.length === 0 ? '<a:Discord_AnimatedNo:1015989839809757295> | 還沒有人投給這個選項' : test,
                            inline: false
                        },)
                    }
                    const embed = new EmbedBuilder()
                        .setTitle("<:poll:1023968837965709312> | " + data.question)
                        .addFields(data_array)
                        .setColor('Random')
                        .setImage("attachment://file.jpg");
                    let string_data = []
                    for (let i = 0; i < data.join_member.length; i++) {
                        string_data.push(`使用者id:${data.anonymous ? '該投票為匿名' : data.join_member[i].id}|使用者名稱:${data.anonymous ? '該投票為匿名' : (await interaction.guild.members.cache.get(data.join_member[i].id)) ? (await interaction.guild.members.cache.get(data.join_member[i].id)).user.username + '#' + (await interaction.guild.members.cache.get(data.join_member[i].id)).user.discriminator : '使用者已退出伺服器!'}|使用者投給的選項:${data.join_member[i].choise}|投票時間:${!isNaN(data.join_member[i].time) ? timeConverter(Number(data.join_member[i].time)) : data.join_member[i].time}`)
                    }
                    let atc = new AttachmentBuilder(Buffer.from(`${string_data.join(`\n`)}`), {
                        name: 'discord.txt'
                    });
                    interaction.editReply({
                        embeds: [embed],
                        files: [attachment, atc],
                    })
                    setTimeout(async () => {
                        const userIds = new Set();
                        for (const member of (await interaction.guild.members.fetch()).values()) {
                            const user = await client.users.fetch(member.id);
                            if (!userIds.has(user.id) && !user.bot) {
                                userIds.add(user.id);
                            }
                        }
                        poll.findOne({
                            guild: interaction.channel.guild.id,
                            messageid: interaction.message.id,
                        }, async (err, data11111) => {
                            let member_count111111 = []
                            data11111.join_member.forEach(element => {
                                member_count111111.push(element.id)
                            });
                            let member_count = getUnique(member_count111111)
                            let embed = new EmbedBuilder()
                                .setTitle(`<:poll:1023968837965709312> | 投票\n${data11111.question}`)
                                .setDescription(`<:vote:1023969411369025576> **總投票人數:\`${member_count.length}\` / \`${userIds.size}\`|參與率:\`${(member_count.length / userIds.size * 100).toFixed(2)}\`%**
                
<:YellowSmallDot:1023970607429328946> **每人可以投給\`${data11111.many_choose}\`個選項
<:YellowSmallDot:1023970607429328946> \`${data11111.can_change_choose ? '可以' : '無法'}\`改投其他選項
<:YellowSmallDot:1023970607429328946> \`${data11111.can_see_result ? '可以' : '無法'}\`看到投票結果
<:YellowSmallDot:1023970607429328946> \`${data11111.anonymous ? '匿名' : '實名'}\`投票**
                `)
                                .setColor('Random')
                            interaction.message.edit({
                                embeds: [embed],
                            })
                        })
                    }, 50);
                })
            } else {
                return
            }
        } else if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'poll_menu') {


                await interaction.deferReply({
                    ephemeral: true
                });
                let value = interaction.values[0];

                function done_embed(content) {
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(client.emoji.done + content)
                            .setColor('Green')
                        ]
                    })
                }
                poll.findOne({
                    guild: interaction.channel.guild.id,
                    messageid: interaction.message.id,
                }, async (err, data) => {
                    if (data.create_member_id !== interaction.user.id) return errors('你不是投票發起人，無法操作!')
                    if (value === 'poll_public_result') {
                        if (data.can_see_result) {
                            data.collection.updateOne(({
                                guild: interaction.channel.guild.id,
                                messageid: interaction.message.id
                            }), {
                                $set: {
                                    can_see_result: false
                                }
                            })
                            done_embed('成功將投票結果設為不公開!')
                        } else if (!data.can_see_result) {
                            data.collection.updateOne(({
                                guild: interaction.channel.guild.id,
                                messageid: interaction.message.id
                            }), {
                                $set: {
                                    can_see_result: true
                                }
                            })
                            done_embed('成功將投票結果設為公開!')
                        }
                    } else if (value === 'poll_can_choose_many') {
                        if (data.choose_data.length < 3) return errors('必須要有3個選項才能啟用多選')
                        let menu_choose_data = []
                        for (let index = 1; index < data.choose_data.length; index++) {
                            let data_test = {
                                label: `${index}個選項`,
                                description: `最多可以可以投給${index}個選項`,
                                value: `${index}`,
                            }
                            menu_choose_data.push(data_test)
                        }
                        const menu_choose = new ActionRowBuilder()
                            .addComponents(
                                new SelectMenuBuilder()
                                .setCustomId('menu_choose')
                                .setPlaceholder('請選擇可以最多選擇數!')
                                .addOptions(menu_choose_data),
                            );
                        const week_embed = new EmbedBuilder()
                            .setTitle('<:maybe:1023971826948391074> | 請選擇最多選擇數量')
                            .setColor('Random')
                        let msgg = await interaction.followUp({
                            embeds: [week_embed],
                            components: [menu_choose]
                        });
                        const collector = msgg.createMessageComponentCollector({
                            componentType: 3,
                            time: 5 * 60 * 1000,
                        });
                        collector.on("collect", (interaction01) => {
                            if (interaction01.customId === 'menu_choose') {
                                data.collection.updateOne(({
                                    guild: interaction.channel.guild.id,
                                    messageid: interaction.message.id
                                }), {
                                    $set: {
                                        many_choose: Number(interaction01.values[0])
                                    }
                                })
                                const hour_embed = new EmbedBuilder()
                                    .setTitle(`${client.emoji.done} | 成功將最多選擇數量設為${interaction01.values[0]}`)
                                    .setColor('Random')
                                interaction01.update({
                                    embeds: [hour_embed],
                                    components: []
                                });
                            }
                        })
                    } else if (value === 'poll_can_change_choose') {
                        if (data.can_change_choose) {
                            data.collection.updateOne(({
                                guild: interaction.channel.guild.id,
                                messageid: interaction.message.id
                            }), {
                                $set: {
                                    can_change_choose: false
                                }
                            })
                            done_embed('成功將投票設為無法更改選項!')
                        } else if (!data.can_change_choose) {
                            data.collection.updateOne(({
                                guild: interaction.channel.guild.id,
                                messageid: interaction.message.id
                            }), {
                                $set: {
                                    can_change_choose: true
                                }
                            })
                            done_embed('成功將投票設為可以更改選項!')
                        }
                    } else if (value === 'poll_anonymous') {
                        if (data.anonymous) {
                            errors('匿名的投票無法改為實名!')
                        } else if (!data.anonymous) {
                            data.collection.updateOne(({
                                guild: interaction.channel.guild.id,
                                messageid: interaction.message.id
                            }), {
                                $set: {
                                    anonymous: true
                                }
                            })
                            done_embed('成功將投票設為匿名投票!')
                        }
                    } else if (value === 'poll_end_poll') {
                        if (data.end) {
                            data.collection.updateOne(({
                                guild: interaction.channel.guild.id,
                                messageid: interaction.message.id
                            }), {
                                $set: {
                                    end: false
                                }
                            })
                            done_embed('成功重新開啟投票!')
                        } else if (!data.end) {
                            data.collection.updateOne(({
                                guild: interaction.channel.guild.id,
                                messageid: interaction.message.id
                            }), {
                                $set: {
                                    end: true
                                }
                            })
                            done_embed('成功結束投票!')
                        }
                    } else if (value === 'poll_excel_result') {
                        if (data.anonymous) return errors('該投票為匿名，無法查看投票資訊!')
                        const HEADER_ROW = [{
                                value: '使用者ID',
                                fontWeight: 'bold'
                            },
                            {
                                value: '使用者dc內名稱',
                                fontWeight: 'bold'
                            },
                            {
                                value: '使用者投給的選項',
                                fontWeight: 'bold'
                            },
                            {
                                value: '投票時間',
                                fontWeight: 'bold'
                            }
                        ]
                        const data111111111111111111111 = [
                            HEADER_ROW,
                        ]
                        for (let i = 0; i < data.join_member.length; i++) {
                            let data_array = []
                            data_array.push({
                                type: String,
                                value: data.join_member[i].id
                            })
                            data_array.push({
                                type: String,
                                value: `${await interaction.guild.members.fetch(data.join_member[i].id) ? await interaction.guild.members.fetch(data.join_member[i].id).user.username + '#' + await interaction.guild.members.fetch(data.join_member[i].id).user.discriminator : '使用者已退出伺服器!'}`
                            })
                            data_array.push({
                                type: String,
                                value: data.join_member[i].choise
                            })
                            data_array.push({
                                type: String,
                                value: `${!isNaN(data.join_member[i].time) ? timeConverter(Number(data.join_member[i].time)) : data.join_member[i].time}`
                            })
                            data111111111111111111111.push(data_array)
                        }


                        const buffer = await writeXlsxFile(data111111111111111111111, {
                            buffer: true
                        })
                        const excel_file = new AttachmentBuilder(buffer, {
                            name: 'poll_info.xlsx'
                        })
                        interaction.editReply({
                            content: `<:sheets:1023972957330100324> | **以下是該投票的excel表格!**`,
                            files: [excel_file]
                        })
                    }

                    setTimeout(() => {
                        poll.findOne({
                            guild: interaction.channel.guild.id,
                            messageid: interaction.message.id,
                        }, async (err, data11111) => {
                            let choose_string_array = data11111.choose_data
                            let all_button = []
                            let buttons = []
                            let buttons1 = []
                            let buttons2 = []
                            let buttons3 = []
                            const see_result = new ButtonBuilder()
                                .setCustomId(`see_result`)
                                .setLabel('查看投票結果')
                                .setEmoji('<:analysis:1023965999357243432>')
                                .setStyle(ButtonStyle.Success)
                            for (let i = 0; i < (choose_string_array.length + 1); i++) {
                                if ((buttons.length > 4) && !(buttons1.length > 4)) {
                                    if (i === (choose_string_array.length)) {
                                        buttons1.push(see_result)
                                    } else {
                                        buttons1.push(
                                            new ButtonBuilder()
                                            .setCustomId(`poll_${choose_string_array[i]}`)
                                            .setLabel(choose_string_array[i])
                                            .setStyle(ButtonStyle.Secondary)
                                        )
                                    }
                                } else if (buttons1.length > 4 && !(buttons2.length > 4)) {
                                    if (i === (choose_string_array.length)) {
                                        buttons2.push(see_result)
                                    } else {
                                        buttons2.push(
                                            new ButtonBuilder()
                                            .setCustomId(`poll_${choose_string_array[i]}`)
                                            .setLabel(choose_string_array[i])
                                            .setStyle(ButtonStyle.Secondary)
                                        )
                                    }
                                } else if (buttons2.length > 4 && !(buttons3.length > 4)) {
                                    if (i === (choose_string_array.length)) {
                                        buttons3.push(see_result)
                                    } else {
                                        buttons3.push(
                                            new ButtonBuilder()
                                            .setCustomId(`poll_${choose_string_array[i]}`)
                                            .setLabel(choose_string_array[i])
                                            .setStyle(ButtonStyle.Secondary)
                                        )
                                    }
                                } else {
                                    if (i === (choose_string_array.length)) {
                                        buttons.push(see_result)
                                    } else {
                                        buttons.push(
                                            new ButtonBuilder()
                                            .setCustomId(`poll_${choose_string_array[i]}`)
                                            .setLabel(choose_string_array[i])
                                            .setStyle(ButtonStyle.Secondary)
                                        )
                                    }
                                }
                            }
                            all_shop = new ActionRowBuilder()
                                .addComponents(
                                    buttons
                                );
                            all_shop1 = new ActionRowBuilder()
                                .addComponents(
                                    buttons1
                                );
                            all_shop2 = new ActionRowBuilder()
                                .addComponents(
                                    buttons2
                                );
                            all_shop3 = new ActionRowBuilder()
                                .addComponents(
                                    buttons3
                                );
                            all_button.push(all_shop)
                            if (buttons1.length > 0) {
                                all_button.push(all_shop1)
                                if (buttons2.length > 0) {
                                    all_button.push(all_shop2)
                                    if (buttons3.length > 0) {
                                        all_button.push(all_shop3)
                                    }
                                }
                            }
                            all_button.push(
                                new ActionRowBuilder()
                                .addComponents(
                                    new SelectMenuBuilder()
                                    .setCustomId('poll_menu')
                                    .setPlaceholder('🔧投票發起人操作')
                                    .addOptions({
                                        label: `${data11111.can_see_result ? '隱藏' : '公開'}投票結果`,
                                        description: `讓所有成員都${data11111.can_see_result ? '無法' : '可以'}查看該投票結果`,
                                        value: 'poll_public_result',
                                        emoji: '<:publicrelation:1023972880385585212>'
                                    }, {
                                        label: '啟用多選投票',
                                        description: '讓所有成員都可以投票超過1個以上',
                                        value: 'poll_can_choose_many',
                                        emoji: '<:maybe:1023971826948391074>'
                                    }, {
                                        label: `${data11111.can_change_choose ? '無法' : '可以'}變更選項`,
                                        description: `讓所有成員都${data11111.can_change_choose ? '無法' : '可以'}更改投票選項`,
                                        value: 'poll_can_change_choose',
                                        emoji: '<:exchange:1023972882046525491>'
                                    }, {
                                        label: '改為匿名投票',
                                        description: '讓所有無法得知有誰參加抽獎',
                                        value: 'poll_anonymous',
                                        emoji: '<:unknown:1024241985583853598>'
                                    }, {
                                        label: `${data11111.end ? '重啟' : '終止'}投票`,
                                        description: `${data11111.end ? '讓投票可以繼續使用' : '該投票變為無法再變更選項或投票(可再次開啟)'}讓`,
                                        value: 'poll_end_poll',
                                        emoji: `${data11111.end ? '<:playbutton:1023972876921081947>' : '<:stop:1023972878678503434>'}`
                                    }, {
                                        label: '匯出為excel檔',
                                        description: '如果成員過多的話可以使用這個查看誰投票',
                                        value: 'poll_excel_result',
                                        emoji: '<:sheets:1023972957330100324>'
                                    }),
                                )
                            )
                            const userIds = new Set();
                            for (const member of (await interaction.guild.members.fetch()).values()) {
                                const user = await client.users.fetch(member.id);
                                if (!userIds.has(user.id) && !user.bot) {
                                    userIds.add(user.id);
                                }
                            }
                            let member_count111111 = []
                            data11111.join_member.forEach(element => {
                                member_count111111.push(element.id)
                            });
                            let member_count = getUnique(member_count111111)
                            let embed = new EmbedBuilder()
                                .setTitle(`<:poll:1023968837965709312> | 投票\n${data11111.question}`)
                                .setDescription(`<:vote:1023969411369025576> **總投票人數:\`${member_count.length}\` / \`${userIds.size}\`|參與率:\`${(member_count.length / userIds.size * 100).toFixed(2)}\`%**
                
<:YellowSmallDot:1023970607429328946> **每人可以投給\`${data11111.many_choose}\`個選項
<:YellowSmallDot:1023970607429328946> \`${data11111.can_change_choose ? '可以' : '無法'}\`改投其他選項
<:YellowSmallDot:1023970607429328946> \`${data11111.can_see_result ? '可以' : '無法'}\`看到投票結果
<:YellowSmallDot:1023970607429328946> \`${data11111.anonymous ? '匿名' : '實名'}\`投票**
                `)
                                .setColor('Random')
                            interaction.message.edit({
                                embeds: [embed],
                                components: all_button
                            })
                        })
                    }, 50);
                })
            }
        }
})