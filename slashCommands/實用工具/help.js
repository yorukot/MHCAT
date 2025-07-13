//Since this code is very very huge... i will copy paste the code i made before recording
// but i will explain everything in it
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
const {
    readdirSync
} = require("fs");
const client = require('../../index')
const prefix = client.config.prefix; // this one gets the prefix
let color = "Random"; // this is the color of the embed

const create_mh = require(`../../functions/menu.js`); // this one gets the dropdown menu

module.exports = {
    name: 'help',
    cooldown: 10,
    description: '使用我開始使用',
    options: [{
        name: '指令名稱',
        description: '輸入指令名稱(可不輸入)!',
        required: false,
        type: ApplicationCommandOptionType.String,
    }],
    video: 'https://docsmhcat.yorukot.me/docs/help',
    emoji: `<:help:985948179709186058>`,
    run: async (client, interaction, options, perms) => {
        try {
        await interaction.deferReply().catch(e => { });
        function errors(content){const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");interaction.followUp({embeds: [embed]})}
        let get_member = interaction.options.getString("指令名稱")
        let categories = [];
        let cots = [];

        if (!get_member) {

            let ignored = [
                "test"
            ];
            const {description,emo} = require('../../config.json')
            let ccate = [];

            readdirSync("./slashCommands/").forEach((dir) => {
                if (ignored.includes(dir.toLowerCase())) return;
                const commands = readdirSync(`./slashCommands/${dir}/`).filter((file) =>
                    file.endsWith(".js")
                );

                if (ignored.includes(dir.toLowerCase())) return;

                const name = `${emo[dir]} - ${dir}`;
                let nome = dir.toUpperCase();

                let cats = new Object();

                cats = {
                    name: name,
                    value: `\`${description[dir]}\``,
                    inline: true
                }


                categories.push(cats);
                ccate.push(nome);
            }); 
            //embed
            const embed = new EmbedBuilder()
                .setAuthor({name: `MHCAT`, iconURL:`https://i.imgur.com/AQAodBA.png`, URL:`https://discord.com/api/oauth2/authorize?client_id=964185876559196181&permissions=8&scope=bot%20applications.commands`})
                .setDescription(`**<a:cool:984263702897360897> 嗨嗨，你發現了酷東西\n使用我來讓你的discord更棒!!\n想要了解某個類別請使用下方的選單\n如要查看特定的指令請使用\`/help 指令名稱\`
\n<:9605discordslashcommand:982559784429563925> 指令一律使用斜線命令，只需打\`/指令名稱\`即可使用**
\n<a:buycoffeeforme:986560638304256051> [幫我買杯咖啡!](https://www.buymeacoffee.com/mhcat)

[隱私權聲明](https://docsmhcat.yorukot.me/terms/privacy_policy) [服務條款](https://docsmhcat.yorukot.me/terms/Terms_of_Service)`)
                .setFooter({
                    text: `${interaction.user.tag}的查詢`,
                    iconURL:interaction.user.displayAvatarURL({
                        dynamic: true
                        })
                })
                .setTimestamp()
                .setColor(color)    
            let menus = create_mh(ccate);
            return interaction.followUp({
                embeds: [embed],
                components: menus.smenu, 
            })

        } else {
            get_member = get_member.split(" ")[0]
            let catts = [];

            readdirSync("./slashCommands/").forEach((dir) => {
                if (dir.toLowerCase() !== get_member.toLowerCase()) return;
                const commands = readdirSync(`./slashCommands/${dir}/`).filter((file) =>
                    file.endsWith(".js")
                );


                const cmds = commands.map((command) => {
                    let file = require(`../../slashCommands/${dir}/${command}`);

                    if (!file.name) return "沒有指令名稱";

                    let name = file.name.replace(".js", "");

                    if (client.slash_commands.get(name).hidden) return;


                    let des = client.slash_commands.get(name).description;
                    let emo = client.slash_commands.get(name).emoji;
                    let emoe = emo ? `${emo}` : ``;

                    let obj = {
                        cname: `${emoe}\`${name}\``,
                        des
                    }

                    return obj;
                });

                let dota = new Object();

                cmds.map(co => {
                    if (co == undefined) return;

                    dota = {
                        name: `${cmds.length === 0 ? "進行中" : prefix + co.cname}`,
                        value: co.des ? co.des : `沒有說明`,
                        inline: true,
                    }
                    catts.push(dota)
                });

                cots.push(dir.toLowerCase());
            });

            const command =
                client.slash_commands.get(get_member.toLowerCase())

            if (cots.includes(get_member.toLowerCase())) {
                const combed = new EmbedBuilder()
                    .setTitle(`__${get_member.charAt(0).toUpperCase() + get_member.slice(1)} 指令!__`)
                    .setDescription(`> 使用 \`/help\` 或加上指令名稱以獲取有關指令的更多信息.\n> 例: \`/help 指令名稱:公告發送\`.\n\n`)
                    .addFields(catts)
                    .setColor(color)
                    .setFooter({
                        text: `${interaction.user.tag}的查詢`,
                        iconURL:interaction.user.displayAvatarURL({
                            dynamic: true
                            })
                    });

                return interaction.followUp({
                    embeds: [combed]
                })
            };

            if (!command) {
                const embed = new EmbedBuilder()
                    .setTitle(`無效的指令! 使用 \`/help\` 查看所有指令!`)
                    .setColor("Red");
                return await interaction.followUp({
                    embeds: [embed],
                    allowedMentions: {
                        repliedUser: false
                    },
                });
            }
            const embed = new EmbedBuilder() //this is for commmand 幫助 eg. !!幫助 ping
                .setTitle("**<:9605discordslashcommand:982559784429563925> 指令資料**")
                .addFields([
                    { name: `<:id:985950321975128094>**指令名稱:**`, value: command.name ? `\`\`\`${command.name}\`\`\`` : "\`\`\`這個指令沒有名稱!\`\`\`" },
                    { name: "<:editinfo:985950967566569503>**指令說明:**", value: command.description ? `\`\`\`${command.description}\`\`\`` : "此指令無說明!" },
                    { name: "<:key:986059580821868544>**指令權限需求(用戶需要有甚麼權限才能使用):**", value: command.UserPerms ? `\`\`\`${command.UserPerms}\`\`\`` : "\`\`\`這個指令大家都可以用喔\`\`\`" },
                    { name: "<:creativeteaching:986060052949524600>**指令文檔教學:**", value: command.video ? `[__**點我立刻前往教學頁面**__](${command.video})` : "```此指令目前沒有教學```" },
                ])
                .setFooter({
                    text: `${interaction.user.tag}的查詢`,
                    iconURL:interaction.user.displayAvatarURL({
                        dynamic: true
                        })
                })
                .setTimestamp()
                .setColor(color)
            return await interaction.followUp({
                embeds: [embed]
            });
        }

    } catch (error) {
        const error_send= require('../../functions/error_send.js')
        error_send(error, interaction)
    }
    },
}; 