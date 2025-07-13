const coin = require("../../models/coin.js");
const gift_change = require("../../models/gift_change.js");
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
    name: '簽到列表',
    cooldown: 10,
    description: '查看今天有誰簽到了',
    video: 'https://docsmhcat.yorukot.me/docs/snig',
    emoji: `<:sign:997374180632825896>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply();
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            coin.find({
                guild: interaction.guild.id,
            }, async (err, data) => {
                if (!data) {
                    return errors("沒有人有簽到過!")
                } else {
                    let array = []
                    gift_change.findOne({
                        guild: interaction.guild.id,
                    }, async (err, data1111) => {
                    if(data1111 && data1111.time !== 0){
                        for (let i = 0; i < data.length; i++) {
                            if (((Math.round(Date.now() / 1000) - data[i].today) < (data1111 ? data1111.time ? data1111.time : 86400 : 86400)) && ((Math.round(Date.now() / 1000) - data[i].today) > 0)) {
                                array.push({
                                    id: data[i].member,
                                    time: timeConverter(data[i].today)
                                })
                            }
                        }
                        const e = array.map(
                            (w, i) => `${interaction.guild.members.cache.get(w.id) ? interaction.guild.members.cache.get(w.id).user.username + '#' + interaction.guild.members.cache.get(w.id).user.discriminator : '使用者已消失!'}`
                        )
    
                        function timeConverter(UNIX_timestamp) {
                            const date = new Date(UNIX_timestamp * 1000);
                            const options = { formatMatcher: 'basic',timeZone: 'Asia/Taipei', timeZoneName: 'long', year:'numeric', month:"2-digit", day:"2-digit", hour12: false };
                            return date.toLocaleTimeString('zh-TW', options)
                        }
    
                        const b = array.map(
                            (w, i) => `${interaction.guild.members.cache.get(w.id) ? interaction.guild.members.cache.get(w.id).user.username + '#' + interaction.guild.members.cache.get(w.id).user.discriminator : '使用者已消失!'}(id:${w.id})簽到時間:${w.time}`
                        )
                        const match = array.find(element => {
                            if (element.id.includes(interaction.user.id)) {
                                return true;
                            } else {
                                return false;
                            }
                        });
                        let atc = new AttachmentBuilder(Buffer.from(`${b.join(`\n`)}`), {
                            name: 'discord.txt'
                        });
                        const embed = new EmbedBuilder()
                            .setTitle(`簽到人數資訊`)
                            .setDescription(`<:list:992002476360343602>**目前共有**\`${e.length}\`**人已經簽到**\n<:star:987020551698649138>**您是否有簽到:**${match ? '\`有\`' : '\`沒有\`'}\n\n${e.length < 100 ? '┃ ' + '' + e.join(' ┃ ') + '┃' : "**由於人數過多，無法顯示所有成員名稱!\n請使用\`.txt\`檔案觀看**"}`)
                            .setColor("Random")
                        interaction.editReply({
                            embeds: [embed],
                            files: [atc]
                        })
                    }else{
                        for (let i = 0; i < data.length; i++) {
                            if (data[i].today === 1) {
                                array.push({
                                    id: data[i].member,
                                })
                            }
                        }
                        const e = array.map(
                            (w, i) => `${interaction.guild.members.cache.get(w.id) ? interaction.guild.members.cache.get(w.id).user.username + '#' + interaction.guild.members.cache.get(w.id).user.discriminator : '使用者已消失!'}`
                        )
    
                        const b = array.map(
                            (w, i) => `${interaction.guild.members.cache.get(w.id) ? interaction.guild.members.cache.get(w.id).user.username + '#' + interaction.guild.members.cache.get(w.id).user.discriminator : '使用者已消失!'}(id:${w.id})`
                        )
                        const match = array.find(element => {
                            if (element.id.includes(interaction.user.id)) {
                                return true;
                            } else {
                                return false;
                            }
                        });
                        let atc = new AttachmentBuilder(Buffer.from(`${b.join(`\n`)}`), {
                            name: 'discord.txt'
                        });
                        const embed = new EmbedBuilder()
                            .setTitle(`簽到人數資訊`)
                            .setDescription(`<:list:992002476360343602>**目前共有**\`${e.length}\`**人已經簽到**\n<:star:987020551698649138>**您是否有簽到:**${match ? '\`有\`' : '\`沒有\`'}\n\n${e.length < 100 ? '┃ ' + '' + e.join(' ┃ ') + '┃' : "**由於人數過多，無法顯示所有成員名稱!\n請使用\`.txt\`檔案觀看**"}`)
                            .setColor("Random")
                        interaction.editReply({
                            embeds: [embed],
                            files: [atc]
                        })
                    }
                    
                })
                    
                }
            })
        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}