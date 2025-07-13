const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const logging = require('../../models/logging.js');
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
    name: '刪除資料',
    cooldown: 10,
    description: '刪除之前設置過的資料',
    //video: 'https://docsmhcat.yorukot.me/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:logfile:985948561625710663>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply().catch(e => {});
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)

            let id = `delete-data`;

            let menus = [];

            const emo = [
                "加入訊息",
                "離開訊息",
                "審核日誌",
                "統計系統",
                "自動聊天",
                "驗證設置",
                "聊天經驗設置",
                "語音經驗設置",
                "私人頻道設置",
            ]
            const emoji = {
                加入訊息: "<:joines:953970547849592884>",
                離開訊息: "<:leaves:956444050792280084>",
                審核日誌: "<:logfile:985948561625710663>",
                統計系統: "<:statistics:986108146747600928>",
                聊天經驗設置: "<:xp:990254386792005663>",
                語音經驗設置: "<:Voice:994844272790610011>",
                自動聊天: "<:ChatBot:956863473910947850>",
                驗證設置: "<:tickmark:985949769224556614>",
                私人頻道設置: "<:ticket:985945491093205073>",
            }

            emo.forEach(cca => {
                return menus.push({
                    label: cca,
                    description: `🗑 ${cca} 刪除!`,
                    value: `${cca}`,
                    emoji: emoji[cca],
                })
            });
            const row = new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                    .setCustomId(id)
                    .setPlaceholder(`🗑 選擇你要刪除的資料!`)
                    .addOptions(menus)
                )
            interaction.followUp({
                    embeds: [new EmbedBuilder()
                        .setTitle("<:trashbin:995991389043163257> 刪除資料")
                        .setDescription("<a:NukeExplosion:986558305885368321>這邊刪除的都是全刪!!!\n<:warning:985590881698590730> 一但刪除將__**無法復原**__，請三思!\n<:warning:985590881698590730> 一但刪除將__**無法復原**__，請三思!")
                        .setColor("Random")
                        .setFooter({
                            text: "請三思!!!",
                            iconURL: "https://media.discordapp.net/attachments/991337796960784424/996749656161779853/6lnjr0.gif"
                        })
                        .setThumbnail("https://media.discordapp.net/attachments/991337796960784424/996749656161779853/6lnjr0.gif")
                    ],
                    components: [row]
                })
                .then((message) => {
                    const filter =  (interaction01) => {
                        return (interaction01.user.id === interaction.user.id)
                    };
                    const collector = message.createMessageComponentCollector({
                        filter,
                        componentType: 3,
                        time: 60 * 60 * 1000
                    });
                    collector.on("collect", async (interaction011) => {

                        await interaction011.deferReply().catch(e => {});
                        const id = interaction011.values[0]
                        switch (id) {
                            case "加入訊息":
                                const join_data = require('../../models/join_message.js')
                                join_data.findOne({
                                    guild: interaction.guild.id,
                                }, async (err, data) => {
                                    if (!data || data.length === 0) return interaction011.editReply({
                                        content: "<a:Discord_AnimatedNo:1015989839809757295> **| 你沒有設定過這個選項!**",
                                        ephemeral: true
                                    });
                                    if (data) data.delete();
                                    return interaction011.editReply({
                                            content: client.emoji.done + " **| 成功刪除該設定!**",
                                            ephemeral: true
                                    });
                                })
                                break
                            case "離開訊息":
                                const leave_data = require('../../models/leave_message.js')
                                leave_data.findOne({
                                    guild: interaction.guild.id,
                                }, async (err, data) => {
                                    if (!data) return interaction011.editReply({
                                        content: "<a:Discord_AnimatedNo:1015989839809757295> **| 你沒有設定過這個選項!**",
                                        ephemeral: true
                                    });
                                    if (data) data.delete();
                                    return interaction011.editReply({
                                        content: client.emoji.done + " **| 成功刪除該設定!**",
                                        ephemeral: true
                                    });
                                })
                                break
                            case "審核日誌":
                                const logging = require('../../models/logging.js')
                                logging.findOne({
                                    guild: interaction.guild.id,
                                }, async (err, data) => {
                                    if (!data) return interaction011.editReply({
                                        content: "<a:Discord_AnimatedNo:1015989839809757295> **| 你沒有設定過這個選項!**",
                                        ephemeral: true
                                    });
                                    if (data) data.delete();
                                    return interaction011.editReply({
                                        content: client.emoji.done + " **| 成功刪除該設定!**",
                                        ephemeral: true
                                    });
                                })
                                break
                            case "統計系統":
                                const number = require('../../models/number.js')
                                number.findOne({
                                    guild: interaction.guild.id,
                                }, async (err, data) => {
                                    if (!data) return interaction011.editReply({
                                        content: "<a:Discord_AnimatedNo:1015989839809757295> **| 你沒有設定過這個選項!**",
                                        ephemeral: true
                                    });
                                    if (data) data.delete();
                                    return interaction011.editReply({
                                        content: client.emoji.done + " **| 成功刪除該設定!**",
                                        ephemeral: true
                                    });
                                })
                                break
                            case "自動聊天":
                                const chat = require('../../models/chat.js')
                                chat.findOne({
                                    guild: interaction.guild.id,
                                }, async (err, data) => {
                                    if (!data) return interaction011.editReply({
                                        content: "<a:Discord_AnimatedNo:1015989839809757295> **| 你沒有設定過這個選項!**",
                                        ephemeral: true
                                    });
                                    if (data) data.delete();
                                    return interaction011.editReply({
                                        content: client.emoji.done + " **| 成功刪除該設定!**",
                                        ephemeral: true
                                    });
                                })
                                break
                            case "驗證設置":
                                const verification = require('../../models/verification.js')
                                verification.findOne({
                                    guild: interaction.guild.id,
                                }, async (err, data) => {
                                    if (!data) return interaction011.editReply({
                                        content: "<a:Discord_AnimatedNo:1015989839809757295> **| 你沒有設定過這個選項!**",
                                        ephemeral: true
                                    });
                                    if (data) data.delete();
                                    return interaction011.editReply({
                                        content: client.emoji.done + " **| 成功刪除該設定!**",
                                        ephemeral: true
                                    });
                                })
                                break
                            case "聊天經驗設置":
                                const text_xp_channel = require('../../models/text_xp_channel.js')
                                text_xp_channel.findOne({
                                    guild: interaction.guild.id,
                                }, async (err, data) => {
                                    if (!data) return interaction011.editReply({
                                        content: "<a:Discord_AnimatedNo:1015989839809757295> **| 你沒有設定過這個選項!**",
                                        ephemeral: true
                                    });
                                    if (data) data.delete();
                                    return interaction011.editReply({
                                        content: client.emoji.done + " **| 成功刪除該設定!**",
                                        ephemeral: true
                                    });
                                })
                                break
                            case "語音經驗設置":
                                const voice_xp_channel = require('../../models/voice_xp_channel.js')
                                voice_xp_channel.findOne({
                                    guild: interaction.guild.id,
                                }, async (err, data) => {
                                    if (!data) return interaction011.editReply({
                                        content: "<a:Discord_AnimatedNo:1015989839809757295> **| 你沒有設定過這個選項!**",
                                        ephemeral: true
                                    });
                                    if (data) data.delete();
                                    return interaction011.editReply({
                                        content: client.emoji.done + " **| 成功刪除該設定!**",
                                        ephemeral: true
                                    });
                                })
                                break
                            case "私人頻道設置":
                                const ticket = require('../../models/ticket.js')
                                ticket.findOne({
                                    guild: interaction.guild.id,
                                }, async (err, data) => {
                                    if (!data) return interaction011.editReply({
                                        content: "<a:Discord_AnimatedNo:1015989839809757295> **| 你沒有設定過這個選項!**",
                                        ephemeral: true
                                    });
                                    if (data) data.delete();
                                    return interaction011.editReply({
                                        content: client.emoji.done + " **| 成功刪除該設定!**",
                                        ephemeral: true
                                    });
                                })
                                break
                            default:
                                break;
                        }
                    });
                    collector.on("end", () => null);
                })
        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}