const db = require('../../models/warndb')
const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const join_role = require("../../models/join_role.js")
const ticket_js = require('../../models/ticket.js')
const voice_channel = require('../../models/voice_channel.js')
const moment = require('moment')
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
 function getRandomArbitrary(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
const { errorMonitor } = require("ws");
module.exports = {
    name: '警告全部清除',
    cooldown: 10,
    description: '清除一個使用者的全部警告',
    options: [{
        name: '使用者',
        type: ApplicationCommandOptionType.User,
        description: '要清除資料的使用者!',
        required: true
    }],
    //video: 'https://docsmhcat.yorukot.me/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:trashbin:986308183674990592>`,
    run: async (client, interaction, options, perms) => {
        try {
            await interaction.deferReply();
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.editReply({embeds: [embed]})}
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const user = interaction.options.getUser("使用者")
        db.findOne({
            guild: interaction.guild.id,
            user: user.id
        }, async (err, data) => {
            if (err) throw err;
            if (data) {
                await db.findOneAndDelete({
                    user: user.id,
                    guild: interaction.guild.id
                })
                const embed = new EmbedBuilder()
                    .setTitle("<a:greentick:980496858445135893> | 這位使用者的警告成功移除!")
                    .setColor("Green")
                    interaction.editReply({embeds:[embed]})
                const b = new EmbedBuilder()
                .setColor("#00DB00")
                .setTitle("<:warning:985590881698590730> | 警告系統")
                .setDescription(`<:KannaSip:997764767433379850> **你在${interaction.guild.name}的所有__警告__被刪除了!**` + `\n<:implementation:1002170846292488232> **執行者:**${interaction.member.user.username}(id:${interaction.user.id})`)
                if(user.name) return
                user.send({embeds: [b] })
            } else {
                errors("這位使用者沒有任何警告")
            }
        })


    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    }
}