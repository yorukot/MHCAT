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
const create_hours = require('../../models/create_hours.js')
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
    name: '帳號需創建時數',
    description: '設定用戶要創建多久才能加入這個伺服器',
    cooldown: 10,
    options: [{
        name: '小時數',
        type: ApplicationCommandOptionType.Subcommand,
        description: '設定用戶需要滿幾小時才能夠進入伺服器',
        options: [{
            name: '小時數',
            type: ApplicationCommandOptionType.Integer,
            description: '輸入當未滿幾個小時時要自動踢出!',
            required: true,
        }]
    },{
        name: '被踢出資訊頻道',
        type: ApplicationCommandOptionType.Subcommand,
        description: '當有人因為未滿創建時數被踢出時要在哪裡發送',
        options: [{
            name: '頻道',
            type: ApplicationCommandOptionType.Channel,
            description: '設定因未達創建時數而被踢出的使用者資訊!',
            required: true,
            channel_types: [0,5],
        }]
    },{
        name: '創建時數刪除',
        type: ApplicationCommandOptionType.Subcommand,
        description: '刪除之前設定的小時數以及被踢出後再發的頻道',
    },{
        name: '被踢出資訊頻道刪除',
        type: ApplicationCommandOptionType.Subcommand,
        description: '刪除之前的設定發送頻道',
    }],
    UserPerms: '踢出用戶',
    //video: 'https://docsmhcat.yorukot.meommands/statistics.html',
    emoji: `<:onehour:1000310711941087293>`,
    run: async (client, interaction, options, perms) => {
        try {
            await interaction.deferReply();
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.editReply({embeds: [embed]})}
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers))return errors(`你需要有\`${perms}\`才能使用此指令`)
        if(interaction.options.getSubcommand() === "小時數"){
        let number = interaction.options.getInteger("小時數")
        if(number <= 0)return errors("不可為負數或0!!!")
        let need_time = number * 60 * 60
        let day = decimalAdjust('round',number / 24, -1);
        create_hours.findOne({
            guild: interaction.channel.guild.id,
        }, async (err, data) => {
            let dsadsadsa = data
            if(!data){
                data = new create_hours({
                    guild:interaction.channel.guild.id,
                    hours: `${need_time}`,
                    channel: dsadsadsa ? dsadsadsa.channel : null,
                })
                data.save()
            }else{
                data.collection.updateOne(({
                    guild: interaction.channel.guild.id,
                }), {
                    $set: {
                        hours: `${need_time}`,
                        channel: dsadsadsa ? dsadsadsa.channel : null,
                    }
                })
            }
            const embed = new EmbedBuilder()
            .setTitle(`${client.emoji.done}群組防護系統`)
            .setDescription(`已為您設定必須創建帳號${day}天才能加入伺服器`)
            .setColor(client.color.greate)
            interaction.editReply({embeds:[embed]})
        })
        }else if(interaction.options.getSubcommand() === "被踢出資訊頻道"){
        let channel = interaction.options.getChannel("頻道")
        create_hours.findOne({
            guild: interaction.channel.guild.id,
        }, async (err, data) => {
            if(!data) return errors("你必須先設定`/帳號需創建時數 小時數`")
            let dsadsadsa = data
            data.collection.updateOne(({
                guild: interaction.channel.guild.id,
            }), {
                $set: {
                    channel: channel.id,
                }
            })
            const embed = new EmbedBuilder()
            .setTitle(`${client.emoji.done}群組防護系統`)
            .setDescription(`已為您設定當未達創建時數時會在:\n${channel}發送使用者資運`)
            .setColor(client.color.greate)
            interaction.editReply({embeds:[embed]})
        })
        }else if(interaction.options.getSubcommand() === "創建時數刪除"){
            create_hours.findOne({
                guild: interaction.channel.guild.id,
            }, async (err, data) => {
                if(!data) return errors('你還沒設定過喔!')
                data.delete()
                const embed = new EmbedBuilder()
                .setTitle(`${client.emoji.delete}群組防護系統`)
                .setDescription(`已刪除帳號需創建時數所有設定`)
                .setColor(client.color.greate)
                interaction.editReply({embeds:[embed]})
            })
        }else if(interaction.options.getSubcommand() === "被踢出資訊頻道刪除"){
            create_hours.findOne({
                guild: interaction.channel.guild.id,
            }, async (err, data) => {
                if(!data) return errors('你還沒設定過喔!')
                data.collection.updateOne(({
                    guild: interaction.channel.guild.id,
                }), {
                    $set: {
                        channel: null,
                    }
                })
                const embed = new EmbedBuilder()
                .setTitle(`${client.emoji.delete}群組防護系統`)
                .setDescription(`已刪除被踢出資訊頻道`)
                .setColor(client.color.greate)
                interaction.editReply({embeds:[embed]})
            })
        }
    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
}}