const chat = require('../../models/chat.js');
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
    name: '自動聊天頻道',
    cooldown: 10,
    description: '設定自動聊天頻道要在哪裡發送',
    options: [{
        name: '頻道',
        type: ApplicationCommandOptionType.Channel,
        description: '輸入頻道!',
        channel_types: [0,5],
        required: true
    }],
    video: 'https://docsmhcat.yorukot.me/docs/chat_xp_set',
    UserPerms: '訊息管理',
    emoji: `<:configuration:984010500608249886>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply();
        try {

        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.editReply({embeds: [embed]})}
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const channel1 = interaction.options.getChannel("頻道")
        const channel = channel1.id
        chat.findOne({
            guild: interaction.channel.guild.id,
        }, async (err, data) => {
            if(data) data.delete();
                data = new chat({
                    guild: interaction.channel.guild.id,
                    channel: channel,
                })
                data.save()
                const announcement_set_embed = new EmbedBuilder()
                .setTitle("自動聊天系統")
                .setDescription(`您的自動聊天頻道成功創建\n您目前的自動聊天頻道為 ${channel1}`)
                .setColor("Green")
                interaction.editReply({embeds: [announcement_set_embed]})
            
        })

    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}