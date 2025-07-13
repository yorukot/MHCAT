const client = require('../index');
const Number = require('../models/Number.js');
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
    PermissionsBitField,
    AuditLogEvent,
    Events
} = require('discord.js');
const logging = require("../models/logging.js")

client.on(Events.MessageUpdate, (oldContent, newContent) => {
    logging.findOne({
        guild: oldContent?.channel?.guild?.id,
    }, async (err, data) => {
        if (!data) return;
        if (!data.message_update) return
        const Logs = client.channels.cache.get(data.channel_id);
        if (!Logs) return;
        if (!oldContent.author) return
        if (oldContent.author.bot) return
        if (newContent === undefined) return
        if (oldContent.content === newContent.content) return
        const MessageEdited = new EmbedBuilder()
            .setAuthor({
                name: `${oldContent.author.username} | 訊息編輯`,
                iconURL: `${oldContent.author.avatarURL({
                extension: 'png'
            }) ? oldContent.author.avatarURL({
                extension: 'png'
            }) : "https://i.imgur.com/B91C90T.png"}`
            })
            .setColor(`#46A3FF`)
            .setDescription(`**<:edit:1084846013476511765> 訊息編輯者: <@${oldContent.author.id}> | <:Channel:994524759289233438> 訊息編輯位置: <#${oldContent.channel.id}>**`)
            .addFields({
                name: `**<:book:1084846007545778217> 舊訊息:**`,
                value: `\`\`\`${oldContent} \`\`\``,
                inline: false
            }, {
                name: `**<:new:1084846011366785135> 新訊息:**`,
                value: `\`\`\`${newContent} \`\`\``,
                inline: false
            }, {
                name: `**<:attachment:1084846756799455242> 附件:**`,
                value: `${newContent.attachments.size > 0 ? `${newContent.attachments.map((a) => a.url)}` : '**沒有附件**'}`,
                inline: false
            }, )
            .setFooter({
                text: 'MHCAT帶給你最棒的Discord體驗!',
                iconURL: `${client.user.avatarURL()}`
            })
            .setTimestamp()

        return Logs.send({
            embeds: [MessageEdited]
        });
    })
})

client.on(Events.MessageDelete, async (message) => {
    if (message.guild === null) return;
    if (!message.guild) return;
    logging.findOne({
        guild: message.guild.id,
    }, async (err, data) => {
        if (!data) return;
        if (!data.message_delete) return
        const Logs = client.channels.cache.get(data.channel_id);
        if (!Logs) return;
        if (!message.author) return
        if (message.author.bot) return
        let logs = await message.guild.fetchAuditLogs({type: 72, limit: 1});
        let entry = logs.entries.find(a =>
            // Small filter function to make use of the little discord provides to narrow down the correct audit entry.
            a.target.id === message.author.id &&
            a.extra.channel.id === message.channel.id
            // Ignore entries that are older than 20 seconds to reduce false positives.
          );
          let author = entry?.executor || message.author
        const MessageEdited = new EmbedBuilder()
            .setAuthor({
                name: `${message.author.username} | 訊息刪除`,
                iconURL: `${message.author.avatarURL({
                    extension: 'png'
                }) ? message.author.avatarURL({
                    extension: 'png'
                }) : "https://i.imgur.com/B91C90T.png"}`
            })
            .setColor('#84C1FF')
            .setDescription(`**<:trash:1084846016798396526> 訊息刪除者: <@${author.id}> | <:user:986064391139115028> 訊息發送者:<@${message.author.id}> | <:Channel:994524759289233438> 訊息刪除位置: <#${message.channel.id}>**`)
            .addFields({
                name: `**<:comments:985944111725019246> 訊息:**`,
                value: `\`\`\`${message.content} \`\`\``,
                inline: false
            }, {
                name: `**<:attachment:1084846756799455242> 附件:**`,
                value: `${message.attachments.size > 0 ? `${message.attachments.map((a) => a.url)}` : '**沒有附件**'}`,
                inline: false
            }, )
            .setFooter({
                text: 'MHCAT帶給你最棒的Discord體驗!',
                iconURL: `${client.user.avatarURL()}`
            })
            .setTimestamp()
        return Logs.send({
            embeds: [MessageEdited],
        });
    })
})

