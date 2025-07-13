const cron_set = require('../../models/cron_set.js');
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

function checkURL(image) {
    return (image.match(/\.(jpg|png)$/) != null);
}
module.exports = {
    name: '自動通知列表',
    cooldown: 10,
    description: '查看所有的自動通知列表',
    //video: 'https://docsmhcat.yorukot.me/docs/chat_xp_set',
    UserPerms: '訊息管理',
    emoji: `<:list:992002476360343602>`,
    video: "https://youtu.be/D43zPrZU5Fw",
    run: async (client, interaction, options, perms) => {
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red").setDescription(`<a:arrow_pink:996242460294512690> [點我前往教學網址](https://youtu.be/D43zPrZU5Fw)`);
                interaction.reply({
                    embeds: [embed]
                })
            }
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
            cron_set.find({
                guild: interaction.guild.id,
            }, async (err, data) => {
                if (!data) {
                    return errors("你還沒有設定過自動通知喔!")
                } else {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].cron === null) data[i].delete()
                    }
                    const e = data.map(
                        (w, i) => `\n**❰${i + 1}❱ id:\`${w.id}\` cron設定:\`${w.cron}\` 頻道:**<#${w.channel}>`
                    )
                    interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setTitle(`<:list:992002476360343602> 以下是${interaction.guild.name}的所有自動通知id`)
                            .setDescription(`輸入\`/自動通知刪除 id\`可進行刪除之前設定的自動通知\n${e.join(" ")}`)
                            .setColor("Random")
                        ]
                    })
                }
            })

        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}