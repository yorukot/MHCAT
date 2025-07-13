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
const voice_xp = require("../../models/voice_xp.js");
const text_xp = require("../../models/text_xp");
module.exports = {
    name: '經驗值重製',
    description: '重製整個伺服器的經驗',
    cooldown: 10,
    options: [{
        name: '聊天經驗重製',
        type: ApplicationCommandOptionType.Subcommand,
        description: '重製整個伺服器的聊天經驗',
    }, {
        name: '語音經驗重製',
        type: ApplicationCommandOptionType.Subcommand,
        description: '重製整個伺服器的語音經驗',
    }, {
        name: '重製個人語音經驗',
        type: ApplicationCommandOptionType.Subcommand,
        description: '重製某人的語音經驗',
        options: [{
            name: '使用者',
            type: ApplicationCommandOptionType.User,
            description: '選擇你要重製經驗的使用者!',
            required: true
        }]
    }, {
        name: '重製個人聊天經驗',
        type: ApplicationCommandOptionType.Subcommand,
        description: '重製某人的聊天經驗',
        options: [{
            name: '使用者',
            type: ApplicationCommandOptionType.User,
            description: '選擇你要重製經驗的使用者!',
            required: true
        }]
    }],
    UserPerms: '服主',
    //video: 'https://docsmhcat.yorukot.me/commands/statistics.html',
    emoji: `<:onehour:1000310711941087293>`,
    run: async (client, interaction, options, perms) => {
        try {
            await interaction.deferReply();
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed]
                })
            }
            if (interaction.member.id !== interaction.guild.ownerId) return errors("你必須擁有\`服主\`才能使用")
            if (interaction.options.getSubcommand() === "重製個人聊天經驗") {
                const get_member = interaction.options.getUser("使用者")
                const member = get_member ? get_member : interaction.user
                text_xp.findOne({
                    guild: interaction.guild.id,
                    member: member.id,
                }, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        errors("這位使用者還沒有任何的經驗值喔!")
                    } else {
                        data.delete()
                        interaction.editReply(`${client.emoji.done} | 成功清除<@${member.id}>的聊天經驗`)
                    }
                })
            }else if (interaction.options.getSubcommand() === "重製個人語音經驗") {
                const get_member = interaction.options.getUser("使用者")
                const member = get_member ? get_member : interaction.user
                voice_xp.findOne({
                    guild: interaction.guild.id,
                    member: member.id,
                }, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        errors("這位使用者還沒有任何的經驗值喔!")
                    } else {
                        data.delete()
                        interaction.editReply(`${client.emoji.done} | 成功清除<@${member.id}>的語音經驗`)
                    }
                })
            }else if (interaction.options.getSubcommand() === "聊天經驗重製") {
                interaction.editReply({
                    content: ":warning: | 一但刪除，___**將無法復原**___，如確定要還原請於60秒內輸入\`^確認^\`(只有一次機會)!!!"
                });
                const filter = m => (m.member.id === interaction.member.id);
                const collector = interaction.channel.createMessageCollector({
                    filter,
                    max: 1,
                    time: 60000
                })
                collector.on('collect', m => {
                    function mmmmm(content) {
                        const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                        m.reply({
                            embeds: [embed]
                        })
                    }
                    if (m.content !== "^確認^") return mmmmm("你輸入了錯誤的確認!因此視為取消還原")
                    text_xp.find({
                        guild: interaction.guild.id,
                    }, async (err, data) => {
                        if (err) throw err;
                        if (!data) {
                            return errors('伺服器沒有任何聊天經驗的資料!')
                        }else{
                            for (let i = 0; i < data.length; i++){
                                data[i].delete();
                            }
                            return m.reply({
                                embeds: [
                                    new EmbedBuilder()
                                    .setTitle(client.emoji.delete + "成功刪除伺服器內所有聊天經驗")
                                    .setColor(client.color.greate)
                                ],
                            })
                        }
                })
                });
            } else if (interaction.options.getSubcommand() === "語音經驗重製") {
                interaction.editReply({
                    content: ":warning: | 一但刪除，___**將無法復原**___，如確定要還原請於60秒內輸入\`^確認^\`(只有一次機會)!!!"
                });
                const filter = m => (m.member.id === interaction.member.id);
                const collector = interaction.channel.createMessageCollector({
                    filter,
                    max: 1,
                    time: 60000
                })
                collector.on('collect', m => {
                    function mmmmm(content) {
                        const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                        m.reply({
                            embeds: [embed]
                        })
                    }
                    if (m.content !== "^確認^") return mmmmm("你輸入了錯誤的確認!因此視為取消還原")
                    voice_xp.find({
                        guild: interaction.guild.id,
                    }, async (err, data) => {
                        if (err) throw err;
                        if (data.length === 0) {
                            return errors('伺服器沒有任何語音經驗的資料!')
                        }else{
                            for (let i = 0; i < data.length; i++){
                                data[i].delete();
                            }
                            return m.reply({
                                embeds: [
                                    new EmbedBuilder()
                                    .setTitle(client.emoji.delete + "成功刪除伺服器內所有語音經驗")
                                    .setColor(client.color.greate)
                                ],
                            })
                        }
                })
                });
            }
        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}