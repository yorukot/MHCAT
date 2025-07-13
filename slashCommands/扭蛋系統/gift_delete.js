const gift = require("../../models/gift.js");
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
const { errorMonitor } = require("ws");
module.exports = {
    name: '扭蛋獎池刪除',
    cooldown: 10,
    description: '刪除扭蛋的獎池',
    options: [{
        name: '獎品名稱',
        type: ApplicationCommandOptionType.String,
        description: '輸入這個獎品叫甚麼，以及簡單概述',
        required: true,
    }],
    video: 'https://docsmhcat.yorukot.me.xyz/docs/prize_removal',
    emoji: `<:trashbin:995991389043163257>`,
    UserPerms: '訊息管理',
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply();
        try{
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.editReply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const gift_name = interaction.options.getString("獎品名稱")
        gift.findOne({
            guild: interaction.guild.id,
            gift_name: gift_name,
            }, async (err, data) => {
                if(!data){
                    return errors("找不到這個獎品!")
                }else{
                    data.delete()
                    return interaction.editReply({
                        embeds:[
                            new EmbedBuilder()
                            .setTitle(client.emoji.done + "成功刪除!")
                            .setDescription("獎品名:" + data.gift_name)
                            .setColor(client.color.greate)
                        ]
                    })
                }
            })
        } catch (error) {
            const error_send= require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}