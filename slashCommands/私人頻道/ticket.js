const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const join_role = require("../../models/join_role.js")
const ticket_js = require('../../models/ticket.js')
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
    PermissionsBitField,
    TextInputStyle
} = require('discord.js');
const { errorMonitor } = require("ws");
module.exports = {
    name: '私人頻道設置',
    cooldown: 10,
    description: '設置私人頻道',
    options: [{
        name: '類別',
        type: ApplicationCommandOptionType.Channel,
        channel_types: [4],
        description: '輸入私人頻道要在哪個類別開啟!',
        required: true,
    },{
        name: '管理員身分組',
        type: ApplicationCommandOptionType.Role,
        description: '輸入管理員身分組(有這個身分組的能夠管理私人頻道)!',
        required: true,
    }],
   // video: 'https://docsmhcat.yorukot.me/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:ticket:985945491093205073>`,
    run: async (client, interaction, options, perms) => {
        try{
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.reply({embeds: [embed],ephemeral: true})}
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const channel = interaction.options.getChannel("類別")
        const role1 = interaction.options.getRole("管理員身分組")
        const role = role1.id
            ticket_js.findOne({
                guild: interaction.guild.id,
            }, async (err, data) => {
                if(!data){
                    data = new ticket_js({
                        guild: interaction.guild.id,
                        ticket_channel: channel.id,
                        admin_id: role,
                        everyone_id: interaction.guild.roles.everyone.id,
                    })
                    data.save()
                }else{
                    const error = new EmbedBuilder()
                    .setTitle("__**錯誤**__")
                    .setDescription("您已經註冊一個私人頻道了，如果需要更改，請打\n\`<>h 刪除私人頻道\`\n將會告訴您如何刪除")
                    .setColor("Red")
                    interaction.reply({embeds: [error],ephemeral: true})
                    return
                }
                const modal = new ModalBuilder()
                .setCustomId("nal")
                .setTitle('私人頻道系統!');
                const color = new TextInputBuilder()
                .setCustomId("ticketcolor")
                .setRequired(true)
                .setLabel("請輸入嵌入顏色")
                .setStyle(TextInputStyle.Short);
                const title = new TextInputBuilder()
                .setCustomId("tickettitle")
                .setLabel("請輸入標題")
                .setRequired(true)
                .setStyle(TextInputStyle.Short);
                const content = new TextInputBuilder()
                .setCustomId('ticketcontent')
                .setLabel("請輸入內文")
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph);
                const color1 = new ActionRowBuilder().addComponents(color);
                const title1 = new ActionRowBuilder().addComponents(title);
                const content1 = new ActionRowBuilder().addComponents(content);
                modal.addComponents(color1,title1,content1);
                await interaction.showModal(modal);
            })



        } catch (error) {
            const error_send= require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}