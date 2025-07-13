const text_xp = require("../../models/text_xp.js");
const canvacord = require("canvacord")
const join_role = require("../../models/join_role.js")
const ticket_js = require('../../models/ticket.js')
const lotter = require('../../models/lotter.js');
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
const { forEach } = require("lodash");
module.exports = {
    name: '刪除訊息',
    cooldown: 30,
    description: '刪除大量訊息',
    options: [{
        name: '刪除數量',
        type: ApplicationCommandOptionType.Integer,
        description: '設定要刪除幾個訊息(最高1000超過200需要管理者權限)(只能刪除14天內的消息)',
        required: true,
    }, {
        name: '使用者',
        type: ApplicationCommandOptionType.User,
        description: '選擇是否要刪除某個特定的使用者的訊息(如填選這項，第一項代表的將是檢測訊息數量)',
        required: false,
    }],
    //video: 'https://docsmhcat.yorukot.me/commands/announcement.html',
    UserPerms: '訊息管理(刪除超過200則需要有權限)',
    emoji: `<:delete:985944877663678505>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply({
            ephemeral: true
        });
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
            const number = interaction.options.getInteger("刪除數量")
            const user = interaction.options.getUser("使用者")
            let delamount = number;
            if (delamount > 1000) return errors('不可刪除超過1000則消息!!!!!')
            if (delamount > 200) {
                if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return errors(`你需要有\`${perms}\`才能使用此指令`)
            }
            let tset = 0
            let testestestestestes = 1

            lots_of_messages_getter("testes", number)
            async function lots_of_messages_getter(channel, delamount) {
                if(user){
                    for (let i = 1; i <= 10; i++){
                        setTimeout(() => {
                        if(delamount - tset === 0) return interaction.editReply({
                            embeds: [new EmbedBuilder()
                                .setTitle("<a:green_tick:994529015652163614> | 清理完成!")
                                .setColor(client.color.greate)
                                .setDescription(`**成功清除:**\`${tset}\`/\`${delamount}\`\n**<:deletebutton:981971559679950848> 如果沒有成功清完全\n代表可能超過14天或沒這麼多訊息給清**`)
                            ],
                            ephemeral: true
                        })
                        interaction.channel.messages.fetch({
                            limit: delamount - tset > 100 ? 100 : delamount - tset
                        }).then((messages) => {
                            let botMessages = [];
                            messages.filter((m => m.author.id === user.id)).forEach(msg => botMessages.push(msg))
                            interaction.channel.bulkDelete(botMessages)
                            .then(aaaaaa => {tset = tset + aaaaaa.size;testestestestestes = aaaaaa.size})
                        })
                        if(i === 10){
                            interaction.editReply({
                                embeds: [new EmbedBuilder()
                                .setTitle("<a:green_tick:994529015652163614> | 清理完成!")
                                .setColor(client.color.greate)
                                .setDescription(`**成功清除:**\`${tset}\`/\`${delamount}\`\n**<:deletebutton:981971559679950848> 如果沒有成功清完全\n代表可能超過14天或沒這麼多訊息給清**`)
                            ],
                                ephemeral: true
                            })
                        }
                        }, (i - 1) * 6000);
                }
                }else{ 
                    for (let i = 1; i <= Math.ceil(delamount / 100); i++){
                        setTimeout(() => { 
                        interaction.channel.messages.fetch({
                            limit: delamount - tset > 100 ? 100 : delamount - tset
                        }).then((messages) => {
                            let botMessages = []; 
                            messages.forEach(msg => botMessages.push(msg))
                            interaction.channel.bulkDelete(botMessages)
                            .then(aaaaaa => {tset = tset + aaaaaa.size})
                        })
                        if(i === Math.ceil(delamount / 100)){
                            interaction.editReply({ 
                                embeds: [new EmbedBuilder()
                                    .setTitle("<a:green_tick:994529015652163614> | 清理完成!")
                                    .setColor(client.color.greate)
                                    .setDescription(`**成功清除:**\`${tset}\`/\`${delamount}\`\n**<:deletebutton:981971559679950848> 如果沒有成功清完全\n代表可能超過14天或沒這麼多訊息給清**`)
                                ],
                                ephemeral: true
                            })
                        }
                        }, (i - 1) * 6000);
                }
                }
            }
        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
} 