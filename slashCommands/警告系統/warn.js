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
const warndb = require('../../models/warndb');
const moment = require('moment')
const errors_set = require('../../models/errors_set');
module.exports = {
    name: '警告',
    cooldown: 10,
    description: '警告一個使用者',
    options: [{
        name: '使用者',
        type: ApplicationCommandOptionType.User,
        description: '要警告的使用者!',
        required: true
    }, {
        name: '原因',
        type: ApplicationCommandOptionType.String,
        description: '警告他的原因',
        required: true
    }],
    //video: 'https://docsmhcat.yorukot.meommands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:warning:985590881698590730>`,
    run: async (client, interaction, options, perms) => {
        try {
            await interaction.deferReply();

            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed]
                })
            }
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
            const user = interaction.options.getUser("使用者")
            let aaaaa = await interaction.guild.members.fetch(user.id)
            if (Number(interaction.member.roles.highest.position) <= Number(aaaaa.roles.highest.position)) return errors("你沒有權限警告這位使用者(身分組位階比他低)!")
            const reason = interaction.options.getString("原因")
            warndb.findOne({
                guild: interaction.guild.id,
                user: user.id
            }, async (err, data) => {
                if (err) throw err;
                if (!data) {
                    data = new warndb({
                        guild: interaction.guild.id,
                        user: user.id,
                        content: [{
                            time: moment().utcOffset("+08:00").format('YYYY年MM月DD日 HH點mm分'),
                            moderator: interaction.user.id,
                            reason: reason
                        }]
                    })
                } else {
                    const object = {
                        time: moment().utcOffset("+08:00").format('YYYY年MM月DD日 HH點mm分'),
                        moderator: interaction.user.id,
                        reason: reason
                    }
                    data.content.push(object)
                    errors_set.findOne({
                        guild: interaction.guild.id,
                    }, async (err, data111) => {
                        if (!data111) return
                        if (data.content.length >= Number(data111.ban_count)) {
                            if (data111.move === "停權") {
                                if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.BanMembers)) return errors("我沒有權限ban掉他")
                                interaction.guild.members.ban(user.id)
                                const aaaaa = new EmbedBuilder()
                                    .setTitle("<a:greentick:980496858445135893> | 這位使用者已到達警告須執行條件，成功對他執行`停權`!")
                                    .setColor("Green")
                                interaction.channel.send({
                                    embeds: [aaaaa]
                                })
                            } else {
                                if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.KickMembers)) return errors("我沒有權限踢出他")
                                interaction.guild.members.kick(user.id)
                                const dsadsadsa = new EmbedBuilder()
                                    .setTitle("<a:greentick:980496858445135893> | 這位使用者已到達警告須執行條件，成功對他執行`踢出`!")
                                    .setColor("Green")
                                interaction.channel.send({
                                    embeds: [dsadsadsa]
                                })
                            }
                        }
                    })
                }
                data.save()

            })
            const embed = new EmbedBuilder()
                .setTitle("<a:greentick:980496858445135893> | 成功警告這位使用者!")
                .setColor("Green")
            interaction.editReply({
                embeds: [embed]
            })
            const warn = new EmbedBuilder()
                .setColor(client.color.error)
                .setTitle("<:warning:985590881698590730> | 警告系統")
                .setDescription(`<:KannaSip:997764767433379850> **你在${interaction.guild.name}被__警告__了!**\n` + `<:lightbulb:1002169670574546964> **原因:**${reason}` + `\n<:implementation:1002170846292488232> **執行者:**${interaction.member.user.username}(id:${interaction.user.id})`)
                if(user.name) return
                user.send({
                embeds: [warn]
            })

        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}