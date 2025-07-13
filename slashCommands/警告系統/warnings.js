
const warndb = require('../../models/warndb')
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
    name: '警告紀錄',
    cooldown: 10,
    description: '收尋一位使用者的警告',
    options: [{
        name: '使用者',
        type: ApplicationCommandOptionType.User,
        description: '要收尋的使用者!',
        required: true,
    }],
    //video: 'https://docsmhcat.yorukot.me/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:searching:986107902777491497>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply();
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.editReply({embeds: [embed],ephemeral: true})}
        const user1 = interaction.options.getUser("使用者") 
        const user = user1 ? user1 : interaction.member.user
        warndb.findOne({
            guild: interaction.guild.id, 
            user: user.id
        }, async (err, data) => {
            if (err) throw err
            if (data) {
                const array = []
                if(data.content.length === 0){
                    return errors("這位使用者沒有任何警告!")
                }
                const e = data.content.map(
                    (w, i) => `\n${i + 1} \`\`\`- 警告者: ${interaction.guild.members.cache.get(w.moderator).user.tag}\n- 原因: ${w.reason}\n- 時間: ${w.time}\`\`\``
                )
                const embed = new EmbedBuilder()
                    .setTitle(`以下是${user.username}的警告紀錄`)
                    .setDescription(e.join(' '))
                    .setColor("Random")
                interaction.editReply({
                    embeds: [embed]
                })
            } else {
                errors("這位使用者沒有任何警告!")
            }
        })
    }
}