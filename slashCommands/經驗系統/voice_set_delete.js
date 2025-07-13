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
module.exports = {
    name: '語音經驗刪除',
    cooldown: 10,
    description: '刪除語音發送訊息設置',
    video: 'https://docsmhcat.yorukot.me/docs/voice_xp_delete',
    UserPerms: '訊息管理',
    emoji: `<:delete:985944877663678505>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply();
        try {
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.editReply({embeds: [embed]})}
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))return errors(`你需要有\`${perms}\`才能使用此指令`)
        voice_xp_channel.findOne({
            guild: interaction.channel.guild.id,
        }, async (err, data) => {
            if(data){
                data.delete();
                const announcement_set_embed = new EmbedBuilder()
                .setTitle("語音經驗系統")
                .setDescription(`成功刪除!`)
                .setColor("Green")
                interaction.editReply({embeds: [announcement_set_embed]})
            }else{
                errors("你本來就沒有對語音經驗設定喔!")
            }
        })
        

    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}