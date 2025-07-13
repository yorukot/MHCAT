const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const join_role = require("../../models/join_role.js")
const ticket_js = require('../../models/ticket.js')
const lock_channel = require('../../models/lock_channel.js')
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
const {
    errorMonitor
} = require("ws");
module.exports = {
    name: '上鎖頻道',
    cooldown: 10,
    description: '設定語音包廂密碼',
    options: [{
        name: '密碼',
        type: ApplicationCommandOptionType.String,
        description: '設定該包廂密碼，如想不設定密碼，可直接忽略此選項',
        required: false,
    }],
    //video: 'https://docsmhcat.yorukot.mez/commands/announcement.html',
    emoji: `<:mapsandflags:985949507114131587>`,
    run: async (client, interaction, options, perms) => {
        try {
            await interaction.deferReply({ephemeral: true});

            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            if(!interaction.member.voice || !interaction.member.voice.channelId) return errors("你不在一個語音包廂!")
            const anser = interaction.options.getString("密碼")
            lock_channel.findOne({
                guild: interaction.guild.id,
                channel_id: interaction.member.voice.channelId
            }, async (err, data) => {
                if(!data) return errors('你不在語音包廂或該語音包廂不支援設密碼!')
                if(data.owner !== interaction.user.id) return errors('只有包廂房主可以設定!')
                if(data) data.delete()
                data = new lock_channel({
                    guild: interaction.guild.id,
                    channel_id: interaction.member.voice.channelId,
                    lock_anser: anser ? anser : null,
                    owner: interaction.user.id,
                    text_channel: interaction.channel.id,
                    ok_people: [],
                })
                data.save()
                const embed = new EmbedBuilder()
                                .setTitle("<a:green_tick:994529015652163614> | 成功進行設定")
                                .setColor("Green")
                                .setDescription("<:Voice:994844272790610011> 你成功對語音包廂密碼進行設定為:" + `${anser ? anser : null}`)
                            interaction.editReply({
                                embeds: [embed],
                            });
            })


        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}