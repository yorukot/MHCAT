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
    Permissions,
    WebhookClient
} = require('discord.js');
const isurl = require('is-url')
module.exports = {
    name: '詐騙網址回報',
    cooldown: 10,
    description: '回報詐騙網站',
    //video: 'https://docsmhcat.yorukot.me/commands/statistics.html',
    emoji: `<:fraudalert:1000408260777611355>`,
    options: [{
        name: '網址',
        type: ApplicationCommandOptionType.String,
        description: '回報網址',
        required: true,
    }],
    run: async (client, interaction, options, perms) => {
        try {
            await interaction.deferReply();
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.editReply({embeds: [embed]})}
        const web = interaction.options.getString("網址")
        const not_a_good_web = require('../../models/not_a_good_web.js')
        if(!isurl(web)) return errors("你輸入的不是一個網址!")
        not_a_good_web.findOne({
                web: { $regex: web }
                }, async (err, data) => {
                    if(!data) {
                        const dsadsa = new WebhookClient({url:`${process.env.REPORT_WEBHOOK}`})
                        dsadsa.send(`\`\`\`${web}\`\`\`\nby:<@${interaction.user.id}>`)
                        const announcement_set_embed = new EmbedBuilder()
                        .setTitle("<:fraudalert:1000408260777611355> 自動偵測詐騙連結")
                        .setDescription(`成功回報${web}`)
                        .setColor("Green")
                        interaction.editReply({embeds: [announcement_set_embed]})
                        return
                    }
                    let aaaaa = data.web
                    if(web.includes(data.web) || aaaaa.includes(web)){
                        return errors("該網站已被回報過")
                    }else{
                        const dsadsa = new WebhookClient({url:`${process.env.REPORT_WEBHOOK}`})
                        dsadsa.send(`\`\`\`${web}\`\`\`\nby:<@${interaction.user.id}>`)
                        const announcement_set_embed = new EmbedBuilder()
                        .setTitle("<:fraudalert:1000408260777611355> 自動偵測詐騙連結")
                        .setDescription(`成功回報${web}`)
                        .setColor("Green")
                        interaction.editReply({embeds: [announcement_set_embed]})
                    }
                })
    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
}}