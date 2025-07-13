const btn = require("../models/btn.js")
const leave_message = require('../models/leave_message.js')
const {
    InteractionType,
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
const guild = require('../models/guild.js');
const join_message = require("../models/join_message.js")
const verification = require('../models/verification.js')
const cron_set = require('../models/cron_set.js');
const moment = require('moment')
const lock_channel = require("../models/lock_channel.js")
const {
    validateHTMLColorName,
    validateHTMLColor
} = require("validate-color");

function validateColor(color) {
    if (validateHTMLColorName(color) || validateHTMLColor(color)) {
        return true;
    } else {
        return false;
    }
}
const client = require('../index');
client.on('interactionCreate', async (interaction) => {
    function errors(content) {
        const embed = new EmbedBuilder().setTitle(`${content}`).setColor("Red");

        interaction.editReply({
            embeds: [embed],
            ephemeral: true
        })
    }

    function greate(content) {
        const embed = new EmbedBuilder().setTitle(`${client.emoji.done} | ${content}`).setColor("Green");
        interaction.editReply({
            embeds: [embed],
            ephemeral: true
        })
    }
    if (!(interaction.type === InteractionType.ModalSubmit)) return;
    const text = interaction.fields.components[0].components[0].customId
    const all = interaction.fields.components[0].components[0].value
    if (text.includes('anser')) {
        await interaction.deferReply();
        lock_channel.findOne({
            guild: interaction.guild.id,
            channel_id: interaction.customId.replace('anser', '')
        }, async (err, data) => {
            if (!data) errors('很抱歉，該包廂可能已被刪除!')
            const anser = interaction.fields.getTextInputValue("anser");
            if (anser === data.lock_anser) {
                if (!data) return interaction.editReply({
                    emebds: [
                        new EmbedBuilder()
                        .setTitle(`<:unlock:1017087850556174367> | 您成功輸入正確密碼\n可以重新加入語音頻道囉!`)
                        .setColor(client.color.greate)
                    ],
                    components: [aaaaaaaaaaa]
                })
                data.ok_people.push(interaction.user.id)
                data.save()
                let aaaaaaaaaaa = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setLabel("點我前往該語音頻道!")
                        .setEmoji("<a:arrow_pink:996242460294512690>")
                        .setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.customId.replace('anser', '')}`)
                        .setStyle(ButtonStyle.Link),
                    );
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`<:unlock:1017087850556174367> | 您成功輸入正確密碼\n可以重新加入語音頻道囉!`)
                        .setColor(client.color.greate)
                    ],
                    components: [aaaaaaaaaaa]
                })
            } else {
                let aaaaaaaaaaa = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setLabel("點我前往該語音頻道!")
                        .setEmoji("<a:arrow_pink:996242460294512690>")
                        .setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.customId.replace('anser', '')}`)
                        .setStyle(ButtonStyle.Link),
                    );
                interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                        .setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | 你的密碼輸入錯誤!請重新加入語音頻道後在試一次!`)
                        .setColor(client.color.error)
                    ],
                    components: [aaaaaaaaaaa]
                })
            }
        })
    } else if (text.includes("cron_set")) {
        await interaction.deferReply();
                function cron_set_error(content) {
            const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red").setDescription(`<a:arrow_pink:996242460294512690> [點我前往教學網址](https://youtu.be/D43zPrZU5Fw)`);
            interaction.editReply({
                embeds: [embed]
            })
        }
        const corn = interaction.fields.getTextInputValue("cron_setcron");
        const message = interaction.fields.getTextInputValue("cron_setmsg");
        const color = interaction.fields.getTextInputValue("cron_setcolor");
        const title = interaction.fields.getTextInputValue("cron_settitle");
        const content = interaction.fields.getTextInputValue("cron_setcontent");
        const id = interaction.customId
        const cron = require('cron-validator');
        if ((color && !validateColor(color) && color !== "Random")) return cron_set_error('你傳送的並不是顏色(色碼)')
        if (!message && !content && !title) return cron_set_error("你都沒輸入你要發送甚麼，我要怎麼發送啦!")
        if (cron.isValidCron(corn, {
                allowSevenAsSunday: true
            })) {
            var parser = require('cron-parser');
            var interval = parser.parseExpression(corn);
            if (-(interval.next().toDate() - interval.next().toDate()) < 900000) return cron_set_error('傳送訊息的間隔必須大於15分鐘!')
            cron_set.findOne({
                guild: interaction.guild.id,
                id: id
            }, async (err, data) => {
                if (!data) {
                    return cron_set_error("很抱歉，出現了未知的錯誤，請重試!")
                } else {
                    const exampleEmbed = content || title ? {
                        content: message ? message : null,
                        embeds: [new EmbedBuilder()
                            .setTitle(title ? title : null)
                            .setDescription(content ? content : null)
                            .setColor(color ? color : null)
                        ]
                    } : {
                        content: message
                    }
                    data.collection.updateOne(({
                        guild: interaction.channel.guild.id,
                        id: id
                    }), {
                        $set: {
                            message: exampleEmbed
                        }
                    })
                    data.collection.updateOne(({
                        guild: interaction.channel.guild.id,
                        id: id
                    }), {
                        $set: {
                            cron: corn
                        }
                    })
                    interaction.editReply({
                        content: `:white_check_mark:**以下是該自動通知id:**\`${id}\`\n使用\`/自動通知刪除 id:${id}\`進行刪除\n~~我只是個分隔線，下面是你的訊息預覽~~`
                    })
                    interaction.channel.send(exampleEmbed)
                    var CronJob = require('cron').CronJob;
                    const guild = interaction.channel.guild
                    if (!guild) {
                        data.delete();
                        return
                    }
                    const channel = guild.channels.cache.get(data.channel)
                    if (!channel) {
                        data.delete();
                        return
                    }
                    var job = new CronJob(
                        corn,
                        function () {
                            cron_set.findOne({
                                guild: guild.id,
                                id: id
                            }, async (err, data) => {
                                if (!data) {
                                    return
                                } else {
                                    channel.send(exampleEmbed)
                                }
                            })
                        },
                        null,
                        true,
                        'asia/taipei'
                    );
                }
            })
        } else {
            cron_set.findOne({
                guild: interaction.guild.id,
                id: id
            }, async (err, data) => {
                if (!data) {
                    return cron_set_error("很抱歉，出現了未知的錯誤，請重試!")
                } else {
                    const week_menu = new ActionRowBuilder()
                        .addComponents(
                            new SelectMenuBuilder()
                            .setMaxValues(7)
                            .setMinValues(1)
                            .setCustomId('week_menu')
                            .setPlaceholder('請選擇要在星期幾發送(可複選)')
                            .addOptions({
                                label: '禮拜一',
                                description: '禮拜一執行',
                                value: '1',
                                emoji: '<:monday:1022040759614050314>'
                            }, {
                                label: '禮拜二',
                                description: '禮拜二執行',
                                value: '2',
                                emoji: '<:tuesday:1022040763044986931>'
                            }, {
                                label: '禮拜三',
                                description: '禮拜三執行',
                                value: '3',
                                emoji: '<:wednesday:1022040757764378686>'
                            }, {
                                label: '禮拜四',
                                description: '禮拜四執行',
                                value: '4',
                                emoji: '<:thursday:1022040755834990695>'
                            }, {
                                label: '禮拜五',
                                description: '禮拜五執行',
                                value: '5',
                                emoji: '<:friday:1022040752722825237>'
                            }, {
                                label: '禮拜六',
                                description: '禮拜六執行',
                                value: '6',
                                emoji: '<:saturday:1022040761165955134>'
                            }, {
                                label: '禮拜日',
                                description: '禮拜日執行',
                                value: '0',
                                emoji: '<:sunday:1022040754643812352>'
                            }),
                        );
                    let time = `${Math.round((Date.now() / 1000) + 300)}`;
                    const week_embed = new EmbedBuilder()
                        .setTitle('<:dailytasks:1022041880394989669> 設定corn')
                        .setDescription('**<:7days:1022059380725784626> 請選取你的定時要在星期幾執行__(可複選)__**\n**<a:warn:1000814885506129990> 你必須在<t:' + time + ':R>選取完畢(超過時間將會無法選取)**')
                        .setFooter({
                            text: '有問題都可以前往支援伺服器詢問',
                            iconURL: interaction.user.displayAvatarURL({
                                dynamic: true
                            })
                        })
                        .setColor('Random')
                    let msgg = await interaction.followUp({
                        embeds: [week_embed],
                        components: [week_menu]
                    });
                    const filter = i => {
                        return i.user.id === interaction.user.id;
                    };
                    const collector = msgg.createMessageComponentCollector({
                        componentType: 3,
                        time: 5 * 60 * 1000,
                        filter
                    });
                    let week_time = ''
                    let hour_time = ''
                    let min_time = ''
                    collector.on("collect", (interaction01) => {
                        if (interaction01.customId === 'week_menu') {
                            week_time = interaction01.values.includes('1') && interaction01.values.includes('2') && interaction01.values.includes('3') ? '1-3' : interaction01.values.join(',')
                            week_time = interaction01.values.includes('1') && interaction01.values.includes('2') && interaction01.values.includes('3') && interaction01.values.includes('4') ? '1-4' : interaction01.values.join(',')
                            week_time = interaction01.values.includes('1') && interaction01.values.includes('2') && interaction01.values.includes('3') && interaction01.values.includes('4') && interaction01.values.includes('5') ? '1-5' : interaction01.values.join(',')
                            week_time = interaction01.values.includes('1') && interaction01.values.includes('2') && interaction01.values.includes('3') && interaction01.values.includes('4') && interaction01.values.includes('5') && interaction01.values.includes('6') ? '1-6' : interaction01.values.join(',')
                            week_time = interaction01.values.includes('1') && interaction01.values.includes('2') && interaction01.values.includes('3') && interaction01.values.includes('4') && interaction01.values.includes('5') && interaction01.values.includes('6') && interaction01.values.includes('0') ? '*' : interaction01.values.join(',')
                            const hour_menu = new ActionRowBuilder()
                                .addComponents(
                                    new SelectMenuBuilder()
                                    .setMaxValues(24)
                                    .setMinValues(1)
                                    .setCustomId('hour_menu')
                                    .setPlaceholder('請選擇要在幾點發送(可複選)24hr制')
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
                                .setTitle('<:dailytasks:1022041880394989669> 設定corn')
                                .setDescription('**<:24hours:1022059604747747379> 請選取你的定時要在幾點執行__(可複選)__**\n**<a:warn:1000814885506129990> 你必須在<t:' + time + ':R>選取完畢(超過時間將會無法選取)**')
                                .setColor('Random')
                                .setFooter({
                                    text: '有問題都可以前往支援伺服器詢問',
                                    iconURL: interaction.user.displayAvatarURL({
                                        dynamic: true
                                    })
                                })
                            interaction01.update({
                                embeds: [hour_embed],
                                components: [hour_menu]
                            });
                        } else if (interaction01.customId === 'hour_menu') {
                            hour_time = interaction01.values.join(',')
                            const min_menu = new ActionRowBuilder()
                                .addComponents(
                                    new SelectMenuBuilder()
                                    .setMaxValues(6)
                                    .setMinValues(1)
                                    .setCustomId('min_menu')
                                    .setPlaceholder('請選擇要在幾分發送(可複選)24hr制')
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
                                .setTitle('<:dailytasks:1022041880394989669> 設定corn')
                                .setDescription('<:60minutes:1022059603153924156> **請選取你的定時要在幾分執行__(可複選)__**\n**<a:warn:1000814885506129990> 你必須在<t:' + time + ':R>選取完畢(超過時間將會無法選取)**')
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
                            min_time = interaction01.values.join(',')
                            const min_embed = new EmbedBuilder()
                                .setTitle('<:dailytasks:1022041880394989669> 設定corn')
                                .setDescription(`<a:green_tick:994529015652163614> 恭喜你設定完成了!\n**以下是該自動通知id:**\`${id}\`\n使用\`/自動通知刪除 id:${id}\`進行刪除\n~~我只是個分隔線，下面是你的訊息預覽~~`)
                                .setColor('Random')
                            interaction01.update({
                                embeds: [min_embed],
                                components: []
                            });
                            const exampleEmbed = content || title ? {
                                content: message ? message : null,
                                embeds: [new EmbedBuilder()
                                    .setTitle(title ? title : null)
                                    .setDescription(content ? content : null)
                                    .setColor(color ? color : null)
                                ]
                            } : {
                                content: message
                            }
                            data.collection.updateOne(({
                                guild: interaction.guild.id,
                                id: id
                            }), {
                                $set: {
                                    message: exampleEmbed
                                }
                            })
                            data.collection.updateOne(({
                                guild: interaction.guild.id,
                                id: id
                            }), {
                                $set: {
                                    cron: `${min_time} ${hour_time} * * ${week_time}`
                                }
                            })
                            interaction.channel.send(exampleEmbed)
                            var CronJob = require('cron').CronJob;
                            const guild = interaction.channel.guild
                            if (!guild) {
                                data.delete();
                                return
                            }
                            const channel = guild.channels.cache.get(data.channel)
                            if (!channel) {
                                data.delete();
                                return
                            }
                            var job = new CronJob(
                                `${min_time} ${hour_time} * * ${week_time}`,
                                function () {
                                    cron_set.findOne({
                                        guild: guild.id,
                                        id: id
                                    }, async (err, data) => {
                                        if (!data) {
                                            return
                                        } else {
                                            channel.send(exampleEmbed)
                                        }
                                    })
                                },
                                null,
                                true,
                                'asia/taipei'
                            );
                        }


                    });
                }
            })
        }

    } else if (text.includes("join_msg")) {
        await interaction.deferReply();
        const content = interaction.fields.getTextInputValue("join_msgcontent");
        const color = interaction.fields.getTextInputValue("join_msgcolor");
        const img = interaction.fields.getTextInputValue("join_img");
        function isImgUrl(url) {
            return /\.(jpg|jpeg|png|webp|avif|gif)$/.test(url)
          }
        if(img && !isImgUrl(img)) return errors('你傳送的並不是圖片!可至https://docsmhcat.yorukot.me/allcommands/加入設置/join_message查看教學') 
    if (!validateColor(color) && (color !== "Random" && color !== "RANDOM")) return errors('你傳送的並不是顏色(色碼)')
        join_message.findOne({
            guild: interaction.guild.id,
        }, async (err, data) => {
            if (!data) {
                return errors("很抱歉，出現了未知的錯誤!")
            } else {
                data.collection.updateOne(({
                    guild: interaction.channel.guild.id
                }), {
                    $set: {
                        message_content: content,
                        color: color,
                        img: img ? img : null
                    }
                })
            }
        })
        const welcome = new EmbedBuilder()
            .setAuthor({
                name: `🪂 歡迎加入 ${interaction.guild.name}!`,
                iconURL: `${interaction.guild.iconURL() === null ? interaction.guild.members.me.displayAvatarURL({dynamic: true}) : interaction.guild.iconURL()}`
            })
            .setDescription(`${content}`)
            .setThumbnail(interaction.user.displayAvatarURL({
                dynamic: true
            }))
            .setColor(color === 'RANDOM' ? 'Random' : color )
            .setImage(img ? img : null)
            .setTimestamp()
        interaction.editReply({
            content: "下面為預覽，想修改嗎?再次輸入指令即可修改({MEMBERNAME}在到時候會變正常喔)",
            embeds: [welcome],
        });
    } else if (text.includes("leave_msg")) {
        await interaction.deferReply();
        const content = interaction.fields.getTextInputValue("leave_msgcontent");
        const color = interaction.fields.getTextInputValue("leave_msgcolor");
        const title = interaction.fields.getTextInputValue("leave_msgtitle");
        if (!validateColor(color) && color !== "Random") return errors('你傳送的並不是顏色(色碼)')
        leave_message.findOne({
            guild: interaction.guild.id,
        }, async (err, data) => {
            if (!data) {
                return errors("很抱歉，出現了未知的錯誤!")
            } else {
                data.collection.updateOne(({
                    guild: interaction.channel.guild.id
                }), {
                    $set: {
                        message_content: content
                    }
                })
                data.collection.updateOne(({
                    guild: interaction.channel.guild.id
                }), {
                    $set: {
                        color: color
                    }
                })
                data.collection.updateOne(({
                    guild: interaction.channel.guild.id
                }), {
                    $set: {
                        title: title
                    }
                })
            }
        })
        const welcome = new EmbedBuilder()
            .setTitle(`${title}`)
            .setDescription(`${content}`)
            .setThumbnail(interaction.user.displayAvatarURL({
                dynamic: true
            }))
            .setColor(color)
            .setTimestamp()
        interaction.editReply({
            content: "下面為預覽，想修改嗎?再次輸入指令即可修改((MEMBERNAME)在到時候會變正常喔)",
            embeds: [welcome],
        });
    } else if (text.includes("roleadd")) {
        await interaction.deferReply();
        const role = interaction.fields.getTextInputValue(text);
        const add = text.replace("roleaddcontent", '') + `add`
        const delete1 = text.replace("roleaddcontent", '') + `delete`
        const bt = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId(add)
                .setLabel('✅點我增加身分組!')
                .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                .setCustomId(delete1)
                .setLabel('❎點我刪除身分組!')
                .setStyle(ButtonStyle.Danger),
            );
        const embed = new EmbedBuilder()
            .setTitle("選取身分組")
            .setDescription(`${role}`)
            .setColor(interaction.guild.members.me.displayHexColor)
        interaction.channel.send({
            embeds: [embed],
            components: [bt]
        });
        greate("成功創建領取身分組")
    } else if (text.includes("ticket")) {
        await interaction.deferReply();
        const color = interaction.fields.getTextInputValue('ticketcolor');
        const title = interaction.fields.getTextInputValue('tickettitle');
        const content = interaction.fields.getTextInputValue('ticketcontent');
        if (!validateColor(color)) return errors('你傳送的並不是顏色(色碼)')
        const announcement = new EmbedBuilder()
            .setTitle(title)
            .setDescription("" + content + "")
            .setColor(color)
        const bt = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('tic')
                .setLabel('🎫 點我創建客服頻道!')
                .setStyle(ButtonStyle.Primary),
            );
        interaction.channel.send({
            embeds: [announcement],
            components: [bt]
        })
        greate("成功創建私人頻道")
    } else if (text.includes("ver")) {
        await interaction.deferReply();
        let v = text.replace("ver", "");
        if (v === all) {
            verification.findOne({
                guild: interaction.guild.id,
            }, async (err, data) => {
                if (err) throw err;
                const role = interaction.guild.roles.cache.get(data.role)
                if (!role) return errors("驗證身分組已經不存在了，請通管理員!")
                if (Number(role.position) >= Number(interaction.guild.members.me.roles.highest.position)) return errors("請通知群主管裡員我沒有權限給你這個身分組(請把我的身分組調高)!")
                interaction.member.roles.add(role)
                if (data.name && data.name !== null) {
                    if (interaction.guild.ownerId === interaction.member.id) return errors("你是伺服器服主，我沒有權限改你的名字!")
                    let new_nick_name = data.name.replace(`{name}`, interaction.member.user.username)
                    interaction.member.setNickname(new_nick_name)
                }
                greate("驗證成功，成功給予你身分組及改名(有的話)!")
            })
        } else {
            return errors("你的驗證碼輸入錯誤，請重試(如果看不清楚的話可以重打指令)")
        }
    } else if (text.includes("ann")) {
        await interaction.deferReply();
        const tag = interaction.fields.getTextInputValue('anntag');
        const color = interaction.fields.getTextInputValue('anncolor');
        const title = interaction.fields.getTextInputValue('anntitle');
        const content = interaction.fields.getTextInputValue('anncontent');
        if (!validateColor(color)) return errors('你傳送的並不是顏色(色碼)')
        const announcement = new EmbedBuilder()
            .setTitle(title)
            .setDescription("" + content + "")
            .setColor(color)
            .setFooter({
                text: `來自${interaction.user.tag}的公告`,
                iconURL: interaction.user.displayAvatarURL({
                    dynamic: true
                })
            });
        // 設定是否傳送按鈕
        const yesno = new EmbedBuilder()
            .setTitle("是否將此訊息送往公告?(請於六秒內點擊:P)")
            .setColor("#00ff19")
        const yes = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId("announcement_yes")
                .setEmoji("✅")
                .setLabel('是')
                .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                .setCustomId('announcement_no')
                .setLabel('否')
                .setEmoji("❎")
                .setStyle(ButtonStyle.Danger),
            );
        // 發送訊息
        try {
            interaction.editReply({
                content: tag,
                embeds: [announcement]
            })
            setTimeout(() => {
                interaction.channel.send({
                    embeds: [yesno],
                    components: [yes]
                }).then((message) => {
                    setTimeout(() => {
                        message.delete()
                    }, 6000);
                });
            }, 500)


        } catch (error) {
            // 如果有錯誤
            console.log(error)
            const error_embed = new EmbedBuilder()
                .setTitle("錯誤 | error")
                .setDescription("很抱歉出現了錯誤!\n" + `\`\`\`${error}\`\`\`` + "\n如果可以再麻煩您回報給`夜貓#5042`")
                .setColor("Red")
            interaction.editReply({
                embeds: [error_embed]
            })
        }
        // 說出是否發送+公告預覽
        const collector = interaction.channel.createMessageComponentCollector({
            time: 6000,
            max: 1,
        })
        collector.on('collect', async (ButtonInteraction) => {
            await ButtonInteraction.deferReply();
            const id = ButtonInteraction.customId;
            if (id === `announcement_yes`) {
                guild.findOne({
                    guild: interaction.channel.guild.id,
                }, async (err, data) => {
                    if (!data || data.announcement_id === "0") {
                        ButtonInteraction.editReply("很抱歉!\n你還沒有對您的公告頻道進行選擇!\n命令:`<> 公告頻道設置 [公告頻道id]`\n有問題歡迎打`<>幫助`")
                        return
                    } else {
                        const channel111 = client.channels.cache.get(data.announcement_id)
                        if (!channel111) return
                        const hasPermissionInChannel = channel111
                            .permissionsFor(interaction.guild.members.me, [PermissionsBitField.Flags.SendMessages])
                        const hasPermissionInChannel1 = channel111
                            .permissionsFor(interaction.guild.members.me, [PermissionsBitField.Flags.ViewChannel])
                        if (!hasPermissionInChannel || !hasPermissionInChannel1) {
                            return errors("我沒有權限在" + channel111.name + "發送消息!")
                        }
                        channel111.send({
                            content: tag,
                            embeds: [announcement]
                        })
                        ButtonInteraction.editReply("<a:green_tick:994529015652163614> | 成功發送!")
                    }
                })
            }
            if (id === 'announcement_no') {
                ButtonInteraction.editReply("已取消")
                return
            }
        })
    }
});