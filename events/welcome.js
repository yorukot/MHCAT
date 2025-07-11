const client = require('../index');
const join_role = require('../models/join_role.js')
const join_message = require("../models/join_message.js")
const leave_message = require('../models/leave_message.js')
const create_hours = require('../models/create_hours.js')
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
  Permissions,
  WebhookClient
} = require('discord.js');
const {
  values
} = require('lodash');
const joinWebhook = new WebhookClient({
  url: process.env.JOIN_WEBHOOK
})
const leaveWebhook = new WebhookClient({
  url: process.env.LEAVE_WEBHOOK
})

client.on("guildMemberAdd", (member) => {
  create_hours.findOne({
    guild: member.guild.id,
  }, async (err, data11111) => {
      if (data11111 && ((Math.round(Date.now()) - member.user.createdTimestamp) / 1000 < Number(data11111.hours))) {
        member.send({
          embeds: [
            new EmbedBuilder()
            .setColor(client.color.error)
            .setTitle("<a:warn:1000814885506129990> | 帳號創建時數過低!")
            .setDescription(`由於你帳號創建時數低於該伺服器所設定的時數\n已將您踢出\`${member.guild.name}\`，如有問題請詢問該服服主\n\nSince your account creation hours are lower than the hours set by the server\nyou have been kicked out of \`${member.guild.name}\` .\nIf you have any questions, please ask the server owner`)
            .setFooter({
              text: `管理員所設定時間: ${Number(data11111.hours) / 60 / 60} 小時`,
              iconURL: member.user.displayAvatarURL({
                dynamic: true
              })
            })
          ]
        })
        member.kick("你的創建時數低於管理員所設定的時數 Your creation time is lower than the time set by the administrator")
        const channel = member.guild.channels.cache.get(`${data11111.channel}`)
        if (!channel) return
        channel.send({
          embeds: [
            new EmbedBuilder()
            .setTitle("低於管理員所設定的時數")
            .setFields({
              name: "該使用者帳號創建時間:",
              value: `<t:${Math.round(member.user.createdTimestamp / 1000)}>`
            })
            .setThumbnail(member.user.displayAvatarURL({
              dynamic: true
            }))
            .setFooter({
              text: `BAN:${member.user.tag}`,
              iconURL: member.user.displayAvatarURL({
                dynamic: true
              })
            })
            .setColor("Random")
          ]
        })
      } else {
        join_role.find({
          guild: member.guild.id,
        }, async (err, data) => {
          if (!data) return
          for (x = data.length - 1; x > -1; x--) {
            if ((data[x].give_to_who === 'all_user') || (!data[x].give_to_who)) {
              let role = member.guild.roles.cache.get(data[x].role)
              if (!role) return
              const owner = await member.guild.fetchOwner();
              if (Number(role.position) >= Number(member.guild.members.me.roles.highest.position)) return owner.send("很抱歉，我沒有權限給他加入的成員身分組\n麻煩請將我的身份組位階調高!\n身分組:<@" + role.id + ">")
              member.roles.add(role)
            } else if (data[x].give_to_who === 'all_bot') {
              if (!member.user.bot) return
              let role = member.guild.roles.cache.get(data[x].role)
              if (!role) return
              const owner = await member.guild.fetchOwner();
              if (Number(role.position) >= Number(member.guild.members.me.roles.highest.position)) return owner.send("很抱歉，我沒有權限給他加入的成員身分組\n麻煩請將我的身份組位階調高!\n身分組:<@" + role.id + ">")
              member.roles.add(role)
            } else if (data[x].give_to_who === 'all_member') {
              if (member.user.bot) return
              let role = member.guild.roles.cache.get(data[x].role)
              if (!role) return
              const owner = await member.guild.fetchOwner();
              if (Number(role.position) >= Number(member.guild.members.me.roles.highest.position)) return owner.send("很抱歉，我沒有權限給他加入的成員身分組\n麻煩請將我的身份組位階調高!\n身分組:<@" + role.id + ">")
              member.roles.add(role)
            }
          }
        })
        if (member.guild.id === "976879837471973416") {
          if (client.user.id !== '964185876559196181') return
          const channel = member.guild.channels.cache.get("977248106234142810")
          const welcome = new EmbedBuilder()
            .setAuthor({
              name: '🪂 歡迎加入 MHCAT!',
              iconURL: `${member.guild.members.me.displayAvatarURL({dynamic: true})}`,
              url: 'https://dsc.gg/MHCAT'
            })
            .setDescription(`**<:welcome:978216428794679336> 歡迎 __${member.user.username}#${member.user.discriminator}__ 的加入!
:speech_balloon: <#979307778524979201>想要聊天的話歡迎到這裡!
<:help:985948179709186058> <#1019746253652901889>對指令有問題都可以到這邊問喔!
👾 <#1019763726213201920>有任何bug歡迎到這邊回報!
    
如果有建議或試任何的問題或想法歡迎到\n<#978218954600374272>開啟客服頻道**
    
也祝你在這個伺服器內有個美好的回憶~
        `)
            .setThumbnail(member.displayAvatarURL({
              dynamic: true
            }))
            .setImage('https://i.imgur.com/cLCPRNq.png')
            .setColor("Random")
            .setTimestamp()
          channel.send({
            embeds: [welcome]
          })
        } else {
          join_message.findOne({
            guild: member.guild.id,
          }, async (err, data) => {
            if (!data) return
              if(data.enable === false) return
              const channel = member.guild.channels.cache.get(data.channel)
              if (!channel) return
              const MEMBER = member.user.username
              const content = data.message_content
              if (!content) return
              const adsadsa = content.replace("(MEMBERNAME)", MEMBER).replace("{MEMBERNAME}", MEMBER).replace("{membername}", MEMBER)
              const messageaaa = adsadsa.replace("(TAG)", `<@${member.user.id}>`).replace("{TAG}", `<@${member.user.id}>`).replace("{tag}", `<@${member.user.id}>`)
              const welcome = new EmbedBuilder()
                .setAuthor({
                  name: `🪂 歡迎加入 ${member.guild.name}`,
                  iconURL: `${member.guild.iconURL() === null ? member.guild.members.me.displayAvatarURL({dynamic: true}) : member.guild.iconURL()}`
                })
                .setDescription(messageaaa)
                .setThumbnail(member.displayAvatarURL({
                  dynamic: true
                }))
                .setColor(data.color === 'RANDOM' ? 'Random' : data.color)
                .setImage(data.img ? data.img : null)
                .setTimestamp()
              channel.send({
                embeds: [welcome],
              });
          })
        }
      }
  })
});

