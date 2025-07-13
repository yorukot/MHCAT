const Number = require("../../models/Number.js");
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
    ChannelType
} = require('discord.js');
const canvacord = require("canvacord");
const role_number = require("../../models/role.js");
module.exports = {
    name: '統計身分組人數',
    cooldown: 10,
    description: '統計某個特定的身分組的人數',
    options: [{
        name: '統計頻道類型',
        type: ApplicationCommandOptionType.String,
        description: '輸入統計頻道要是文字頻道還是語音頻道',
        required: true,
        choices:[
            { name: '文字頻道', value: '文字頻道' },
            { name: '語音頻道', value: '語音頻道' },
        ], 
    },{
        name: '身分組',
        type: ApplicationCommandOptionType.Role,
        description: '輸入要統計哪個身分組',
        required: true,
    }],
    UserPerms: '管理訊息',
    //video: 'https://docsmhcat.yorukot.me/commands/statistics.html',
    emoji: `<:statistics:986108146747600928>`,
    UserPerms: '訊息管理',
    run: async (client, interaction, options, perms) => {
        try {
        await interaction.deferReply().catch(e => { });
        const lodd = new EmbedBuilder().setTitle(`<a:lodding:980493229592043581> | 正在進行設置中!`).setColor("Green")
        const lodding = await interaction.followUp({embeds: [lodd]})
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");lodding.edit({embeds: [embed]})}
        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))return errors(`你需要有\`${perms}\`才能使用此指令`)
        const vt = interaction.options.getString("統計頻道類型")
        const role = interaction.options.getRole("身分組")
        const members = interaction.guild.members.cache.filter(member => member.roles.cache.some(role1 => role1.id === role.id));
        if(vt !== "文字頻道" && vt !== "語音頻道")return errors("你沒有進行設置要文字頻道還是語音頻道!或是你打錯了!")
        Number.findOne({
            guild: interaction.guild.id,
        }, async (err, data) => {
            if (err) throw err;
            if(!data){
                return errors("你還沒創建過統計頻道，請先使用`/統計系統創建`")
            }else{
                const parent_id = interaction.guild.channels.cache.get(data.parent) ? data.parent : null
                const voiceortext = vt === "文字頻道" ? {
                    name: `${role.name}: ${members.size}`,
                    type:ChannelType.GuildText,
                    parent: parent_id,
                    permissionOverwrites: [
                        {
                          id: interaction.guild.members.me.id,
                          allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.SendMessages], //Allow permissions
                        },{
                            id: interaction.guild.roles.everyone.id,
                            deny: [PermissionsBitField.Flags.SendMessages],
                            allow: [PermissionsBitField.Flags.ViewChannel]
                        }
                     ]
                } : {
                    name: `${role.name}: ${members.size}`,
                    type: ChannelType.GuildVoice,
                    parent: parent_id,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.members.me.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ManageMessages, PermissionsBitField.Flags.Connect], //Allow permissions
                          },{
                              id: interaction.guild.roles.everyone.id,
                              deny: [PermissionsBitField.Flags.Connect],
                              allow: [PermissionsBitField.Flags.ViewChannel]
                          }
                ]
                }
                    const voice_channel = await interaction.guild.channels.create(voiceortext)
                    role_number.findOne({
                        guild: interaction.guild.id,
                        role: role.id
                    }, async (err, data1) => {
                        if (err) throw err;
                        if(!data1){
                            new role_number({
                                guild: interaction.guild.id,
                                channel: voice_channel.id,
                                channel_name: members.size,
                                role: role.id,
                            }).save()
                            lodding.edit({embeds: [
                                new EmbedBuilder()
                                .setTitle("統計特定身分組成功創建")
                                .setDescription(`已成功為您創建統計特定身分組\n頻道:<#${voice_channel.id}> 名字可以更改喔，不要動到數字就好awa`)
                                .setColor("Green")
                            ]})
                        }else{
                            data1.delete();
                            new role_number({
                                guild: interaction.guild.id,
                                channel: voice_channel.id,
                                channel_name: members.size,
                                role: role.id,
                            }).save()
                            lodding.edit({embeds: [
                                new EmbedBuilder()
                                .setTitle("統計特定身分組成功創建")
                                .setDescription(`已成功為您創建統計特定身分組\n頻道:<#${voice_channel.id}> 名字可以更改喔，不要動到數字就好awa`)
                                .setColor("Green")
                            ]})
                        }
                    })
            }
        })

    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
}}