// Channel Topic Updating 
client.on(Events.ChannelUpdate, (oldChannel, newChannel) => {
    logging.findOne({
        guild: oldChannel.guild.id,
    }, async (err, data) => {
        if (!data) return;
        if (!data.channel_update) return
        const LogChannel = client.channels.cache.get(data.channel_id);
        if (!LogChannel) return;

        if (oldChannel.topic !== newChannel.topic) {
            let user_1 = await oldChannel.guild.fetchAuditLogs({
                type: 11,
                limit: 1
            })
            let user = user_1.entries.first()?.executor
            // 頻道主題更新
            const TopicUpdate = new EmbedBuilder()
                .setAuthor({
                    name: `${user.username} | 頻道主題更新`,
                    iconURL: `${user.avatarURL({
                        extension: 'png'
                    }) ? user.avatarURL({
                        extension: 'png'
                    }) : "https://i.imgur.com/B91C90T.png"}`
                })
                .setColor('#FF8040')
                .setDescription(`**<:chat:1085254765342109697> 頻道主題編輯者: <@${user.id}> | <:Channel:994524759289233438> 頻道: <#${oldChannel.id}>**`)
                .addFields({
                    name: `**<:book:1084846007545778217> 舊主題**`,
                    value: `\`\`\`${oldChannel.topic} \`\`\``,
                    inline: false
                }, {
                    name: `**<:new:1084846011366785135> 新主題:**`,
                    value: `\`\`\`${newChannel.topic} \`\`\``,
                    inline: false
                }, )
                .setFooter({
                    text: 'MHCAT帶給你最棒的Discord體驗!',
                    iconURL: `${client.user.avatarURL()}`
                })
                .setTimestamp()
            LogChannel.send({
                embeds: [TopicUpdate]
            });
        }
        else if (Array.from(newChannel.permissionOverwrites.cache.values()) !== Array.from(oldChannel.permissionOverwrites.cache.values())) {
            let permission = Array.from(newChannel.permissionOverwrites.cache.values())
            let old_permission = Array.from(oldChannel.permissionOverwrites.cache.values())
            let test = [
                "Create Instant Invite",
                "Kick Members",
                "Ban Members",
                "Administrator",
                "Manage Channels",
                "Manage Guild",
                "Add Reactions",
                "View AuditLog",
                "Priority Speaker",
                "Stream",
                "View Channel",
                "Send Messages",
                "Send TTS Messages",
                "Manage Messages",
                "Embed Links",
                "Attach Files",
                "Read Message History",
                "Mention Everyone",
                "Use External Emojis",
                "View Guild Insights",
                "Connect",
                "Speak",
                "Mute Members",
                "Deafen Members",
                "Move Members",
                "Use VAD",
                "Change Nickname",
                "Manage Nicknames",
                "Manage Roles",
                "Manage Webhooks",
                "Manage Emojis And Stickers",
                "Use Application Commands",
                "Request To Speak",
                "Manage Events",
                "Manage Threads",
                "Create Public Threads",
                "Create Private Threads",
                "Use External Stickers",
                "Send Messages In Threads",
                "Use Embedded Activities",
                "Moderate Members"
            ]
            let get_per = []
            for (let index = 0; index < permission.length; index++) {
                let role_allow = []
                let role_deny = []
                let role_default = []
                for (let array_count = 0; array_count < test.length; array_count++) {
                    //取得舊頻道的該身分組
                    let role = old_permission.find(obj => obj.id === permission[index].id);
                    if (role) {
                        //判斷是不是增加新的允許身分組
                        //檢測是不是變成默認狀態
                        if ((permission[index].allow.serialize()[test[array_count].replace(/ /g, '')] !== old_permission[index].allow.serialize()[test[array_count].replace(/ /g, '')]) && (
                                permission[index].allow.serialize()[test[array_count].replace(/ /g, '')] === false && old_permission[index].allow.serialize()[test[array_count].replace(/ /g, '')] === true)) {
                            role_default.push('<:YellowSmallDot:1023970607429328946> ' + test[array_count])
                        } else if (permission[index].allow.serialize()[test[array_count].replace(/ /g, '')] !== old_permission[index].allow.serialize()[test[array_count].replace(/ /g, '')]) {
                            role_allow.push('<:check:1085240252978966548> ' + test[array_count])
                        }
                        //判斷是不是增加新的不允許身分組
                        //檢測是不是變成默認狀態
                        if ((permission[index].deny.serialize()[test[array_count].replace(/ /g, '')] !== old_permission[index].deny.serialize()[test[array_count].replace(/ /g, '')]) && (
                                permission[index].deny.serialize()[test[array_count].replace(/ /g, '')] === false && old_permission[index].deny.serialize()[test[array_count].replace(/ /g, '')] === true)) {
                            role_default.push('<:YellowSmallDot:1023970607429328946> ' + test[array_count])
                        } else if (permission[index].deny.serialize()[test[array_count].replace(/ /g, '')] !== old_permission[index].deny.serialize()[test[array_count].replace(/ /g, '')]) {
                            role_deny.push('<:prohibition:1085240255810129960> ' + test[array_count])
                        }
                        //如果是新加身分組則執行這個
                    } else {
                        if (permission[index].allow.serialize()[test[array_count].replace(/ /g, '')]) {
                            role_allow.push('<:check:1085240252978966548> ' + test[array_count])
                        }
                        if (permission[index].deny.serialize()[test[array_count].replace(/ /g, '')]) {
                            role_deny.push('<:prohibition:1085240255810129960> ' + test[array_count])
                        }
                    }
                    if (array_count === test.length - 1) {
                        if(role_allow.length !== 0 || role_deny.length !== 0 || role_default.length !== 0) get_per.push({
                            id: permission[index].id,
                            role_allow: role_allow,
                            role_deny: role_deny,
                            role_default: role_default
                        })
                    }
                }
            }
            //知道是誰編輯頻道
            let user_1 = await oldChannel.guild.fetchAuditLogs({
                type: 11,
                limit: 1
            })
            let user = user_1.entries.first()?.executor
            //發送消息
            for (let index = 0; index < get_per.length; index++) {
                const channel_permission_embed = new EmbedBuilder()
                    .setAuthor({
                        name: `${user.username} | 頻道權限更新`,
                        iconURL: `${user.avatarURL({
                    extension: 'png'
                }) ? user.avatarURL({
                    extension: 'png'
                }) : "https://i.imgur.com/B91C90T.png"}`
                    })
                    .setColor('#FF5809')
                    .setDescription(`**<:shield:1019529265101930567> 頻道權限編輯者: <@${user.id}> | <:Channel:994524759289233438> 頻道: <#${oldChannel.id}>**`)
                    .addFields({
                        name: `**<:roleplaying:985945121264635964> 身分組或使用者: **`,
                        value: `<:icons_text1:1000814305068986590>${oldChannel.guild.roles.cache.get(get_per[index].id) ? `<@&${get_per[index].id}>` : `<@${get_per[index].id}>`}
${get_per[index].role_default.join('\n')}
${get_per[index].role_allow.join('\n')}
${get_per[index].role_deny.join('\n')}`,
                        inline: false
                    })
                    .setFooter({
                        text: 'MHCAT帶給你最棒的Discord體驗!',
                        iconURL: `${client.user.avatarURL()}`
                    })
                    .setTimestamp()
                LogChannel.send({
                    embeds: [channel_permission_embed]
                });
            }
        }

    })
});

