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
    name: '自動通知刪除',
    cooldown: 10,
    description: '刪除之前設定的自動通知',
    options: [{
        name: 'id',
        type: ApplicationCommandOptionType.String,
        description: '輸入要刪除的自動通知id!',
        required: true
    }],
    //video: 'https://docsmhcat.yorukot.me/docs/chat_xp_set',
    UserPerms: '訊息管理',
    emoji: `<:trashbin:995991389043163257>`,
    video: "https://youtu.be/D43zPrZU5Fw",
    run: async (client, interaction, options, perms) => {
        try {
            await interaction.deferReply();

            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red").setDescription(`<a:arrow_pink:996242460294512690> [點我前往教學網址](https://youtu.be/D43zPrZU5Fw)`);
                interaction.editReply({
                    embeds: [embed]
                })
            }
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
            const id = interaction.options.getString("id")
            cron_set.findOne({
                guild: interaction.guild.id,
                id: id
            }, async (err, data) => {
                if (!data) {
                    return errors("找不到這個id的自動通知，請使用`/自動通知列表`進行查詢")
                } else {
                    data.delete()
                    interaction.editReply({
                        embeds: [new EmbedBuilder()
                            .setTitle(client.emoji.done + "自動通知系統")
                            .setDescription(client.emoji.delete + "成功刪除該自動通知")
                            .setColor("Green")
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