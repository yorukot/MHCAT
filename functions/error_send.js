const chalk = require(`chalk`);
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require(`discord.js`);
const error_send = (error, interaction) => {
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setURL("https://discord.gg/7g7VE2Sqna")
            .setStyle(ButtonStyle.Link)
            .setLabel("支援伺服器")
            .setEmoji("<:customerservice:986268421144592415>"),
            new ButtonBuilder()
            .setURL("https://mhcat.yorukot.me")
            .setEmoji("<:worldwideweb:986268131284627507>")
            .setStyle(ButtonStyle.Link)
            .setLabel("官方網站")
        );

    return interaction.channel.send({
        embeds: [new EmbedBuilder()
            .setTitle("<a:Discord_AnimatedNo:1015989839809757295> | 很抱歉，出現了錯誤!")
            .setDescription("**如果可以的話再麻煩幫我到支援伺服器回報w**" + `\n\`\`\`${error}\`\`\`\n常見錯誤:\n\`Missing Access\`:**沒有權限**\n\`Missing Permissions\`:**沒有權限**`)
            .setColor("Red")
        ],
        components: [row]
    })
}
module.exports = error_send;

