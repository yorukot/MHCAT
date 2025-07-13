const poll = require('../../models/poll.js');
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

function containsDuplicates(array) {
    if (array.length !== new Set(array).size) {
        return true;
    }
    return false;
}
module.exports = {
    name: '投票創建',
    cooldown: 0,
    description: '創建一個萬能的投票',
    options: [{
        name: '問題',
        type: ApplicationCommandOptionType.String,
        description: '輸入你要問的問題!ex:我要買甚麼?',
        required: true,
    }, {
        name: '選項',
        type: ApplicationCommandOptionType.String,
        description: '輸入回答的選項，請用^將各個選項分開 ex:電腦^手機^兩個都要^!',
        required: true,
    }],
    //video: 'https://docsmhcat.yorukot.me/commands/announcement.html',
    UserPerms: '訊息管理',
    emoji: `<:logfile:985948561625710663>`,
    run: async (client, interaction, options, perms) => {
        await interaction.deferReply({
            ephemeral: true
        });
        //try {
        function errors(content) {
            const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
            interaction.editReply({
                embeds: [embed],
                ephemeral: true
            })
        }
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return errors(`你需要有\`${perms}\`才能使用此指令`)
        const choose = interaction.options.getString("選項")
        const question = interaction.options.getString("問題")
        const choose_string_array = choose.split('^')
        let all_button = []
        let buttons = []
        let buttons1 = []
        let buttons2 = []
        let buttons3 = []
        if (question.length > 2500) return errors('問題字數不可超過2500')
        if (choose_string_array.length < 2) return errors('最少需要2個選項!')
        if (choose_string_array.length > 19) return errors('最多只能有19個選項!')
        if (containsDuplicates(choose_string_array)) return errors('選項名稱不可以重複!')
        choose_string_array.forEach(function (val) {
            if (val.length > 80) return errors('你輸入的選項字數不能超過80')
            if (val.length < 1) return errors('^跟^中間請填入選項，不可為空')
        });

        const see_result = new ButtonBuilder()
            .setCustomId(`see_result`)
            .setLabel('查看投票結果')
            .setEmoji('<:analysis:1023965999357243432>')
            .setStyle(ButtonStyle.Success)
        for (let i = 0; i < (choose_string_array.length + 1); i++) {
            if ((buttons.length > 4) && !(buttons1.length > 4)) {
                if (i === (choose_string_array.length)) {
                    buttons1.push(see_result)
                } else {
                    buttons1.push(
                        new ButtonBuilder()
                        .setCustomId(`poll_${choose_string_array[i]}`)
                        .setLabel(choose_string_array[i])
                        .setStyle(ButtonStyle.Secondary)
                    )
                }
            } else if (buttons1.length > 4 && !(buttons2.length > 4)) {
                if (i === (choose_string_array.length)) {
                    buttons2.push(see_result)
                } else {
                    buttons2.push(
                        new ButtonBuilder()
                        .setCustomId(`poll_${choose_string_array[i]}`)
                        .setLabel(choose_string_array[i])
                        .setStyle(ButtonStyle.Secondary)
                    )
                }
            } else if (buttons2.length > 4 && !(buttons3.length > 4)) {
                if (i === (choose_string_array.length)) {
                    buttons3.push(see_result)
                } else {
                    buttons3.push(
                        new ButtonBuilder()
                        .setCustomId(`poll_${choose_string_array[i]}`)
                        .setLabel(choose_string_array[i])
                        .setStyle(ButtonStyle.Secondary)
                    )
                }
            } else {
                if (i === (choose_string_array.length)) {
                    buttons.push(see_result)
                } else {
                    buttons.push(
                        new ButtonBuilder()
                        .setCustomId(`poll_${choose_string_array[i]}`)
                        .setLabel(choose_string_array[i])
                        .setStyle(ButtonStyle.Secondary)
                    )
                }
            }
        }
        all_shop = new ActionRowBuilder()
            .addComponents(
                buttons
            );
        all_shop1 = new ActionRowBuilder()
            .addComponents(
                buttons1
            );
        all_shop2 = new ActionRowBuilder()
            .addComponents(
                buttons2
            );
        all_shop3 = new ActionRowBuilder()
            .addComponents(
                buttons3
            );
        all_button.push(all_shop)
        if (buttons1.length > 0) {
            all_button.push(all_shop1)
            if (buttons2.length > 0) {
                all_button.push(all_shop2)
                if (buttons3.length > 0) {
                    all_button.push(all_shop3)
                }
            }
        }
        all_button.push(
            new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                .setCustomId('poll_menu')
                .setPlaceholder('🔧投票發起人操作')
                .addOptions({
                    label: '公開投票結果',
                    description: '讓所有成員都可以查看該投票結果',
                    value: 'poll_public_result',
                    emoji: '<:publicrelation:1023972880385585212>'
                }, {
                    label: '啟用多選投票',
                    description: '讓所有成員都可以投票超過1個以上',
                    value: 'poll_can_choose_many',
                    emoji: '<:maybe:1023971826948391074>'
                }, {
                    label: '允許變更選項',
                    description: '讓所有成員都可以更改投票選項',
                    value: 'poll_can_change_choose',
                    emoji: '<:exchange:1023972882046525491>'
                }, {
                    label: '改為匿名投票',
                    description: '讓所有無法得知有誰參加抽獎',
                    value: 'poll_anonymous',
                    emoji: '<:unknown:1024241985583853598>'
                }, {
                    label: '結束投票',
                    description: '讓該投票變為無法再變更選項或投票(可再次開啟)',
                    value: 'poll_end_poll',
                    emoji: '<:stop:1023972878678503434>'
                }, {
                    label: '匯出為excel檔',
                    description: '如果成員過多的話可以使用這個查看誰投票',
                    value: 'poll_excel_result',
                    emoji: '<:sheets:1023972957330100324>'
                }),
            )
        )
        const userIds = new Set();
            for (const member of (await interaction.guild.members.fetch()).values()) {
                const user = await client.users.fetch(member.id);
                if (!userIds.has(user.id) && !user.bot) {
                    userIds.add(user.id);
                }
            }
        let embed = new EmbedBuilder()
            .setTitle(`<:poll:1023968837965709312> | 投票\n${question}`)
            .setDescription(`<:vote:1023969411369025576> **總投票人數:\`0\` / \`${userIds.size}\`|參與率:\`0.00\`%**

<:YellowSmallDot:1023970607429328946> **每人可以投給\`1\`個選項
<:YellowSmallDot:1023970607429328946> \`不能\`改投其他選項
<:YellowSmallDot:1023970607429328946> \`無法\`看到投票結果
<:YellowSmallDot:1023970607429328946> \`實名\`投票**
`)
            .setColor('Random')
        const msg = await interaction.channel.send({
            embeds: [embed],
            components: all_button
        })
        let data = new poll({
            guild: interaction.guild.id,
            create_member_id: interaction.user.id,
            question: question,
            messageid: msg.id,
            many_choose: 1,
            can_change_choose: false,
            can_see_result: false,
            end: false,
            anonymous: false,
            choose_data: choose_string_array,
            join_member: [],
        })
        data.save()
        interaction.editReply({
            embeds: [
                new EmbedBuilder()
                .setTitle(client.emoji.done + " | 成功創建投票!")
                .setColor("Green")
            ]
        })
        /*} catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }*/
    }
}