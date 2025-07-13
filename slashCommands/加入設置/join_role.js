const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const join_role = require("../../models/join_role.js")
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
    name: '加入身份組設置',
    cooldown: 10,
    description: '設定玩家加入時要給甚麼身份組',
    options: [{
        name: '身分組',
        type: ApplicationCommandOptionType.Role,
        description: '輸入身分組!',
        required: true,
    },{
        name: '給人還是給機器人',
        type: ApplicationCommandOptionType.String,
        description: '請選擇(預設為給所有人)!',
        required: false,
        choices: [{
                name: '給全部人',
                value: 'all_user'
            },
            {
                name: '機器人',
                value: 'all_bot'
            },
            {
                name: '成員',
                value: 'all_member'
            },
        ],
    }],
    video: 'https://docsmhcat.yorukot.meocs/join_role',
    UserPerms: '訊息管理',
    emoji: `<:roleplaying:985945121264635964>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply();
        try {


            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
            const role1 = interaction.options.getRole("身分組")
            const give_role_to_who = interaction.options.getString("給人還是給機器人")
            const role = role1.id
            if (Number(role1.position) >= Number(interaction.guild.members.me.roles.highest.position)) return errors("我沒有權限為大家增加這個身分組，請將我的身分組位階調高")
            join_role.findOne({
                guild: interaction.guild.id,
                role: role
            }, async (err, data) => {
                if (err) throw err;
                if (!data) {
                    data = new join_role({
                        guild: interaction.guild.id,
                        role: role,
                        give_to_who: give_role_to_who ? give_role_to_who : "all_user"
                    })
                    data.save()
                } else {
                    return errors("很抱歉，這個身分組已經被註冊了，請重試!")
                }
                const embed = new EmbedBuilder()
                    .setTitle("🪂 加入身分組系統")
                    .setColor(client.color.greate)
                    .setDescription(`<a:green_tick:994529015652163614> **成功創建加入給身分組!**\n**身分組:** <@${role}>!`)
                interaction.editReply({
                    embeds: [embed]
                })
            })


        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}