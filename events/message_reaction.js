const message_reaction = require("../models/message_reaction.js");
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
const client = require('../index');

client.on("messageReactionAdd", async (reaction, user) => {
    if (user.bot) return
    function errors(content) {
        const embed = new EmbedBuilder().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("Red");
        user.send({
            embeds: [embed],
            ephemeral: true
        })
    }
    message_reaction.findOne({
        guild: reaction.message.guild.id,
        message: reaction.message.id,
        react: (reaction.emoji.id === null || reaction.emoji.id === undefined) ? reaction.emoji.name : `${reaction.emoji.id}`,
    }, async (err, data) => {
        if (err) throw err;
        if (!data) {
            return
        } else {
            const role = reaction.message.guild.roles.cache.get(data.role)
            if (!role || Number(role.position) >= Number(reaction.message.guild.members.me.roles.highest.position)) return errors("我沒有權限給大家這個身分組或是身分組被刪除了(請把我的身分組調高)!")
            const member = reaction.message.guild.members.cache.get(user.id)
            member.roles.add(role)
        }
    })
})
client.on("messageReactionRemove", async (reaction, user) => {
    if (user.bot) return

    function errors(content) {
        const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
        user.send({
            embeds: [embed],
            ephemeral: true
        })
    }
    message_reaction.findOne({
        guild: reaction.message.guild.id,
        message: reaction.message.id,
        react: (reaction.emoji.id === null || reaction.emoji.id === undefined) ? reaction.emoji.name : `${reaction.emoji.id}`,
    }, async (err, data) => {
        if (err) throw err;
        if (!data) {
            return
        } else {
            const role = reaction.message.guild.roles.cache.get(data.role)
            if (!role || Number(role.position) >= Number(reaction.message.guild.members.me.roles.highest.position)) return errors("我沒有權限給大家這個身分組或是身分組被刪除了(請把我的身分組調高)!")
            const member = reaction.message.guild.members.cache.get(user.id)
            member.roles.remove(role)
        }
    })
})