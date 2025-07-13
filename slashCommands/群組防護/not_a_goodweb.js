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
const good_web = require('../../models/good_web.js')
function decimalAdjust(type, value, exp) {
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }
const canvacord = require("canvacord");
module.exports = {
    name: '防詐騙網址',
    cooldown: 10,
    description: '設定是否開啟防詐騙網址功能(輸入這個指令就會更改)',
    UserPerms: '訊息管理',
    //video: 'https://docsmhcat.yorukot.meommands/statistics.html',
    emoji: `<:fraudalert:1000408260777611355>`,
    run: async (client, interaction, options, perms) => {
        try {
            await interaction.deferReply();
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.editReply({embeds: [embed]})}
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))return errors(`你需要有\`${perms}\`才能使用此指令`)
        good_web.findOne({
            guild: interaction.channel.guild.id,
        }, async (err, data) => {
                if(data) data.delete();
                let dsadsa = data
                data = new good_web({
                    guild: interaction.channel.guild.id,
                    open: dsadsa ? dsadsa.open === true ? false : true : true,
                })
                data.save()
                const announcement_set_embed = new EmbedBuilder()
                .setTitle("<:fraudalert:1000408260777611355> 自動偵測詐騙連結")
                .setDescription(`您的防詐騙啟用狀態已改為:\n${dsadsa ? dsadsa.open === true ? false : true : true}`)
                .setColor("Green")
                interaction.editReply({embeds: [announcement_set_embed]})
            
        })
    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
}}