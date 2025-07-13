const Number = require("../../models/Number.js");
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
    ChannelType
} = require('discord.js');
const canvacord = require("canvacord");
module.exports = {
    name: '統計系統創建',
    cooldown: 30,
    description: '創建統計消息',
    options: [{
        name: '統計頻道類型',
        type: ApplicationCommandOptionType.String,
        description: '輸入統計頻道要是文字頻道還是語音頻道',
        required: true,
        choices:[
            { name: '文字頻道', value: '文字頻道' },
            { name: '語音頻道', value: '語音頻道' },
        ],
    },{
        name: '統計選項',
        type: ApplicationCommandOptionType.String,
        description: '輸入統計要統計甚麼',
        required: false,
        choices:[
            { name: '頻道數量', value: '頻道數量' },
            { name: '文字頻道數量', value: '文字頻道數量' },
            { name: '語音頻道數量', value: '語音頻道數量' },
        ],
    }],
    UserPerms: '訊息管理',
    //video: 'https://docsmhcat.yorukot.mecommands/statistics.html',
    emoji: `<:statistics:986108146747600928>`,
    run: async (client, interaction, options, perms) => {
        try {
        await interaction.deferReply().catch(e => { });
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.followUp({embeds: [embed]})}
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const member = interaction.options.getString("統計選項")
        const vt = interaction.options.getString("統計頻道類型")
        const bots = interaction.guild.members.cache.filter(member => member.user.bot);
        const members = interaction.guild.memberCount - bots.size
        if(vt !== "文字頻道" && vt !== "語音頻道")return errors("你沒有進行設置要文字頻道還是語音頻道!或是你打錯了!")
        const embed = new EmbedBuilder()
                .setTitle("<a:greentick:980496858445135893> | 成功創建!頻道(不要動到數字就沒問題)跟類別的名稱都能自行更改喔!")
                .setColor("Green")
        Number.findOne({
            guild: interaction.guild.id,
        }, async (err, data) => {
            if (err) throw err;
            if(!data){
                const lodd = new EmbedBuilder().setTitle(`<a:lodding:980493229592043581> | 正在進行設置中!`).setColor("Green")
                const lodding = await interaction.followUp({embeds: [lodd]})
                const parent = await interaction.guild.channels.create({name:"伺服器統計數據(這串可隨便改)",  type: ChannelType.GuildCategory });
                switch (vt) {
                    case "語音頻道":
                        const membernumber = await interaction.guild.channels.create({
                            name: `總人數:${interaction.guild.memberCount}`, 
                            type:ChannelType.GuildVoice,
                            parent: parent.id,
                            permissionOverwrites: [
                                {
                                  id: interaction.guild.members.me.id,
                                  allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.Connect], //Allow permissions
                                },{
                                    id: interaction.guild.roles.everyone.id,
                                    deny: [PermissionsBitField.Flags.Connect],
                                    allow: [PermissionsBitField.Flags.ViewChannel]
                                }
                            ]
                        })
                            const usernumber = await interaction.guild.channels.create( {
                            name: `總成員:${members}`,
                            type:ChannelType.GuildVoice,
                            parent: parent.id,
                            permissionOverwrites: [
                                {
                                    id: interaction.guild.members.me.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.Connect], //Allow permissions
                                  },{
                                      id: interaction.guild.roles.everyone.id,
                                      deny: [PermissionsBitField.Flags.Connect],
                                      allow: [PermissionsBitField.Flags.ViewChannel]
                                  }
                            ]
                        })
                            const botnumber = await interaction.guild.channels.create( {
                            name: `總BOT數:${bots.size}`,
                            type:ChannelType.GuildVoice,
                            parent: parent.id,
                            permissionOverwrites: [
                                {
                                    id: interaction.guild.members.me.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.Connect], //Allow permissions
                                  },{
                                      id: interaction.guild.roles.everyone.id,
                                      deny: [PermissionsBitField.Flags.Connect],
                                      allow: [PermissionsBitField.Flags.ViewChannel]
                                  }
                            ]
                        })
                        data = new Number({
                            guild: interaction.guild.id,
                                parent: parent.id,
                                memberNumber: membernumber.id,
                                memberNumber_name: interaction.guild.memberCount,
                                userNumber: usernumber.id,
                                userNumber_name: members,
                                BotNumber: botnumber.id,
                                BotNumber_name: bots.size,
                                channelnumber: null,
                                channelnumber_name: null,
                                textnumber: null,
                                textnumber_name: null,
                                voicenumber: null,
                                voicenumber_name: null,
                                categoriesnumber: null,
                                categoriesnumber_name: null,
                                rolesnumber: null,
                                rolesnumber_name: null,
                                rolenumber: null,
                                rolenumber_name: null,
                                norolenumber: null,
                                norolenumber_name: null,
                                emojisnumber: null, 
                                emojisnumber_name: null,
                                staticnumber: null,
                                staticnumber_name: null,
                                gifnumber: null,
                                gifnumber_name: null,
                                stickersnumber:null,
                                stickersnumber_name: null,
                                boostsnumber: null,
                                boostsnumber_name: null,
                                tier: null,
                                tier_name: null,
                                onlinenumber: null,
                                onlinenumber_name: null,
                                dndnumber: null,
                                dndnumber_name: null,
                                idlenumber: null,
                                idlenumber_name: null,
                                offlinenumber: null,
                                offlinenumber_name: null,
                                onlinebotnumber: null,
                                onlinebotnumber_name: null,
                                statusnumber: null,
                                statusnumber_name: null,
                        })
                        data.save()
                        break;
                        case "文字頻道":
                            const membernumber_text = await interaction.guild.channels.create( {
                                name:`總人數: ${interaction.guild.memberCount}`,
                                type:ChannelType.GuildText,
                                parent: parent.id,
                                permissionOverwrites: [
                                    {
                                      id: interaction.guild.members.me.id,
                                      allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.SendMessages], //Allow permissions
                                    },{
                                        id: interaction.guild.roles.everyone.id,
                                        deny: [PermissionsBitField.Flags.SendMessages],
                                        allow: [PermissionsBitField.Flags.ViewChannel]
                                    }
                                ]
                            })
                            const usernumber_text = await interaction.guild.channels.create( {
                                name: `總成員: ${members}`,
                                type:ChannelType.GuildText,
                                parent: parent.id,
                                permissionOverwrites: [
                                    {
                                        id: interaction.guild.members.me.id,
                                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.SendMessages], //Allow permissions
                                      },{
                                          id: interaction.guild.roles.everyone.id,
                                          deny: [PermissionsBitField.Flags.SendMessages],
                                          allow: [PermissionsBitField.Flags.ViewChannel]
                                      }
                                ]
                            })
                            const botnumber_text = await interaction.guild.channels.create( {
                                name: `總BOT數: ${bots.size}`,
                                type:ChannelType.GuildText,
                                parent: parent.id,
                                permissionOverwrites: [
                                    {
                                        id: interaction.guild.members.me.id,
                                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.SendMessages], //Allow permissions
                                      },{
                                          id: interaction.guild.roles.everyone.id,
                                          deny: [PermissionsBitField.Flags.SendMessages],
                                          allow: [PermissionsBitField.Flags.ViewChannel]
                                      }
                                ]
                            })
                            data = new Number({
                                guild: interaction.guild.id,
                                parent: parent.id,
                                memberNumber: membernumber_text.id,
                                memberNumber_name: interaction.guild.memberCount,
                                userNumber: usernumber_text.id,
                                userNumber_name: members,
                                BotNumber: botnumber_text.id,
                                BotNumber_name: bots.size,
                                channelnumber: null,
                                channelnumber_name: null,
                                textnumber: null,
                                textnumber_name: null,
                                voicenumber: null,
                                voicenumber_name: null,
                                categoriesnumber: null,
                                categoriesnumber_name: null,
                                rolesnumber: null,
                                rolesnumber_name: null,
                                rolenumber: null,
                                rolenumber_name: null,
                                norolenumber: null,
                                norolenumber_name: null,
                                emojisnumber: null, 
                                emojisnumber_name: null,
                                staticnumber: null,
                                staticnumber_name: null,
                                gifnumber: null,
                                gifnumber_name: null,
                                stickersnumber:null,
                                stickersnumber_name: null,
                                boostsnumber: null,
                                boostsnumber_name: null,
                                tier: null,
                                tier_name: null,
                                onlinenumber: null,
                                onlinenumber_name: null,
                                dndnumber: null,
                                dndnumber_name: null,
                                idlenumber: null,
                                idlenumber_name: null,
                                offlinenumber: null,
                                offlinenumber_name: null,
                                onlinebotnumber: null,
                                onlinebotnumber_name: null,
                                statusnumber: null,
                                statusnumber_name: null,
                            })
                            data.save()
                        break;
                    default:
                        break;
                }
                lodding.edit({embeds: [embed]})
            }else{
                const all_channel = interaction.guild.channels.cache.filter((c) => c.type !== "category").size;
                const text_channel_number = interaction.guild.channels.cache.filter((c) => c.type === "GUILD_TEXT").size;
                const voice_channel_number = interaction.guild.channels.cache.filter((c) => c.type === "voice").size;
                if(!member)return errors("由於你已經創建過了，所以你必須說明你要創建的統計名稱，或是刪除現有的統計資料(使用統計資料刪除)!")
                const parent_id = interaction.guild.channels.cache.get(data.parent) ? data.parent : null
                if(vt === "文字頻道"){
                    switch (member) {
                         //頻道數量 ===============================================================================================================
                        case "頻道數量":
                            if(data.channelnumber !== null )return errors("這個統計你已經創建過了!")
                            const botnumber_text = await interaction.guild.channels.create( {
                                name: `總頻道數: ${all_channel}`,
                                type:ChannelType.GuildText,
                                parent: parent_id,
                                permissionOverwrites: [
                                    {
                                        id: interaction.guild.members.me.id,
                                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.SendMessages], //Allow permissions
                                      },{
                                          id: interaction.guild.roles.everyone.id,
                                          deny: [PermissionsBitField.Flags.SendMessages],
                                          allow: [PermissionsBitField.Flags.ViewChannel]
                                      }
                                ]
                            })
                            data.collection.updateOne(({guild: interaction.guild.id,}), {$set: {channelnumber: `${botnumber_text.id}`}})
                            data.collection.updateOne(({guild: interaction.guild.id,}), {$set: {channelnumber_name: `${all_channel}`}})
                            interaction.followUp({embeds:[embed]})
                            break;
                            //文字頻道數量 ===============================================================================================================
                            case "文字頻道數量":
                            if(data.textnumber !== null )return errors("這個統計你已經創建過了!")
                            const text_channel = await interaction.guild.channels.create( {
                                name:`總文字頻道數: ${text_channel_number}`,
                                type:ChannelType.GuildText,
                                parent: parent_id,
                                permissionOverwrites: [
                                    {
                                        id: interaction.guild.members.me.id,
                                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.SendMessages], //Allow permissions
                                      },{
                                          id: interaction.guild.roles.everyone.id,
                                          deny: [PermissionsBitField.Flags.SendMessages],
                                          allow: [PermissionsBitField.Flags.ViewChannel]
                                      }
                                ]
                            })
                            data.collection.updateOne(({guild: interaction.guild.id,}), {$set: {textnumber: `${text_channel.id}`}})
                            data.collection.updateOne(({guild: interaction.guild.id,}), {$set: {textnumber_name: `${text_channel_number}`}})
                            interaction.followUp({embeds:[embed]})
                            break;
                            //文字頻道數量 ===============================================================================================================
                            case "語音頻道數量":
                            if(data.voicenumber !== null )return errors("這個統計你已經創建過了!")
                            const voice_channel = await interaction.guild.channels.create( {
                                name: `總語音頻道數: ${voice_channel_number}`,
                                type:ChannelType.GuildText,
                                parent: parent_id,
                                permissionOverwrites: [
                                    {
                                        id: interaction.guild.members.me.id,
                                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.SendMessages], //Allow permissions
                                      },{
                                          id: interaction.guild.roles.everyone.id,
                                          deny: [PermissionsBitField.Flags.SendMessages],
                                          allow: [PermissionsBitField.Flags.ViewChannel]
                                      }
                                ]
                            })
                            data.collection.updateOne(({guild: interaction.guild.id,}), {$set: {voicenumber: `${voice_channel.id}`}})
                            data.collection.updateOne(({guild: interaction.guild.id,}), {$set: {voicenumber_name: `${text_channel_number}`}})
                            interaction.followUp({embeds:[embed]})
                            break;
                        default:
                        return errors("沒有這項統計可以創建欸QQ")
                            break;
                    }
                }else if(vt === "語音頻道"){
                    switch (member) {
                        //頻道數量 ===============================================================================================================
                       case "頻道數量":
                           if(data.channelnumber !== null )return errors("這個統計你已經創建過了!")
                           const botnumber_text = await interaction.guild.channels.create( {
                            name: `總頻道數: ${all_channel}`,
                            type:ChannelType.GuildVoice,
                               parent: parent_id,
                               permissionOverwrites: [
                                {
                                    id: interaction.guild.members.me.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.Connect], //Allow permissions
                                  },{
                                      id: interaction.guild.roles.everyone.id,
                                      deny: [PermissionsBitField.Flags.Connect],
                                      allow: [PermissionsBitField.Flags.ViewChannel]
                                  }
                            ]
                           })
                           data.collection.updateOne(({guild: interaction.guild.id,}), {$set: {channelnumber: `${botnumber_text.id}`}})
                           data.collection.updateOne(({guild: interaction.guild.id,}), {$set: {channelnumber_name: `${all_channel}`}})
                           interaction.followUp({embeds:[embed]})
                           break;
                           //文字頻道數量 ===============================================================================================================
                           case "文字頻道數量":
                           if(data.textnumber !== null )return errors("這個統計你已經創建過了!")
                           const text_channel = await interaction.guild.channels.create( {
                            name: `總文字頻道數: ${text_channel_number}`,
                            type:ChannelType.GuildVoice,
                               parent: parent_id,
                               permissionOverwrites: [
                                {
                                    id: interaction.guild.members.me.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.Connect], //Allow permissions
                                  },{
                                      id: interaction.guild.roles.everyone.id,
                                      deny: [PermissionsBitField.Flags.Connect],
                                      allow: [PermissionsBitField.Flags.ViewChannel]
                                  }
                            ]
                           })
                           data.collection.updateOne(({guild: interaction.guild.id,}), {$set: {textnumber: `${text_channel.id}`}})
                           data.collection.updateOne(({guild: interaction.guild.id,}), {$set: {textnumber_name: `${text_channel_number}`}})
                           interaction.followUp({embeds:[embed]})
                           break;
                           //文字頻道數量 ===============================================================================================================
                           case "語音頻道數量":
                           if(data.voicenumber !== null )return errors("這個統計你已經創建過了!")
                           const voice_channel = await interaction.guild.channels.create( {
                            name: `總語音頻道數: ${voice_channel_number}`,
                            type:ChannelType.GuildVoice,
                               parent: parent_id,
                               permissionOverwrites: [
                                {
                                    id: interaction.guild.members.me.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.Connect], //Allow permissions
                                  },{
                                      id: interaction.guild.roles.everyone.id,
                                      deny: [PermissionsBitField.Flags.Connect],
                                      allow: [PermissionsBitField.Flags.ViewChannel]
                                  }
                            ]
                           })
                           data.collection.updateOne(({guild: interaction.guild.id,}), {$set: {voicenumber: `${voice_channel.id}`}})
                           data.collection.updateOne(({guild: interaction.guild.id,}), {$set: {voicenumber_name: `${text_channel_number}`}})
                           interaction.followUp({embeds:[embed]})
                           break;
                       default:
                        return errors("沒有這項統計可以創建欸QQ")
                           break;
                   }
                }
            }
        })


    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
}}