const chalk = require(`chalk`);
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require(`discord.js`);

function errors_edit(interaction, content, url) {
    const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red").setDescription(url ? `<:MHCATdarkdsadsadsadsadsadas1:1079853990541529208> [立即前往官方文檔查看問題](https://docsmhcat.yorukot.me/${ url === 'role_high' ? 'MHCAT/bug#%E8%BA%AB%E5%88%86%E7%B5%84%E4%BD%8D%E9%9A%8E%E8%AA%BF%E9%AB%98%E6%98%AF%E7%94%9A%E9%BA%BC%E6%84%8F%E6%80%9D' : url})`: '')
    interaction.editReply({
        embeds: [embed]
    })
}

function errors_update(interaction, content, url) {
    const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red").setDescription(url ? `<:MHCATdarkdsadsadsadsadsadas1:1079853990541529208> [立即前往官方文檔查看問題](https://docsmhcat.yorukot.me/${ url === 'role_high' ? 'MHCAT/bug#%E8%BA%AB%E5%88%86%E7%B5%84%E4%BD%8D%E9%9A%8E%E8%AA%BF%E9%AB%98%E6%98%AF%E7%94%9A%E9%BA%BC%E6%84%8F%E6%80%9D' : url})`: '')
    interaction.update({
        embeds: [embed],
        components: []
    })
}

function errors_reply(interaction, content, url) {
    const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red").setDescription(url ? `<:MHCATdarkdsadsadsadsadsadas1:1079853990541529208> [立即前往官方文檔查看問題](https://docsmhcat.yorukot.me/${ url === 'role_high' ? 'MHCAT/bug#%E8%BA%AB%E5%88%86%E7%B5%84%E4%BD%8D%E9%9A%8E%E8%AA%BF%E9%AB%98%E6%98%AF%E7%94%9A%E9%BA%BC%E6%84%8F%E6%80%9D' : url})`: '')
    interaction.reply({
        embeds: [embed],
        components: []
    })
}

module.exports = {errors_edit, errors_update, errors_reply};

