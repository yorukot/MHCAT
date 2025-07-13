const voice_xp_channel = require('../../models/voice_xp_channel.js');
const canvacord = require("canvacord")
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
 var validateColor = require("validate-color").default;
 function checkURL(image) {
    return(image.match(/\.(jpg|png)$/) != null);
}
module.exports = {
    name: '語音經驗設定',
    cooldown: 10,
    description: '設定語音經驗通知要在哪發送',
    options: [{
        name: '頻道',
        type: ApplicationCommandOptionType.Channel,
        description: '輸入頻道!',
        channel_types: [0,5],
        required: true
    },{
        name: '訊息',
        type: ApplicationCommandOptionType.String,
        description: '當有人升等的訊息，輸入:{level}為等級，{user}為tag使用者',
        required: false
    },{
        name: '顏色',
        type: ApplicationCommandOptionType.String,
        description: '輸入玩家查詢的主題要甚麼顏色(默認為白色)!',
        required: false
    },{
        name: '背景',
        type: ApplicationCommandOptionType.String,
        description: '輸入玩家查詢的背景(默認為discord色)支援png和jpg(可使用discord的複製連結)最佳大小為931*231',
        required: false
    }],
    video: 'https://docsmhcat.yorukot.me/docs/voice_xp_set',
    UserPerms: '訊息管理',
    emoji: `<:configuration:984010500608249886>`,
    run: async (client, interaction, options, perms) => {
        try {
            await interaction.deferReply();
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.editReply({embeds: [embed]})}
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const channel1 = interaction.options.getChannel("頻道")
        const color = interaction.options.getString("顏色")
        const message = interaction.options.getString("訊息")
        if(color){
            if (!validateColor(color)) return errors('你傳送的並不是顏色(色碼)')
        }
        
        const channel = channel1.id
        voice_xp_channel.findOne({
            guild: interaction.channel.guild.id,
        }, async (err, data) => {
            if(data) data.delete()
                data = new voice_xp_channel({
                    guild: interaction.channel.guild.id,
                    channel: channel,
                    color: color ? color : null,
                    message: message ? message : null,
                })
                data.save()
                const announcement_set_embed = new EmbedBuilder()
                .setTitle("語音經驗系統")
                .setDescription(`您的語音經驗升等頻道成功創建\n您目前的升等通知頻道為 ${channel1}`)
                .setColor("Green")
                interaction.editReply({embeds: [announcement_set_embed]})
                const lines = "<:line:992363971803881493>"
                if(message) interaction.channel.send(`以下為你的訊息預覽:\n${lines}我${lines}只${lines}是${lines}分${lines}隔${lines}線${lines}\n\n${message}`)   
        })

    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}