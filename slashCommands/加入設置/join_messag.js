const join_message = require("../../models/join_message.js");
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
  PermissionsBitField,
  TextInputStyle,
} = require("discord.js");
const {
  EqualsOperation,
} = require("sift");
module.exports = {
  name: "加入訊息設置",
  cooldown: 10,
  description: "設定玩家加入時發送甚麼訊息",
  options: [{
    name: "頻道",
    type: ApplicationCommandOptionType.Channel,
    description: "輸入加入訊息要在那發送!",
    channel_types: [0, 5],
    required: true,
  }],
  video: "https://docsmhcat.yorukot.meocs/join_message",
  UserPerms: "訊息管理",
  emoji: `<:comments:985944111725019246>`,

  run: async (client, interaction, options, perms) => {
    try {
      function errors(content) {
        const embed = new EmbedBuilder().setTitle(
          `<a:Discord_AnimatedNo:1015989839809757295> | ${content}`,
        ).setColor("Red");
        interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }
      const bt = new ActionRowBuilder()
      .addComponents(
          new ButtonBuilder()
          .setURL(`https://mhcat.yorukot.meguilds/${interaction.guild.id}/welcome`)
          .setLabel('點我前往儀錶板設定!')
          .setEmoji("<a:arrow:986268851786375218>")
          .setStyle(ButtonStyle.Link),
      );
      return interaction.reply({
        embeds: [new EmbedBuilder()
        .setColor('#df1f2f')
        .setTitle('<a:announcement:1005035747197337650> | 該指令已經移往控制面板，請前往控制面板進行設定')
    ],
    components: [bt]
      });
    } catch (error) {
      const error_send = require("../../functions/error_send.js");
      error_send(error, interaction);
    }
  },
};
