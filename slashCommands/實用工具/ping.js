const message_reaction = require("../../models/message_reaction.js");
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
    name: 'ping',
    cooldown: 0,
    description: '查看我的ping',
    //video: 'https://docsmhcat.yorukot.meommands/announcement.html',
    emoji: `<:icons_goodping:1084881470075703367>`,
    run: async (client, interaction, options, perms) => {
        try {
            interaction.reply(`${Date.now() - interaction.createdTimestamp > 125 ? Date.now() - interaction.createdTimestamp > 180 ? "<:icons_badping:1084881519581069482>"  : "<:icons_idelping:1084881570013388860>" : "<:icons_goodping:1084881470075703367>"} **Pong!** \`${Date.now() - interaction.createdTimestamp}\`ms`)
        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}