// Joined VC
client.on(Events.VoiceStateUpdate, (oldState, newState) => {
    logging.findOne({
        guild: newState.guild ? newState.guild.id : oldState.guild.id,
    }, async (err, data) => {
        if (!data) return;
        if (!data.member_voice_update) return
        const LogChannel = client.channels.cache.get(data.channel_id);
        if (!LogChannel) return;
        if(!oldState.channel){
            const VCJoined = new EmbedBuilder()
                    .setAuthor({
                        name: `${newState.member.user.username} | 使用者加入語音頻道`,
                        iconURL: `${newState.member.user.avatarURL({
                    extension: 'png'
                }) ? newState.member.user.avatarURL({
                    extension: 'png'
                }) : "https://i.imgur.com/B91C90T.png"}`
                    })
                    .setColor('#F235FA')
                    .setDescription(`**<:user:986064391139115028> 使用者: <@${newState.member.user.id}> | <:voice:1086216862355951636> 頻道: <#${newState.channelId}>**`)
                    .addFields(
                    {
                        name: `**<:joines:1086217186256900098> 加入頻道:**`,
                        value: `<#${newState.channelId}>(\`${newState.channel.name}\`)`,
                        inline: false
                    }, )
                    .setFooter({
                        text: 'MHCAT帶給你最棒的Discord體驗!',
                        iconURL: `${client.user.avatarURL()}`
                    })
                    .setTimestamp()
                return LogChannel.send({
                    embeds: [VCJoined]
                });
        }else if(!newState.channel){
            const VCJoined = new EmbedBuilder()
                    .setAuthor({
                        name: `${oldState.member.user.username} | 使用者退出語音頻道`,
                        iconURL: `${oldState.member.user.avatarURL({
                    extension: 'png'
                }) ? oldState.member.user.avatarURL({
                    extension: 'png'
                }) : "https://i.imgur.com/B91C90T.png"}`
                    })
                    .setColor('#FA359A')
                    .setDescription(`**<:user:986064391139115028> 使用者: <@${oldState.member.user.id}> | <:voice:1086216862355951636> 頻道: <#${oldState.channelId}>**`)
                    .addFields(
                    {
                        name: `**<:leaves:1086219523264356513> 退出頻道:**`,
                        value: `<#${oldState.channelId}>(\`${oldState.channel.name}\`)`,
                        inline: false
                    }, )
                    .setFooter({
                        text: 'MHCAT帶給你最棒的Discord體驗!',
                        iconURL: `${client.user.avatarURL()}`
                    })
                    .setTimestamp()
                return LogChannel.send({
                    embeds: [VCJoined]
                });
        }
    })
})


