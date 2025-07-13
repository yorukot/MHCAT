const message_reaction = require("../../models/message_reaction.js");
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
    name: '選取身分組刪除-表情符號',
    cooldown: 10,
    description: '選取身分組刪除-表情符號版(進行刪除)',
    options: [{
        name: '訊息url',
        type: ApplicationCommandOptionType.String,
        description: '輸入訊息的url(對訊息點右鍵按複製訊息連結)!',
        required: true,
    },{
        name: '表情符號',
        type: ApplicationCommandOptionType.String,
        description: '請輸入要放在訊息下面的表情符號',
        required: true,
    }],
    //video: 'https://docsmhcat.yorukot.me/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:add:985948803469279303>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply();
        try {
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.editReply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const emoji = interaction.options.getString("表情符號")
        const url = interaction.options.getString("訊息url") + "{"
        if(!url.includes("https://discord.com/channels/")) return errors('你輸入的不是一個訊息連結')
        var aa = url.replace("https://discord.com/channels/", '')
        var channel1 = aa.substring(aa.indexOf("/") + 1, aa.lastIndexOf("/"));
        var messageaa = aa.substring(aa.indexOf("/") + 1, aa.lastIndexOf("{"));
        var message1 = messageaa + "{"
        var message2 = message1.substring(message1.indexOf("/") + 1, message1.lastIndexOf("{"));
        const channel = interaction.guild.channels.cache.get(channel1)
        if(!channel)return errors("很抱歉，找不到這個訊息")
        const message = channel.messages.fetch({ message: message2, cache: false, force: true })
        .then(message32 => {
            if(!message32)return errors("很抱歉，找不到這個訊息")
            message32.react(emoji)
        message_reaction.findOne({
            guild: interaction.guild.id,
            message: message32.id,
            react: emoji,
        }, async (err, data) => {
            if (err) throw err; 
            if(!data) return errors("這個表情符號沒有在這個訊息上設定")
            if(data) data.delete();
            const embed = new EmbedBuilder()
            .setTitle("表情符號選取身分組成功刪除")
            .setColor("Green")
            interaction.editReply({embeds:[embed]})
            return
        })
    })

} catch (error) {
    const error_send= require('../../functions/error_send.js')
    error_send(error, interaction)
}
}}