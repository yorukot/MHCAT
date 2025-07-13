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
const birthday_set = require('../../models/birthday_set.js')
const birthday = require('../../models/birthday.js')
const {errors_update, errors_edit} = require('../../functions/errors_edit')
module.exports = {
    name: '生日系統',
    description: '讓你的伺服器可以為生日的人慶生!',
    cooldown: 5,
    options: [{
        name: '祝福語設定',
        type: ApplicationCommandOptionType.Subcommand,
        description: '設定祝福語',
        options: [{
            name: '祝福語',
            type: ApplicationCommandOptionType.String,
            description: '設定祝福語，{user}代表tag這個使用者 {name}代表這個使用者的名稱 {age}代表使用者年紀',
            required: true,
        }, {
            name: '頻道',
            type: ApplicationCommandOptionType.Channel,
            description: '要發通知的頻道',
            required: true,
        }, {
            name: '是否可以自行設定生日',
            type: ApplicationCommandOptionType.Boolean,
            description: '使用者是否可以自己設定自己的生日日期跟通知時間',
            required: true,
        }, {
            name: '時區',
            type: ApplicationCommandOptionType.String,
            description: '設定屬於你伺服器的時區(台灣、香港、新加坡、馬來西亞、中國是UTC+8，日本是UTC+9) ',
            required: true,
            choices: [{
                name: 'UTC+0',
                value: '+00:00'
            }, {
                name: 'UTC+1',
                value: '+01:00'
            }, {
                name: 'UTC+2',
                value: '+02:00'
            }, {
                name: 'UTC+3',
                value: '+03:00'
            }, {
                name: 'UTC+4',
                value: '+04:00'
            }, {
                name: 'UTC+5',
                value: '+05:00'
            }, {
                name: 'UTC+6',
                value: '+06:00'
            }, {
                name: 'UTC+7',
                value: '+07:00'
            }, {
                name: 'UTC+8',
                value: '+08:00'
            }, {
                name: 'UTC+9',
                value: '+09:00'
            }, {
                name: 'UTC+10',
                value: '+10:00'
            }, {
                name: 'UTC+11',
                value: '+11:00'
            }, {
                name: 'UTC+12',
                value: '+12:00'
            }, {
                name: 'UTC+13',
                value: '+13:00'
            }, {
                name: 'UTC+14',
                value: '+14:00'
            }, {
                name: 'UTC+15',
                value: '+15:00'
            }, {
                name: 'UTC+16',
                value: '+16:00'
            }, {
                name: 'UTC+17',
                value: '+17:00'
            }, {
                name: 'UTC+18',
                value: '+18:00'
            }, {
                name: 'UTC+19',
                value: '+19:00'
            }, {
                name: 'UTC+20',
                value: '+20:00'
            }, {
                name: 'UTC+21',
                value: '+21:00'
            }, {
                name: 'UTC+22',
                value: '+22:00'
            }, {
                name: 'UTC+23',
                value: '+23:00'
            }],
        }, {
            name: '給予身分組',
            type: ApplicationCommandOptionType.Role,
            description: '當使用者那天生日時自動給予身分組，在當天結束後自動刪除',
            required: false,
        }, ]
    }, {
        name: '增加',
        type: ApplicationCommandOptionType.Subcommand,
        description: '新增使用者的生日資料',
        options: [{
            name: '生日月份',
            type: ApplicationCommandOptionType.Integer,
            description: '格式為mm ex: 1(1月出生) ex:12(12月出生)',
            required: true,
        }, {
            name: '生日日期',
            type: ApplicationCommandOptionType.Integer,
            description: '格式為dd ex: 1(1日出生) 31(31日出生)',
            required: true,
        }, {
            name: '使用者',
            type: ApplicationCommandOptionType.User,
            description: '要設定的使用者(需有管理員權限)',
            required: false,
        }, {
            name: '生日年份',
            type: ApplicationCommandOptionType.Integer,
            description: '格式為yyyy ex: 2023(2023年出生)',
            required: false,
        }]
    }, {
        name: '刪除',
        type: ApplicationCommandOptionType.Subcommand,
        description: '刪除某使用者的資料',
        options: [{
            name: '使用者',
            type: ApplicationCommandOptionType.User,
            description: '輸入你要刪除的使用者!',
            required: true,
        }]
    }, {
        name: '是否允許管理員設定',
        type: ApplicationCommandOptionType.Subcommand,
        description: '是否允許管理員設定你的生日 防止打擾到你(預設為true)',
        options: [{
            name: '是否',
            type: ApplicationCommandOptionType.Boolean,
            description: '是否允許!true為允許 false為不允許',
            required: true,
        }]
    }, {
        name: '生日列表',
        type: ApplicationCommandOptionType.Subcommand,
        description: '這個伺服器內的使用者生日列表',
    }, ],
    UserPerms: '訊息管理',
    docs: [
        "allcommands/生日系統/birthday_message_set",
        "allcommands/%E7%94%9F%E6%97%A5%E7%B3%BB%E7%B5%B1/birthday_date_add",
        "allcommands/%E7%94%9F%E6%97%A5%E7%B3%BB%E7%B5%B1/birthday_date_add",
        "allcommands/%E7%94%9F%E6%97%A5%E7%B3%BB%E7%B5%B1/allow_admin_set_birthday"
    ],
    //video: 'https://docsmhcat.yorukot.me/commands/statistics.html',
    emoji: `<:working:1048617967799242772>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply();
        try {
            if (interaction.options.getSubcommand() === "祝福語設定") {
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors_edit(interaction, `你需要有\`${perms}\`才能使用此指令`, 'allcommands/生日系統/birthday_message_set')
                let msgg = interaction.options.getString("祝福語")
                let UTC = interaction.options.getString("時區")
                let channel = interaction.options.getChannel("頻道")
                let role = interaction.options.getRole('給予身分組')
                let can_set_self_birthday_date = interaction.options.getBoolean("是否可以自行設定生日")
                birthday_set.findOne({
                    guild: interaction.channel.guild.id,
                }, async (err, data) => {
                    if (data) data.delete()
                    data = new birthday_set({
                        guild: interaction.guild.id,
                        msg: msgg,
                        utc: UTC,
                        channel: channel.id,
                        everyone_can_set_birthday_date: can_set_self_birthday_date,
                        role: role ? role.id : null
                    })
                    data.save()
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle('<:cake:1065654305983570041> 生日系統祝福語設定')
                            .setDescription('**你成功設定了祝福語!**\n<:confetti:1065654294071738399> **祝福語為:**\n' + `${msgg}` + `\n<:utc:1065654078417412168> **時區為:** \`UTC${UTC}\`\n**<:decisionmaking:1065935264352063559> 使用者是否可以自行設定生日日期:** \`${can_set_self_birthday_date}\`\n ${client.emoji.channel} **通知頻道: ${channel}**\n <:roleplaying:985945121264635964> 身分組: ${role}`)
                            .setColor("Green")
                        ]
                    })
                })
            } else if (interaction.options.getSubcommand() === "增加") {
                birthday_set.findOne({
                    guild: interaction.channel.guild.id,
                }, async (err, data) => {
                    if (!data) return errors_edit(interaction, '請先請管理員進行祝福語設定', 'allcommands/生日系統/birthday_date_add')
                    if (data) {
                        if (data.everyone_can_set_birthday_date || interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                            let user = interaction.options.getUser('使用者')
                            if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages) && user && interaction.user.id !== user.id) {
                                birthday.findOne({
                                    guild: interaction.channel.guild.id,
                                    user: user.id    || interaction.user.id
                                }, async (err, data) => {
                                    if (data ? !data.allow : false) return errors_edit(interaction, '該名使用者不允許管理員設定他的生日日期!', 'allcommands/生日系統/birthday_date_add')
                                    let birthday_year = interaction.options.getInteger("生日年份")
                                    if (birthday_year ? (Number(birthday_year) < 1900 || Number(birthday_year) > new Date().getFullYear()) : false) return errors_edit(interaction, '請輸入有效的年份!', 'allcommands/生日系統/birthday_date_add')
                                    let birthday_month = interaction.options.getInteger("生日月份")
                                    if (String(birthday_month).slice(0, 1) === "0") birthday_month = Number(String(birthday_month).slice(1, 2))
                                    if (Number(birthday_month) < 1 || Number(birthday_month) > 12) return errors_edit(interaction, '請輸入有效的月份!', 'allcommands/生日系統/birthday_date_add')
                                    let birthday_day = interaction.options.getInteger("生日日期")
                                    if (String(birthday_day).slice(0, 1) === "0") birthday_day = Number(String(birthday_day).slice(1, 2))
                                    if ([1, 3, 5, 7, 8, 10, 12].includes(birthday_month)) {
                                        if (Number(birthday_day) < 1 || Number(birthday_day) > 31) return errors_edit(interaction, '請輸入有效的日期!', 'allcommands/生日系統/birthday_date_add')
                                    } else if ([4, 6, 9, 11].includes(birthday_month)) {
                                        if (Number(birthday_day) < 1 || Number(birthday_day) > 30) return errors_edit(interaction, '請輸入有效的日期!', 'allcommands/生日系統/birthday_date_add')
                                    } else {
                                        if (Number(birthday_day) < 1 || Number(birthday_day) > 29) return errors_edit(interaction, '請輸入有效的日期!', 'allcommands/生日系統/birthday_date_add')
                                    }
                                    if (data) data.delete()
                                    let time = `${Math.round((Date.now() / 1000) + 300)}`;
                                    const hour_menu = new ActionRowBuilder()
                                        .addComponents(
                                            new SelectMenuBuilder()
                                            .setCustomId('hour_menu')
                                            .setPlaceholder('請選擇要在幾點發送(24hr制)')
                                            .addOptions({
                                                label: '1點',
                                                description: '凌晨1點',
                                                value: '1',
                                                emoji: '<:moon:1022055227194605599>'
                                            }, {
                                                label: '2點',
                                                description: '凌晨2點',
                                                value: '2',
                                                emoji: '<:moon:1022055227194605599>'
                                            }, {
                                                label: '3點',
                                                description: '凌晨3點',
                                                value: '3',
                                                emoji: '<:moon:1022055227194605599>'
                                            }, {
                                                label: '4點',
                                                description: '凌晨4點',
                                                value: '4',
                                                emoji: '<:moon:1022055227194605599>'
                                            }, {
                                                label: '5點',
                                                description: '早上5點',
                                                value: '5',
                                                emoji: '<:morning:1022055616203726888>'
                                            }, {
                                                label: '6點',
                                                description: '早上6點',
                                                value: '6',
                                                emoji: '<:morning:1022055616203726888>'
                                            }, {
                                                label: '7點',
                                                description: '早上7點',
                                                value: '7',
                                                emoji: '<:morning:1022055616203726888>'
                                            }, {
                                                label: '8點',
                                                description: '早上8點',
                                                value: '8',
                                                emoji: '<:morning:1022055616203726888>'
                                            }, {
                                                label: '9點',
                                                description: '早上9點',
                                                value: '9',
                                                emoji: '<:morning:1022055616203726888>'
                                            }, {
                                                label: '10點',
                                                description: '早上10點',
                                                value: '10',
                                                emoji: '<:morning:1022055616203726888>'
                                            }, {
                                                label: '11點',
                                                description: '中午11點',
                                                value: '11',
                                                emoji: '<:sun:1022055614458904596>'
                                            }, {
                                                label: '12點',
                                                description: '中午12點',
                                                value: '12',
                                                emoji: '<:sun:1022055614458904596>'
                                            }, {
                                                label: '13點',
                                                description: '中午1點',
                                                value: '13',
                                                emoji: '<:sun:1022055614458904596>'
                                            }, {
                                                label: '14點',
                                                description: '下午2點',
                                                value: '14',
                                                emoji: '<:sun1:1022055612294647839>'
                                            }, {
                                                label: '15點',
                                                description: '下午3點',
                                                value: '15',
                                                emoji: '<:sun1:1022055612294647839>'
                                            }, {
                                                label: '16點',
                                                description: '下午4點',
                                                value: '16',
                                                emoji: '<:sun1:1022055612294647839>'
                                            }, {
                                                label: '17點',
                                                description: '下午5點',
                                                value: '17',
                                                emoji: '<:sun1:1022055612294647839>'
                                            }, {
                                                label: '18點',
                                                description: '晚上6點',
                                                value: '18',
                                                emoji: '<:forest:1022055611044732998>'
                                            }, {
                                                label: '19點',
                                                description: '晚上7點',
                                                value: '19',
                                                emoji: '<:forest:1022055611044732998>'
                                            }, {
                                                label: '20點',
                                                description: '晚上8點',
                                                value: '20',
                                                emoji: '<:forest:1022055611044732998>'
                                            }, {
                                                label: '21點',
                                                description: '晚上9點',
                                                value: '21',
                                                emoji: '<:forest:1022055611044732998>'
                                            }, {
                                                label: '22點',
                                                description: '晚上10點',
                                                value: '22',
                                                emoji: '<:forest:1022055611044732998>'
                                            }, {
                                                label: '23點',
                                                description: '晚上11點',
                                                value: '23',
                                                emoji: '<:forest:1022055611044732998>'
                                            }, {
                                                label: '24點(0點)',
                                                description: '凌晨12點(0點)',
                                                value: '0',
                                                emoji: '<:moon:1022055227194605599>'
                                            }),
                                        );
                                    const hour_embed = new EmbedBuilder()
                                        .setTitle('<:cake:1065654305983570041> 生日系統祝福語設定')
                                        .setDescription('**<:24hours:1022059604747747379> 請選取你的生日通知要在幾點發送**\n**<a:warn:1000814885506129990> 你必須在<t:' + time + ':R>選取完畢(超過時間將會無法選取)**')
                                        .setColor('Random')
                                        .setFooter({
                                            text: '有問題都可以前往支援伺服器詢問',
                                            iconURL: interaction.user.displayAvatarURL({
                                                dynamic: true
                                            })
                                        })
                                    let msgg = await interaction.editReply({
                                        embeds: [hour_embed],
                                        components: [hour_menu]
                                    });
                                    const filter = i => {
                                        return i.user.id === interaction.user.id;
                                    };
                                    const collector = msgg.createMessageComponentCollector({
                                        componentType: 3,
                                        time: 5 * 60 * 1000,
                                        filter
                                    });
                                    let hour_time = 0
                                    let min_time = 0
                                    collector.on("collect", (interaction01) => {
                                        if (interaction01.customId === 'hour_menu') {
                                            hour_time = interaction01.values
                                            const min_menu = new ActionRowBuilder()
                                                .addComponents(
                                                    new SelectMenuBuilder()
                                                    .setCustomId('min_menu')
                                                    .setPlaceholder('請選擇要在幾分發送')
                                                    .addOptions({
                                                        label: '0分',
                                                        description: '每個你選取的小時的0分',
                                                        value: '0',
                                                        emoji: '<:time:1022057997515640852>'
                                                    }, {
                                                        label: '5分',
                                                        description: '每個你選取的小時的5分',
                                                        value: '5',
                                                        emoji: '<:time:1022057997515640852>'
                                                    }, {
                                                        label: '10分',
                                                        description: '每個你選取的小時的10分',
                                                        value: '10',
                                                        emoji: '<:time:1022057997515640852>'
                                                    }, {
                                                        label: '15分',
                                                        description: '每個你選取的小時的15分',
                                                        value: '15',
                                                        emoji: '<:15minutes:1022058003752570933>'
                                                    }, {
                                                        label: '20分',
                                                        description: '每個你選取的小時的20分',
                                                        value: '20',
                                                        emoji: '<:15minutes:1022058003752570933>'
                                                    }, {
                                                        label: '25分',
                                                        description: '每個你選取的小時的25分',
                                                        value: '25',
                                                        emoji: '<:15minutes:1022058003752570933>'
                                                    }, {
                                                        label: '30分',
                                                        description: '每個你選取的小時的30分',
                                                        value: '30',
                                                        emoji: '<:30minutes:1022058001722527744>'
                                                    }, {
                                                        label: '35分',
                                                        description: '每個你選取的小時的35分',
                                                        value: '35',
                                                        emoji: '<:30minutes:1022058001722527744>'
                                                    }, {
                                                        label: '40分',
                                                        description: '每個你選取的小時的40分',
                                                        value: '40',
                                                        emoji: '<:30minutes:1022058001722527744>'
                                                    }, {
                                                        label: '45分',
                                                        description: '每個你選取的小時的45分',
                                                        value: '45',
                                                        emoji: '<:45minutes:1022057999881228288>'
                                                    }, {
                                                        label: '50分',
                                                        description: '每個你選取的小時的50分',
                                                        value: '50',
                                                        emoji: '<:45minutes:1022057999881228288>'
                                                    }, {
                                                        label: '55分',
                                                        description: '每個你選取的小時的55分',
                                                        value: '55',
                                                        emoji: '<:45minutes:1022057999881228288>'
                                                    }),
                                                );
                                            const min_embed = new EmbedBuilder()
                                                .setTitle('<:cake:1065654305983570041> 生日系統祝福語設定')
                                                .setDescription('<:60minutes:1022059603153924156> **請選取你的生日通知要在幾分發送**\n**<a:warn:1000814885506129990> 你必須在<t:' + time + ':R>選取完畢(超過時間將會無法選取)**')
                                                .setColor('Random')
                                                .setFooter({
                                                    text: '有問題都可以前往支援伺服器詢問',
                                                    iconURL: interaction.user.displayAvatarURL({
                                                        dynamic: true
                                                    })
                                                })
                                            interaction01.update({
                                                embeds: [min_embed],
                                                components: [min_menu]
                                            });
                                        } else if (interaction01.customId === 'min_menu') {
                                            min_time = interaction01.values
                                            data = new birthday({
                                                guild: interaction.guild.id,
                                                user: user.id,
                                                birthday_year: birthday_year,
                                                birthday_month: birthday_month,
                                                birthday_day: birthday_day,
                                                send_msg_hour: Number(hour_time),
                                                send_msg_min: Number(min_time),
                                                allow: true
                                            })
                                            data.save()
                                            const min_embed = new EmbedBuilder()
                                                .setTitle('<:cake:1065654305983570041> 生日系統祝福語設定')
                                                .setDescription(`<a:green_tick:994529015652163614> 恭喜你設定完成了!\n**<a:arrow_pink:996242460294512690> 以下是<@${user.id}>的生日日期:**\`${birthday_year}/${birthday_month}/${birthday_day}\`\n**通知時間為:**\`${hour_time}:${min_time}\``)
                                                .setColor('Random')
                                            interaction01.update({
                                                embeds: [min_embed],
                                                components: []
                                            });
                                        }

                                    })
                                })
                            } else {
                                birthday.findOne({
                                    guild: interaction.channel.guild.id,
                                    user: interaction.user.id
                                }, async (err, data) => {
                                    let birthday_year = interaction.options.getInteger("生日年份")
                                    let user = interaction.options.getUser('使用者') ? interaction.options.getUser('使用者') : interaction.user
                                    if (user.id !== interaction.user.id) return errors_edit(interaction, '你只擁有設定自己生日日期的權限!', 'allcommands/生日系統/birthday_date_add')
                                    if (birthday_year ? (Number(birthday_year) < 1900 || Number(birthday_year) > new Date().getFullYear()) : false) return errors_edit(interaction, '請輸入有效的年份!', 'allcommands/生日系統/birthday_date_add')
                                    let birthday_month = interaction.options.getInteger("生日月份")
                                    if (String(birthday_month).slice(0, 1) === "0") birthday_month = Number(String(birthday_month).slice(1, 2))
                                    if (Number(birthday_month) < 1 || Number(birthday_month) > 12) return errors_edit(interaction, '請輸入有效的月份!', 'allcommands/生日系統/birthday_date_add')
                                    let birthday_day = interaction.options.getInteger("生日日期")
                                    if (String(birthday_day).slice(0, 1) === "0") birthday_day = Number(String(birthday_day).slice(1, 2))
                                    if ([1, 3, 5, 7, 8, 10, 12].includes(birthday_month)) {
                                        if (Number(birthday_day) < 1 || Number(birthday_day) > 31) return errors_edit(interaction, '請輸入有效的日期!', 'allcommands/生日系統/birthday_date_add')
                                    } else if ([4, 6, 9, 11].includes(birthday_month)) {
                                        if (Number(birthday_day) < 1 || Number(birthday_day) > 30) return errors_edit(interaction, '請輸入有效的日期!', 'allcommands/生日系統/birthday_date_add')
                                    } else {
                                        if (Number(birthday_day) < 1 || Number(birthday_day) > 29) return errors_edit(interaction, '請輸入有效的日期!', 'allcommands/生日系統/birthday_date_add')
                                    }
                                    if (data) data.delete()
                                    let time = `${Math.round((Date.now() / 1000) + 300)}`;
                                    const hour_menu = new ActionRowBuilder()
                                        .addComponents(
                                            new SelectMenuBuilder()
                                            .setCustomId('hour_menu')
                                            .setPlaceholder('請選擇要在幾點發送(24hr制)')
                                            .addOptions({
                                                label: '1點',
                                                description: '凌晨1點',
                                                value: '1',
                                                emoji: '<:moon:1022055227194605599>'
                                            }, {
                                                label: '2點',
                                                description: '凌晨2點',
                                                value: '2',
                                                emoji: '<:moon:1022055227194605599>'
                                            }, {
                                                label: '3點',
                                                description: '凌晨3點',
                                                value: '3',
                                                emoji: '<:moon:1022055227194605599>'
                                            }, {
                                                label: '4點',
                                                description: '凌晨4點',
                                                value: '4',
                                                emoji: '<:moon:1022055227194605599>'
                                            }, {
                                                label: '5點',
                                                description: '早上5點',
                                                value: '5',
                                                emoji: '<:morning:1022055616203726888>'
                                            }, {
                                                label: '6點',
                                                description: '早上6點',
                                                value: '6',
                                                emoji: '<:morning:1022055616203726888>'
                                            }, {
                                                label: '7點',
                                                description: '早上7點',
                                                value: '7',
                                                emoji: '<:morning:1022055616203726888>'
                                            }, {
                                                label: '8點',
                                                description: '早上8點',
                                                value: '8',
                                                emoji: '<:morning:1022055616203726888>'
                                            }, {
                                                label: '9點',
                                                description: '早上9點',
                                                value: '9',
                                                emoji: '<:morning:1022055616203726888>'
                                            }, {
                                                label: '10點',
                                                description: '早上10點',
                                                value: '10',
                                                emoji: '<:morning:1022055616203726888>'
                                            }, {
                                                label: '11點',
                                                description: '中午11點',
                                                value: '11',
                                                emoji: '<:sun:1022055614458904596>'
                                            }, {
                                                label: '12點',
                                                description: '中午12點',
                                                value: '12',
                                                emoji: '<:sun:1022055614458904596>'
                                            }, {
                                                label: '13點',
                                                description: '中午1點',
                                                value: '13',
                                                emoji: '<:sun:1022055614458904596>'
                                            }, {
                                                label: '14點',
                                                description: '下午2點',
                                                value: '14',
                                                emoji: '<:sun1:1022055612294647839>'
                                            }, {
                                                label: '15點',
                                                description: '下午3點',
                                                value: '15',
                                                emoji: '<:sun1:1022055612294647839>'
                                            }, {
                                                label: '16點',
                                                description: '下午4點',
                                                value: '16',
                                                emoji: '<:sun1:1022055612294647839>'
                                            }, {
                                                label: '17點',
                                                description: '下午5點',
                                                value: '17',
                                                emoji: '<:sun1:1022055612294647839>'
                                            }, {
                                                label: '18點',
                                                description: '晚上6點',
                                                value: '18',
                                                emoji: '<:forest:1022055611044732998>'
                                            }, {
                                                label: '19點',
                                                description: '晚上7點',
                                                value: '19',
                                                emoji: '<:forest:1022055611044732998>'
                                            }, {
                                                label: '20點',
                                                description: '晚上8點',
                                                value: '20',
                                                emoji: '<:forest:1022055611044732998>'
                                            }, {
                                                label: '21點',
                                                description: '晚上9點',
                                                value: '21',
                                                emoji: '<:forest:1022055611044732998>'
                                            }, {
                                                label: '22點',
                                                description: '晚上10點',
                                                value: '22',
                                                emoji: '<:forest:1022055611044732998>'
                                            }, {
                                                label: '23點',
                                                description: '晚上11點',
                                                value: '23',
                                                emoji: '<:forest:1022055611044732998>'
                                            }, {
                                                label: '24點(0點)',
                                                description: '凌晨12點(0點)',
                                                value: '0',
                                                emoji: '<:moon:1022055227194605599>'
                                            }),
                                        );
                                    const hour_embed = new EmbedBuilder()
                                        .setTitle('<:cake:1065654305983570041> 生日系統祝福語設定')
                                        .setDescription('**<:24hours:1022059604747747379> 請選取你的生日通知要在幾點發送**\n**<a:warn:1000814885506129990> 你必須在<t:' + time + ':R>選取完畢(超過時間將會無法選取)**')
                                        .setColor('Random')
                                        .setFooter({
                                            text: '有問題都可以前往支援伺服器詢問',
                                            iconURL: interaction.user.displayAvatarURL({
                                                dynamic: true
                                            })
                                        })
                                    let msgg = await interaction.editReply({
                                        embeds: [hour_embed],
                                        components: [hour_menu]
                                    });
                                    const filter = i => {
                                        return i.user.id === interaction.user.id;
                                    };
                                    const collector = msgg.createMessageComponentCollector({
                                        componentType: 3,
                                        time: 5 * 60 * 1000,
                                        filter
                                    });
                                    let hour_time = 0
                                    let min_time = 0
                                    collector.on("collect", (interaction01) => {
                                        if (interaction01.customId === 'hour_menu') {
                                            hour_time = interaction01.values
                                            const min_menu = new ActionRowBuilder()
                                                .addComponents(
                                                    new SelectMenuBuilder()
                                                    .setCustomId('min_menu')
                                                    .setPlaceholder('請選擇要在幾分發送')
                                                    .addOptions({
                                                        label: '0分',
                                                        description: '每個你選取的小時的0分',
                                                        value: '0',
                                                        emoji: '<:time:1022057997515640852>'
                                                    }, {
                                                        label: '5分',
                                                        description: '每個你選取的小時的5分',
                                                        value: '5',
                                                        emoji: '<:time:1022057997515640852>'
                                                    }, {
                                                        label: '10分',
                                                        description: '每個你選取的小時的10分',
                                                        value: '10',
                                                        emoji: '<:time:1022057997515640852>'
                                                    }, {
                                                        label: '15分',
                                                        description: '每個你選取的小時的15分',
                                                        value: '15',
                                                        emoji: '<:15minutes:1022058003752570933>'
                                                    }, {
                                                        label: '20分',
                                                        description: '每個你選取的小時的20分',
                                                        value: '20',
                                                        emoji: '<:15minutes:1022058003752570933>'
                                                    }, {
                                                        label: '25分',
                                                        description: '每個你選取的小時的25分',
                                                        value: '25',
                                                        emoji: '<:15minutes:1022058003752570933>'
                                                    }, {
                                                        label: '30分',
                                                        description: '每個你選取的小時的30分',
                                                        value: '30',
                                                        emoji: '<:30minutes:1022058001722527744>'
                                                    }, {
                                                        label: '35分',
                                                        description: '每個你選取的小時的35分',
                                                        value: '35',
                                                        emoji: '<:30minutes:1022058001722527744>'
                                                    }, {
                                                        label: '40分',
                                                        description: '每個你選取的小時的40分',
                                                        value: '40',
                                                        emoji: '<:30minutes:1022058001722527744>'
                                                    }, {
                                                        label: '45分',
                                                        description: '每個你選取的小時的45分',
                                                        value: '45',
                                                        emoji: '<:45minutes:1022057999881228288>'
                                                    }, {
                                                        label: '50分',
                                                        description: '每個你選取的小時的50分',
                                                        value: '50',
                                                        emoji: '<:45minutes:1022057999881228288>'
                                                    }, {
                                                        label: '55分',
                                                        description: '每個你選取的小時的55分',
                                                        value: '55',
                                                        emoji: '<:45minutes:1022057999881228288>'
                                                    }),
                                                );
                                            const min_embed = new EmbedBuilder()
                                                .setTitle('<:cake:1065654305983570041> 生日系統祝福語設定')
                                                .setDescription('<:60minutes:1022059603153924156> **請選取你的生日通知要在幾分發送**\n**<a:warn:1000814885506129990> 你必須在<t:' + time + ':R>選取完畢(超過時間將會無法選取)**')
                                                .setColor('Random')
                                                .setFooter({
                                                    text: '有問題都可以前往支援伺服器詢問',
                                                    iconURL: interaction.user.displayAvatarURL({
                                                        dynamic: true
                                                    })
                                                })
                                            interaction01.update({
                                                embeds: [min_embed],
                                                components: [min_menu]
                                            });
                                        } else if (interaction01.customId === 'min_menu') {
                                            min_time = interaction01.values
                                            data = new birthday({
                                                guild: interaction.guild.id,
                                                user: user.id,
                                                birthday_year: birthday_year,
                                                birthday_month: birthday_month,
                                                birthday_day: birthday_day,
                                                send_msg_hour: Number(hour_time),
                                                send_msg_min: Number(min_time),
                                                allow: true
                                            })
                                            data.save()
                                            const min_embed = new EmbedBuilder()
                                                .setTitle('<:cake:1065654305983570041> 生日系統祝福語設定')
                                                .setDescription(`<a:green_tick:994529015652163614> 恭喜你設定完成了!\n**<a:arrow_pink:996242460294512690> 以下是<@${user.id}>的生日日期:**\`${birthday_year}/${birthday_month}/${birthday_day}\`\n**通知時間為:**\`${hour_time}:${min_time}\``)
                                                .setColor('Random')
                                            interaction01.update({
                                                embeds: [min_embed],
                                                components: []
                                            });
                                        }

                                    })
                                })
                            }
                        } else if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
                            return errors_edit(interaction, `你需要有\`${perms}\`才能使用此指令`, 'allcommands/生日系統/birthday_date_add')
                        }
                    }
                })
            } else if (interaction.options.getSubcommand() === "刪除") {
                let user = interaction.options.getUser('使用者')
                if (user !== interaction.id && !interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors_edit(interaction, `你需要有\`${perms}\`才能使用此指令`, 'allcommands/生日系統/birthday_date_add')
                birthday.findOne({
                    guild: interaction.channel.guild.id,
                    user: user.id
                }, async (err, data) => {
                    if (!data) return errors_edit(interaction, '沒有這位使用者的資料!', 'allcommands/生日系統/birthday_date_add')
                    data.delete()
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`${client.emoji.delete} 刪除生日日期資料`)
                            .setDescription(`${client.emoji.done} **你成功刪除了<@${user.id}>的資料!**`)
                            .setColor('Green')
                        ]
                    })
                })
            } else if (interaction.options.getSubcommand() === "是否允許管理員設定") {
                let yesorno = interaction.options.getBoolean('是否')
                birthday.findOne({
                    guild: interaction.channel.guild.id,
                    user: interaction.user.id
                }, async (err, data) => {
                    if (data) data.delete()
                    if (data) {
                        data = new birthday({
                            guild: interaction.guild.id,
                            user: data.user,
                            birthday_year: data.birthday_year,
                            birthday_month: data.birthday_month,
                            birthday_day: data.birthday_day,
                            send_msg_hour: data.send_msg_hour,
                            send_msg_min: data.send_msg_min,
                            allow: yesorno
                        })
                    } else {
                        data = new birthday({
                            guild: interaction.guild.id,
                            user: interaction.user.id,
                            birthday_year: null,
                            birthday_month: null,
                            birthday_day: null,
                            send_msg_hour: null,
                            send_msg_min: null,
                            allow: yesorno
                        })
                    }
                    interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`${client.emoji.done} 成功變更資料`)
                            .setDescription(`${client.emoji.done} **你成功將是否允許管理員設定生日資料設為**\`${yesorno}\`!`)
                            .setFooter({
                                text: "本人還是可以設定喔!"
                            })
                            .setColor('Green')
                        ]
                    })
                })
            } else if (interaction.options.getSubcommand() === "生日列表") {
                birthday.find({
                    guild: interaction.guild.id,
                }, async (err, data) => {
                    if (data.length === 0) return errors_edit(interaction, '還沒有任何人有進行生日設置喔!', 'allcommands/生日系統/birthday_date_add')
                    if (data) {
                        const e = data.map(
                            (w, i) => `${interaction.guild.members.cache.get(w.user) ? interaction.guild.members.cache.get(w.user).user.username + '#' + interaction.guild.members.cache.get(w.user).user.discriminator : '找不到使用者!'}(${w.user})  | 生日日期(YYYY/MM/DD):${w.birthday_year}/${w.birthday_month}/${w.birthday_day}`
                        )
                        const a = data.map(
                            (w, i) => `<@${w.user}>  | 生日日期(YYYY/MM/DD):${w.birthday_year}/${w.birthday_month}/${w.birthday_day}`
                        )
                        let atc = new AttachmentBuilder(Buffer.from(`${e.join(`\n`)}`), {
                            name: 'discord.txt'
                        });
                        const embed = new EmbedBuilder()
                            .setTitle(`🎂 生日列表`)
                            .setDescription(`<:list:992002476360343602>**目前共有**\`${e.length}\`**人的生日數據**\n\n${a.length < 100 ? '┃ ' + '' + a.join('\n') + '┃' : "**由於人數過多，無法顯示所有成員名稱!\n請使用`.txt`檔案觀看**"}`)
                            .setColor("Random")

                        interaction.editReply({
                            embeds: [embed],
                            files: [atc]
                        })
                    }
                })
            }
        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}