client.on("guildMemberRemove", (member) => {
  leave_message.findOne({
    guild: member.guild.id,
  }, async (err, data) => {
    if (!data) {
      return
    } else {
      const channel = member.guild.channels.cache.get(data.channel)
      if (!channel) return
      const MEMBER = member.user.username
      const id1111111 = member.user.id
      const content = data.message_content
      if (!content) return
      const welcome = new EmbedBuilder()
        .setTitle(`${data.title}`)
        .setDescription(content.replace("(MEMBERNAME)", MEMBER).replace("(ID)", id1111111).replace("{ID}", id1111111).replace("{MEMBERNAME}", MEMBER))
        .setThumbnail(member.displayAvatarURL({
          dynamic: true
        }))
        .setColor(data.color === 'RANDOM' ? 'Random' : data.color)
        .setTimestamp()
      channel.send({
        embeds: [welcome],
      });
    }
  })
});
client.on("guildCreate", async (guild) => {
  let embed = new EmbedBuilder()
    .setAuthor({
      name: `${client.user.username}#${client.user.discriminator} | ${client.user.id}`,
      iconURL: client.user.displayAvatarURL()
    })
    .setDescription(`<:joins:956444030487642112> 我加入了 ${guild.name}！`)
    .addFields({
      name: '伺服器ID',
      value: `\`${guild.id}\``,
      inline: true
    }, {
      name: '伺服器擁有者',
      value: `<@${guild.ownerId}> (\`${guild.ownerId}\`)`,
      inline: true
    }, {
      name: "伺服器使用者數量",
      value: `${guild.memberCount}`,
      inline: true
    })
    .setColor("#2f3136")
  joinWebhook.send({
    embeds: [embed]
  })
});

client.on("guildDelete", async (guild) => {
  let embed = new EmbedBuilder()
    .setAuthor({
      name: `${client.user.username}#${client.user.discriminator} | ${client.user.id}`,
      iconURL: client.user.displayAvatarURL()
    })
    .setDescription(`<:leaves:956444050792280084> 我離開了 ${guild.name}！`)
    .addFields({
      name: '伺服器ID',
      value: `\`${guild.id}\``,
      inline: true
    }, {
      name: '伺服器擁有者',
      value: `<@${guild.ownerId}> (\`${guild.ownerId}\`)`,
      inline: true
    }, {
      name: "伺服器使用者數量",
      value: `${guild.memberCount}`,
      inline: true
    })
    .setColor("#2f3136")
  leaveWebhook.send({
    embeds: [embed]
  })
});