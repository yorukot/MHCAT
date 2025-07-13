const verification = require("../../models/verification.js");
const Captcha = require("@haileybot/captcha-generator");
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
    name: '驗證',
    cooldown: 5,
    description: '確保你不是機器人',
    video: 'https://docsmhcat.yorukot.me/commands/announcement.html',
    emoji: `<:tickmark:985949769224556614>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply({ ephemeral: true });
        try {
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.editReply({embeds: [embed],ephemeral: true,})}
        verification.findOne({
            guild: interaction.guild.id,
        }, async (err, data) => {
            if (err) throw err;
            if (!data) {
            errors("這服的管理員沒有設置驗證系統，所以不能使用喔!")
            } else {
                const role = interaction.guild.roles.cache.get(data.role)
                if(!role) return errors("驗證身分組已經不存在了，請通管理員!")
                if(Number(role.position) >= Number(interaction.guild.members.me.roles.highest.position)) return errors("請通知群主管裡員我沒有權限給你這個身分組(請把我的身分組調高)!")
                let captcha = new Captcha();
                const attachment = new AttachmentBuilder(captcha.JPEGStream, { name: "captcha.jpeg"});
                const bt = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId(captcha.value + "verification")
                        .setLabel('點我進行驗證!')
                        .setEmoji("<a:arrow:986268851786375218>")
                        .setStyle(ButtonStyle.Success),
                    );
                    interaction.editReply({
                        files: [attachment],
                        ephemeral: true,
                        components: [bt]
                    });
            }
        })

    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}