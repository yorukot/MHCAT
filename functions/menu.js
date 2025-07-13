const chalk = require(`chalk`);
const {
    SelectMenuBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require(`discord.js`);

/* MENU CREATOR */
/**
 * @param {Array} array - The array of options (rows to select) for the select menu
 * @returns SelectMenuBuilder
 */

const create_mh = (
    array
) => {

    if (!array) throw new Error(chalk.red.bold(`沒有提供選項！確保您提供所有選項!`));
    if (array.length < 0) throw new Error(chalk.red.bold(`你必須必須至少選擇一個清單!`));
    let select_menu;

    let id = `helphelphelphelpmenu`;

    let menus = [];

    array.forEach(cca => {
        const {
            description,
            emo
        } = require('../config.json')
        let name = cca;
        let sName = `${name.toUpperCase()}`
        let tName = `${name.toLowerCase()}`
        let fName = `${name.toLowerCase()}`
        return menus.push({
            label: sName,
            description: description[sName],
            value: fName,
            emoji: emo[tName]
        })
    });
    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setURL("https://dsc.gg/mhcat")
            .setStyle(ButtonStyle.Link)
            .setEmoji("<a:catjump:984807173529931837>")
            .setLabel("邀請我"),
            new ButtonBuilder()
            .setURL("https://discord.gg/7g7VE2Sqna")
            .setStyle(ButtonStyle.Link)
            .setLabel("支援伺服器")
            .setEmoji("<:customerservice:986268421144592415>"),
            new ButtonBuilder()
            .setURL("https://mhcat.yorukot.me")
            .setEmoji("<:worldwideweb:986268131284627507>")
            .setStyle(ButtonStyle.Link)
            .setLabel("官方網站")
        );
    let chicken = new SelectMenuBuilder()
        .setCustomId(id)
        .setPlaceholder(`📜 選擇命令類別`)
        .addOptions(menus)
    select_menu = new ActionRowBuilder()
        .addComponents(
            chicken
        );


    return {
        smenu: [select_menu, row],
        sid: id
    }
}

module.exports = create_mh;