/*
// unhandled Guild Channel Update
client.on("unhandledGuildChannelUpdate", (oldChannel, newChannel) => {

    logging.findOne({
        guild: oldChannel.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const unhandledGuildChannelUpdate = new MessageEmbed()
            .setTitle('Channel Updated!')
            .setColor(oldChannel.guild.me.displayHexColor)
            .setDescription("頻道" + oldChannel.id + "' 已编辑，但 discord-logs 找不到更新的内容...")
            .setTimestamp()
        return LogChannel.send({
            embeds: [unhandledGuildChannelUpdate]
        });
    })
});

// Member Started Boosting
client.on("guildMemberBoost", (member) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const MemberBoost = new MessageEmbed()
            .setTitle('成員加成了伺服器')
            .setColor(member.guild.me.displayHexColor)
            .setDescription(`**${member.user.tag}** 加成了  ${member.guild.name}!`)
            .setTimestamp()
        return LogChannel.send({
            embeds: [MemberBoost]
        });
    })
})

// Member Unboosted
client.on("guildMemberUnboost", (member) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const MemberUnboost = new MessageEmbed()
            .setTitle('成員取消加成')
            .setColor(member.guild.me.displayHexColor)
            .setDescription(`**${member.user.tag}** 取消加成  ${member.guild.name}!`)
            .setTimestamp()
        return LogChannel.send({
            embeds: [MemberUnboost]
        });
    })
})

// Member Got Role
client.on("guildMemberRoleAdd", (member, role) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const MemberRoleAdd = new MessageEmbed()
            .setTitle('成員取得身分組')
            .setColor(member.guild.me.displayHexColor)
            .setDescription(`**${member.user.tag}** 取得身分組 \`${role.name}\``)
            .setTimestamp()
        return LogChannel.send({
            embeds: [MemberRoleAdd]
        });
    })
})

// Member Lost Role
client.on("guildMemberRoleRemove", (member, role) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const MemberRoleRemove = new MessageEmbed()
            .setTitle('成員失去身分組')
            .setColor(member.guild.me.displayHexColor)
            .setDescription(`**${member.user.tag}** 失去了 \`${role.name}\``)
            .setTimestamp()
        return LogChannel.send({
            embeds: [MemberRoleRemove]
        });
    })
})

// Nickname Changed
client.on("guildMemberNicknameUpdate", (member, oldNickname, newNickname) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const MemberNicknameUpdate = new MessageEmbed()
            .setTitle('暱稱更新')
            .setColor(member.guild.me.displayHexColor)
            .setDescription(`${member.user.tag} 的暱稱從 \`${oldNickname}\` 變成 \`${newNickname}\``)
            .setTimestamp()
        return LogChannel.send({
            embeds: [MemberNicknameUpdate]
        });
    })
})


client.on("guildMemberRemove", (member) => {
    Number.findOne({
        guild: member.guild.id
    }, async (err, data) => {
        if (!data) return;
        const guild = client.guilds.cache.get(data.guild);
        if (!guild) return
        const get_memberNumber = guild.channels.cache.get(data.memberNumber)
        const channel_name = get_memberNumber.name
        get_memberNumber.setName(channel_name.replace(`${guild.members.cache.size + 1}`, `${guild.members.cache.size}`))
            .catch(console.error);
        if (channel_name.search(`${guild.members.cache.size + 1}`) === -1) {
            console.log(`${guild.members.cache.size}`)
            get_memberNumber.setName(`${guild.members.cache.size}`)
                .catch(console.error);
            return
        }
    })
})

// Server Boost Level Up
client.on("guildBoostLevelUp", (guild, oldLevel, newLevel) => {

    logging.findOne({
        guild: guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const LevelUp = new MessageEmbed()
            .setTitle('伺服器等級提升')
            .setColor(guild.me.displayHexColor)
            .setDescription(`${guild.name} 的等級提升到了 ${newLevel}`)
            .setTimestamp()
        return LogChannel.send({
            embeds: [LevelUp]
        });
    })
})

// Server Boost Level Down
client.on("guildBoostLevelDown", (guild, oldLevel, newLevel) => {

    logging.findOne({
        guild: guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const LevelDown = new MessageEmbed()
            .setTitle('伺服器等級降級')
            .setColor(guild.me.displayHexColor)
            .setDescription(`${guild.name} 的等級從 ${oldLevel} 降到 ${newLevel}`)
            .setTimestamp()
        return LogChannel.send({
            embeds: [LevelDown]
        });
    })
})

// Banner Added
client.on("guildBannerAdd", (guild, bannerURL) => {

    logging.findOne({
        guild: guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const BannerAdd = new MessageEmbed()
            .setTitle('伺服器增加BANNER')
            .setColor(guild.me.displayHexColor)
            .setImage(bannerURL)
            .setTimestamp()
        return LogChannel.send({
            embeds: [BannerAdd]
        });
    })
})

// AFK Channel Added
client.on("guildAfkChannelAdd", (guild, afkChannel) => {

    logging.findOne({
        guild: guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const AFKAdd = new MessageEmbed()
            .setTitle('增加AFK頻道')
            .setColor(guild.me.displayHexColor)
            .setDescription(`${guild.name} 增加了一個afk頻道: ${afkChannel}`)
            .setTimestamp()
        return LogChannel.send({
            embeds: [AFKAdd]
        });
    })
})

// Guild Vanity Add
client.on("guildVanityURLAdd", (guild, vanityURL) => {

    logging.findOne({
        guild: guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const VanityAdd = new MessageEmbed()
            .setTitle('公會邀請連結增加')
            .setColor(guild.me.displayHexColor)
            .setDescription(`${guild.name} 增加了一個新的連結: ${vanityURL}`)
            .setTimestamp()
        return LogChannel.send({
            embeds: [VanityAdd]
        });
    })
})

// Guild Vanity Remove
client.on("guildVanityURLRemove", (guild, vanityURL) => {

    logging.findOne({
        guild: guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const VanityRemove = new MessageEmbed()
            .setTitle('公會邀請連結刪除')
            .setColor(guild.me.displayHexColor)
            .setDescription(`${guild.name} 刪除了一個邀請連結: ${vanityURL}`)
            .setTimestamp()
        return LogChannel.send({
            embeds: [VanityRemove]
        });
    })
})

// Guild Vanity Link Updated
client.on("guildVanityURLUpdate", (guild, oldVanityURL, newVanityURL) => {

    logging.findOne({
        guild: guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const VanityUpdated = new MessageEmbed()
            .setTitle('邀請連結更新')
            .setColor(guild.me.displayHexColor)
            .setDescription(`${guild.name} 邀請連結從 ${oldVanityURL} 變成了 ${newVanityURL}!`)
            .setTimestamp()
        return LogChannel.send({
            embeds: [VanityUpdated]
        });
    })
})

// Message Pinned
client.on("messagePinned", (message) => {

    logging.findOne({
        guild: message.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const MessagePinned = new MessageEmbed()
            .setTitle('至頂消息')
            .setColor(message.guild.me.displayHexColor)
            .setDescription("這個訊息被至頂了" + message)
            .setTimestamp()
        return LogChannel.send({
            embeds: [MessagePinned]
        });
    })
})

// Member Became Offline
client.on("guildMemberOffline", (member, oldStatus) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const MemberOffline = new MessageEmbed()
            .setTitle('成員下線')
            .setColor(member.guild.me.displayHexColor)
            .setDescription(member.user.tag + " 下線了")
            .setTimestamp()
        return LogChannel.send({
            embeds: [MemberOffline]
        });
    })
})

// Member Became Online
client.on("guildMemberOnline", (member, newStatus) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const MemberOnline = new MessageEmbed()
            .setTitle('成員上線')
            .setColor(member.guild.me.displayHexColor)
            .setDescription(member.user.tag + " 狀態變成 " + newStatus + "!")
            .setTimestamp()
        return LogChannel.send({
            embeds: [MemberOnline]
        });
    })
})

// Role Position Updated
client.on("rolePositionUpdate", (role, oldPosition, newPosition) => {

    logging.findOne({
        guild: oldPosition.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const RolePositionUpdated = new MessageEmbed()
            .setTitle('身分組位置更新')
            .setColor(oldPosition.guild.me.displayHexColor)
            .setDescription(role.name + " 的位置從 " + oldPosition + " 變成了 " + newPosition)
            .setTimestamp()
        return LogChannel.send({
            embeds: [RolePositionUpdated]
        });
    })
})

// Role Permission Updated
client.on("rolePermissionsUpdate", (role, oldPermissions, newPermissions) => {

    logging.findOne({
        guild: oldPermissions.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const RolePermissionUpdated = new MessageEmbed()
            .setTitle('身分組權限更新')
            .setColor(oldPermissions.guild.me.displayHexColor)
            .setDescription(role.name + " 的權限從 " + oldPermissions + " 變成了 " + newPermissions)
            .setTimestamp()
        return LogChannel.send({
            embeds: [RolePermissionUpdated]
        });
    })
})

// Avatar Updated
client.on("userAvatarUpdate", (user, oldAvatarURL, newAvatarURL) => {

    logging.findOne({
        guild: user.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const AvatarUpdated = new MessageEmbed()
            .setTitle('用戶頭像更新')
            .setColor(user.guild.me.displayHexColor)
            .setDescription(`${user.tag} 的頭像從 \n[Old Avatar](${oldAvatarURL})\n 變成\n[New Avatar(${newAvatarURL})]`)
            .setTimestamp()
        return LogChannel.send({
            embeds: [AvatarUpdated]
        });
    })
})


// Discriminator Updated
client.on("userDiscriminatorUpdate", (user, oldDiscriminator, newDiscriminator) => {

    logging.findOne({
        guild: user.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const Discriminator = new MessageEmbed()
            .setTitle('用戶自述更新')
            .setColor(user.guild.me.displayHexColor)
            .setDescription(`${user.tag} 的自述從 ${oldDiscriminator} 變成 ${oldDiscriminator}`)
            .setTimestamp()
        return LogChannel.send({
            embeds: [Discriminator]
        });
    })
})

// Joined VC
client.on("voiceChannelJoin", (member, channel) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const VCJoined = new MessageEmbed()
            .setTitle('加入語音頻道')
            .setColor(member.guild.me.displayHexColor)
            .setDescription(member.user.tag + " 加入了 " + `${channel}` + "!")
            .setTimestamp()
        return LogChannel.send({
            embeds: [VCJoined]
        });
    })
})

// Left VC
client.on("voiceChannelLeave", (member, channel) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const VCLeft = new MessageEmbed()
            .setTitle('離開語音頻道')
            .setColor(member.guild.me.displayHexColor)
            .setDescription(member.user.tag + " 離開了 " + `${channel}` + "!")
            .setTimestamp()
        return LogChannel.send({
            embeds: [VCLeft]
        });
    })
})

// VC Switch
client.on("voiceChannelSwitch", (member, oldChannel, newChannel) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const VCSwitch = new MessageEmbed()
            .setTitle('用戶去了別的語音頻道')
            .setColor(member.guild.me.displayHexColor)
            .setDescription(member.user.tag + " 從 " + oldChannel.name + " 跑到了 " + newChannel.name + "!")
            .setTimestamp()
        return LogChannel.send({
            embeds: [VCSwitch]
        });
    })
})

// VC Mute
client.on("voiceChannelMute", (member, muteType) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const VCMute = new MessageEmbed()
            .setTitle('成員靜音')
            .setColor(member.guild.me.displayHexColor)
            .setDescription(member.user.tag + " 靜音了! (類型: " + muteType + ")")
            .setTimestamp()
        return LogChannel.send({
            embeds: [VCMute]
        });
    })
})

// VC Unmute
client.on("voiceChannelUnmute", (member, oldMuteType) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const VCUnmute = new MessageEmbed()
            .setTitle('取消靜音')
            .setColor(member.guild.me.displayHexColor)
            .setDescription(member.user.tag + "取消了靜音!")
            .setTimestamp()
        return LogChannel.send({
            embeds: [VCUnmute]
        });
    })
})

// VC Defean
client.on("voiceChannelDeaf", (member, deafType) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const VCDeafen = new MessageEmbed()
            .setTitle('成員拒聽')
            .setColor(member.guild.me.displayHexColor)
            .setDescription(member.user.tag + " 拒聽!")
            .setTimestamp()
        return LogChannel.send({
            embeds: [VCDeafen]
        });
    })
})

// VC Undefean
client.on("voiceChannelUndeaf", (member, deafType) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const VCUndeafen = new MessageEmbed()
            .setTitle('成員取消拒聽')
            .setColor(member.guild.me.displayHexColor)
            .setDescription(member.user.tag + " 取消拒聽!")
            .setTimestamp()

        return LogChannel.send({
            embeds: [VCUndeafen]
        });
    })
})

// User Started to Stream
client.on("voiceStreamingStart", (member, voiceChannel) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const UserStreaming = new MessageEmbed()
            .setTitle('使用者開始直播')
            .setColor(member.guild.me.displayHexColor)
            .setDescription(member.user.tag + "開始直播，在: " + voiceChannel.name)
            .setTimestamp()

        return LogChannel.send({
            embeds: [UserStreaming]
        });
    })
})

// User Stopped to Stream
client.on("voiceStreamingStart", (member, voiceChannel) => {

    logging.findOne({
        guild: member.guild.id,
    }, async (err, data) => {
        if (!data) return;
        const LogChannel = client.channels.cache.get(data.channel_id);
        const UserStoppedStreaming = new MessageEmbed()
            .setTitle('使用者停止直播')
            .setColor(member.guild.me.displayHexColor)
            .setDescription(member.user.tag + "停止直播，在:" + voiceChannel.name)
            .setTimestamp()

        return LogChannel.send({
            embeds: [UserStoppedStreaming]
        });
    })
})*/