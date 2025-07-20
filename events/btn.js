const btn = require("../models/btn.js")
const coin = require("../models/coin.js");
const gift_change = require("../models/gift_change.js");
const voice_xp = require("../models/voice_xp.js");
const text_xp = require("../models/text_xp.js");
const work_user = require('../models/work_user.js')
const work_set = require('../models/work_set.js')
const sign_list = require("../models/sign_list.js");
const {
    createCanvas,
    loadImage,
    Image,
    registerFont
} = require('canvas')
registerFont(`./fonts/TaipeiSansTCBeta-Regular.ttf`, {
    family: 'font_new'
})
registerFont(`./fonts/language/Arabic.ttf`, {
    family: 'Arabic'
})
registerFont(`./fonts/language/Bengali.ttf`, {
    family: 'Bengali'
})
registerFont(`./fonts/language/HK.otf`, {
    family: 'HK'
})
registerFont(`./fonts/language/JP.otf`, {
    family: 'JP'
})
registerFont(`./fonts/language/NotoSans.ttf`, {
    family: 'font'
})
registerFont(`./fonts/language/TC.otf`, {
    family: 'TC'
})
registerFont(`./fonts/language/SC.otf`, {
    family: 'SC'
})
registerFont(`./fonts/language/emoji.ttf`, {
    family: 'emoji'
})
registerFont(`./fonts/Oswald-Regular.ttf`, {
    family: 'font_xp'
})
registerFont(`./fonts/Comic-Sans-MS-copy-5-.ttf`, {
    family: 'Comic Sans MS'
})
const calendar = require('calendar-js')
const moment = require("moment")
const {
    ApplicationCommandType,
    ButtonStyle,
    ApplicationCommandOptionType,
    ActionRowBuilder,
    StringSelectMenuBuilder,
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
    ChartJSNodeCanvas,
    ChartConfiguration,
} = require("chartjs-node-canvas");
const system = require('../models/system.js')


const canvas = new ChartJSNodeCanvas({
    type: 'jpg',
    width: 1920,
    height: 700,
    backgroundColour: "rgb(28 28 28)",
});
canvas.registerFont(`./fonts/NotoSansTC-Regular.otf`, {
    family: "NotoSansTC",
});
const lotter = require('../models/lotter.js')
const os = require("os");
const process = require('process');
const client = require('../index');

function round(num) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);
}
const {
    user
} = require("../index");

client.on("interactionCreate", async (interaction) => {
    function errors(content) {
        const embed = new EmbedBuilder().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("Red");
        interaction.editReply({
            embeds: [embed],
            ephemeral: true
        })
    }
    //try {
    if (interaction.isButton()) {
        //機器人狀態
        const button_id = interaction.customId
        //我的資料重新創建
        if (interaction.customId.includes('sing')) {
            await interaction.update({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({
                        name: '正在努力為您尋找資料!',
                        iconURL: 'https://media.discordapp.net/attachments/991337796960784424/1076582216127230053/6209-loading-online-circle.gif'
                    })
                    .setFooter({
                        text: 'MHCAT 帶給你最好的discord體驗!',
                        iconURL: `${interaction.user.avatarURL({
                                extension: 'png'
                            }) ? interaction.user.avatarURL({
                                extension: 'png'
                            }) : "https://i.imgur.com/B91C90T.png"}`
                    })
                    .setColor('#FF5809')
                ],
                files: [],
                components: []
            });
            const user_id = get_str(button_id, '/', '_')
            const yearrr = get_str(button_id, '{', '}')
            const monthh = get_str(button_id, '[', ']').length === 1 ? `0${get_str(button_id, '[', ']')}` : get_str(button_id, '[', ']')
            const member = interaction.guild.members.cache.get(user_id)
            const user = member.user
            const canvas_user = createCanvas(128, 128)
            const ctx_user = canvas_user.getContext('2d')
            const img = loadImage(user.avatarURL({
                extension: 'png'
            }) ? user.avatarURL({
                extension: 'png'
            }) : "asset/yellow_discord.png")
            const imgg = await loadImage("asset/mhcat_white.png")
            img.then(async (img) => {
                ctx_user.save();
                roundedImage(ctx_user, 0, 0, 128, 128, 40);
                ctx_user.clip();
                ctx_user.drawImage(img, 0, 0, 128, 128);
                ctx_user.restore();
                const imggg = await loadImage("asset/verify_icon.png")

                const canvas = createCanvas(1000, 707)
                const ctx = canvas.getContext('2d')
                const background = loadImage("asset/background.png")
                let calebdar = calendar().of(Number(yearrr), Number(monthh) - 1)

                background.then((background) => {
                    ctx.drawImage(background, 0, 0);
                    var emptyData = ctx.getImageData(0, 0, 1000, 707);
                    emptyData = gaussBlur(emptyData);
                    ctx.putImageData(emptyData, 0, 0);

                    ctx.fillStyle = 'rgba(0,0,0,0.5)'
                    ctx.fillRect(0, 0, 1000, 7007);

                    ctx.beginPath();
                    ctx.lineWidth = 3;
                    //縱軸
                    ctx.moveTo(49, 197);
                    ctx.lineTo(951, 197);

                    ctx.moveTo(49, 272);
                    ctx.lineTo(951, 272);

                    ctx.moveTo(49, 347);
                    ctx.lineTo(951, 347);

                    ctx.moveTo(49, 422);
                    ctx.lineTo(951, 422);

                    ctx.moveTo(49, 497);
                    ctx.lineTo(951, 497);

                    ctx.moveTo(49, 572);
                    ctx.lineTo(951, 572);

                    //橫軸
                    ctx.moveTo(177, 147);
                    ctx.lineTo(177, 649);

                    ctx.moveTo(305, 147);
                    ctx.lineTo(305, 649);

                    ctx.moveTo(433, 147);
                    ctx.lineTo(433, 649);

                    ctx.moveTo(561, 147);
                    ctx.lineTo(561, 649);

                    ctx.moveTo(689, 147);
                    ctx.lineTo(689, 649);

                    ctx.moveTo(817, 147);
                    ctx.lineTo(817, 649);

                    ctx.strokeStyle = '#FFFFFF';
                    ctx.stroke();

                    ctx.font = "40px Comic Sans MS";
                    ctx.fillStyle = "#FFD306";
                    ctx.fillText("Sun.", 69, 185);
                    ctx.fillText("Mon.", 197, 185);
                    ctx.fillText("Tue.", 325, 185);
                    ctx.fillText("Wed.", 453, 185);
                    ctx.fillText("Thu.", 581, 185);
                    ctx.fillText("Fir.", 709, 185);
                    ctx.fillText("Sat.", 837, 185);

                    ctx.drawImage(canvas_user, 900, 35, 80, canvas_user.height * (80 / canvas_user.width))



                    ctx.drawImage(imgg, 20, 35, 65, 65)
                    ctx.fillStyle = "#00FFFF";
                    ctx.fillText(`${yearrr}/${monthh}`, 100, 89)
                    sign_list.findOne({
                        guild: interaction.guild.id,
                        member: user.id
                    }, async (err, data) => {
                        for (let x = 0; x < 7; x++) {
                            ctx.font = "45px Comic Sans MS";
                            ctx.fillStyle = x === 0 || x === 6 ? "#Ff0000" : "#A8FF24";
                            ctx.fillText(`${calebdar.calendar[0][x] === 0? '': calebdar.calendar[0][x]}`, 55 + x * 128, 252);
                            ctx.fillText(`${calebdar.calendar[1][x] === 0? '': calebdar.calendar[1][x]}`, 55 + x * 128, 327);
                            ctx.fillText(`${calebdar.calendar[2][x] === 0? '': calebdar.calendar[2][x]}`, 55 + x * 128, 402);
                            ctx.fillText(`${calebdar.calendar[3][x] === 0? '': calebdar.calendar[3][x]}`, 55 + x * 128, 477);
                            ctx.fillText(`${calebdar.calendar[4][x] === 0? '': calebdar.calendar[4][x]}`, 55 + x * 128, 552);
                            if (calebdar[5]) ctx.fillText(`${calebdar.calendar[5][x] === 0? '': calebdar.calendar[5][x]}`, 55 + x * 128, 627);
                            if (data ? data.date[yearrr] ? data.date[yearrr][monthh] ? data.date[yearrr][monthh].includes(`${calebdar.calendar[0][x]}`) : false : false : false) ctx.drawImage(imggg, 115 + x * 128, 202)
                            if (data ? data.date[yearrr] ? data.date[yearrr][monthh] ? data.date[yearrr][monthh].includes(`${calebdar.calendar[1][x]}`) : false : false : false) ctx.drawImage(imggg, 115 + x * 128, 277)
                            if (data ? data.date[yearrr] ? data.date[yearrr][monthh] ? data.date[yearrr][monthh].includes(`${calebdar.calendar[2][x]}`) : false : false : false) ctx.drawImage(imggg, 115 + x * 128, 352)
                            if (data ? data.date[yearrr] ? data.date[yearrr][monthh] ? data.date[yearrr][monthh].includes(`${calebdar.calendar[3][x]}`) : false : false : false) ctx.drawImage(imggg, 115 + x * 128, 427)
                            if (data ? data.date[yearrr] ? data.date[yearrr][monthh] ? data.date[yearrr][monthh].includes(`${calebdar.calendar[4][x]}`) : false : false : false) ctx.drawImage(imggg, 115 + x * 128, 502)
                            if (data ? data.date[yearrr] ? data.date[yearrr][monthh] ? data.date[yearrr][monthh].includes(`${calebdar[5] ? calebdar.calendar[5][x] : "321312312321321321312321"}`) : false : false : false) ctx.drawImage(imggg, 115 + x * 128, 577)
                        }
                        ctx.fillStyle = "#FFFFFF";
                        ctx.font = "30px font_new, TC, SC, JP, HK, font, Bengali, Arabic, emoji";
                        ctx.textAlign = 'center';
                        ctx.fillStyle = "#FFFFFF";
                        ctx.font = "45px TC, SC, JP, HK, font, Bengali, Arabic, emoji";
                        ctx.textAlign = 'right';
                        ctx.fillText(`${user.username}`, 880, 89)
                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setEmoji("<:lefft:1079286176332136480>")
                                .setCustomId(`/${user.id}_sing{${Number(yearrr) - 1}}-[${Number(monthh)}]`)
                                .setStyle(ButtonStyle.Secondary),
                                new ButtonBuilder()
                                .setEmoji("<:left:1079286186570436609>")
                                .setCustomId(`/${user.id}_sing{${Number(monthh) - 1 < 1 ? Number(yearrr) - 1 :  Number(yearrr)}}-[${Number(monthh) - 1 < 1 ? 12 : Number(monthh) - 1}]`)
                                .setStyle(ButtonStyle.Secondary),
                                new ButtonBuilder()
                                .setEmoji("<:right:1079285288645447730>")
                                .setCustomId(`/${user.id}_sing{${Number(monthh) + 1 > 12 ? Number(yearrr) + 1 :  Number(yearrr)}}-[${Number(monthh) + 1 > 12 ? 1 : Number(monthh) + 1}]`)
                                .setStyle(ButtonStyle.Secondary),
                                new ButtonBuilder()
                                .setEmoji("<:right_r:1079285582263500920>")
                                .setCustomId(`/${user.id}_sing{${Number(yearrr) + 1}}-[${monthh}]`)
                                .setStyle(ButtonStyle.Secondary)
                            );
                        const attachment = new AttachmentBuilder(canvas.toBuffer(), {
                            name: "sign.png"
                        });
                        interaction.editReply({
                            files: [attachment],
                            embeds: [],
                            components: [row]

                        });
                        return
                    })

                })
            })
        } else if (interaction.customId.includes('my-profile')) {

            function errorss(content) {
                const embed = new EmbedBuilder().setTitle(`<a:error:980086028113182730> | ${content}`).setColor("Red");
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            if (!interaction.guild.members.cache.get(button_id.replace('my-profile', ''))) return errorss('很抱歉，這位使用者已退出該伺服器!!')
            await interaction.update({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({
                        name: '正在努力為您尋找資料!',
                        iconURL: 'https://media.discordapp.net/attachments/991337796960784424/1076582216127230053/6209-loading-online-circle.gif'
                    })
                    .setFooter({
                        text: 'MHCAT 帶給你最好的discord體驗!',
                        iconURL: `${interaction.user.avatarURL({
                                extension: 'png'
                            }) ? interaction.user.avatarURL({
                                extension: 'png'
                            }) : "https://i.imgur.com/B91C90T.png"}`
                    })
                    .setColor('#FF5809')
                ],
                files: [],
                components: []
            });
            const user = interaction.guild.members.cache.get(button_id.replace('my-profile', '')).user
            const member = interaction.guild.members.cache.get(button_id.replace('my-profile', ''))
            //頭貼設置
            const canvas_user = createCanvas(128, 128)
            const ctx_user = canvas_user.getContext('2d')
            const img = loadImage(user.avatarURL({
                extension: 'png'
            }) ? user.avatarURL({
                extension: 'png'
            }) : "asset/yellow_discord.png")
            //頭貼load
            img.then((img) => {
                //背景設置
                const canvas = createCanvas(1500, 750)
                const ctx = canvas.getContext('2d')
                
                const background = loadImage("asset/background_profile.png")
                //背景圖片load
                background.then((background) => {
                    //背景放上去
                    ctx.drawImage(background, 0, 0);
                    //頭貼圓角
                    ctx_user.save();
                    roundedImage(ctx_user, 0, 0, 128, 128, 40);
                    ctx_user.clip();
                    ctx_user.drawImage(img, 0, 0, 128, 128);
                    ctx_user.restore();
                    // 頭貼放上去
                    ctx.drawImage(canvas_user, 42, 30, 98, canvas_user.height * (98 / canvas_user.width))
                    work_set.findOne({
                        guild: interaction.channel.guild.id,
                    }, async (err, work_set_data) => {
                        work_user.findOne({
                            guild: interaction.guild.id,
                            user: user.id
                        }, async (err, work_user_data) => {
                            gift_change.findOne({
                                guild: interaction.guild.id,
                            }, async (err, gift_change_data) => {
                                voice_xp.findOne({
                                    guild: interaction.guild.id,
                                    member: user.id,
                                }, async (err, voice_user_data) => {
                                    text_xp.findOne({
                                        guild: interaction.guild.id,
                                        member: user.id,
                                    }, async (err, text_user_data) => {
                                        text_xp.find({
                                            guild: interaction.guild.id,
                                        }, async (err, text_xp_data) => {
                                            voice_xp.find({
                                                guild: interaction.guild.id,
                                            }, async (err, voice_xp_data) => {
                                                coin.find({
                                                    guild: interaction.guild.id,
                                                }, async (err, coin_data) => {
                                                    coin.findOne({
                                                        guild: interaction.guild.id,
                                                        member: user.id
                                                    }, async (err, coin_user_data) => {
                                                        const findGreater = (arr, num) => {
                                                            const res = [];
                                                            for (let i = 0; i < arr.length; i++) {
                                                                if (arr[i] < num) {
                                                                    continue;
                                                                };
                                                                res.push(arr[i]);
                                                            };
                                                            return res;
                                                        };
                                                        //找到代幣排名
                                                        function get_coin_rank(params) {
                                                            if (coin_user_data) {
                                                                const array_02 = []
                                                                for (x = coin_data.length - 1; x > -1; x--) {
                                                                    array_02.push(coin_data[x].coin);
                                                                }
                                                                let result_02 = findGreater(array_02, coin_user_data.coin)
                                                                return result_02.length
                                                            } else {
                                                                return '沒有資料'
                                                            }

                                                        }
                                                        //找到語音排名
                                                        function get_voice_rank(params) {
                                                            if (voice_user_data) {
                                                                const array_01 = []
                                                                for (x = voice_xp_data.length - 1; x > -1; x--) {
                                                                    let b = 0
                                                                    for (y = voice_xp_data[x].leavel - 1; y > -1; y--) {
                                                                        b = b + parseInt(Number(y) * (Number(y) / 2)) * 100 + 100
                                                                    }
                                                                    array_01.push(b + 100 + Number(voice_xp_data[x].xp));
                                                                }
                                                                let m_01 = 0
                                                                for (y = voice_user_data.leavel - 1; y > -1; y--) {
                                                                    m_01 = m_01 + parseInt(Number(y) * (Number(y) / 2)) * 100 + 100
                                                                }
                                                                let result_01 = findGreater(array_01, (m_01 + 100 + Number(voice_user_data.xp)))
                                                                return result_01.length
                                                            } else {
                                                                return '沒有資料'
                                                            }
                                                        }

                                                        //找到聊天經驗排名
                                                        function get_text_rank(params) {
                                                            if (text_user_data) {
                                                                const array = []
                                                                for (x = text_xp_data.length - 1; x > -1; x--) {
                                                                    let b = 0
                                                                    for (y = text_xp_data[x].leavel - 1; y > -1; y--) {
                                                                        b = b + parseInt(Number(y) * (Number(y) / 3)) * 100 + 100
                                                                    }
                                                                    array.push(b + 100 + Number(text_xp_data[x].xp));
                                                                }

                                                                let m = 0
                                                                for (y = text_user_data.leavel - 1; y > 0; y--) {
                                                                    m = m + parseInt(Number(y) * (Number(y) / 3)) * 100 + 100
                                                                }
                                                                let result = findGreater(array, (m + 100 + Number(text_user_data.xp)))
                                                                return result.length
                                                            } else {
                                                                return '沒有資料!'
                                                            }
                                                        }






















                                                        //使用者名稱與伺服器名稱 字體等設定
                                                        ctx.fillStyle = "#d3d3d3";
                                                        ctx.font = "45px TC, SC, JP, HK, font, Bengali, Arabic, emoji";
                                                        ctx.textAlign = 'left';
                                                        //使用者名稱打印
                                                        let memebr_name = `${member.nickname ? member.nickname : user.username} #${user.discriminator}`
                                                        ctx.fillText(len(memebr_name) > 34 ? len(memebr_name.substr(0, 33)) > 34 ? `${memebr_name.substr(0, 16)}` : `${memebr_name.substr(0, 33)}` : memebr_name, 151, 80)
                                                        //設定結尾的4馬的顏色跟打印
                                                        ctx.fillStyle = '#8b8b8b'
                                                        //設定公會名稱相關，跟打印
                                                        ctx.font = "25px TC, SC, JP, HK, font, Bengali, Arabic, emoji";
                                                        ctx.fillStyle = '#a8a8a8'
                                                        ctx.fillText(`${interaction.guild.name}`, 151, 120)
                                                        //創建日期與加入日期
                                                        ctx.fillStyle = '#d3d3d3'
                                                        ctx.font = "40px Comic Sans MS";
                                                        ctx.fillText(`${moment(member.joinedTimestamp).format('YYYY/MM/DD')}`, 1220, 100)
                                                        ctx.fillText(`${moment(user.createdTimestamp).format('YYYY/MM/DD')}`, 960, 100)
                                                        //製作進度條
                                                        fillRoundRect(ctx, 550, 333, !text_user_data ? 0 : Math.round((Number(text_user_data.xp) / parseInt((Number(text_user_data.leavel) * (Number(text_user_data.leavel) / 3)) * 100 + 100).toFixed(3)) * 100) > 0 ? 35 + Math.round((Number(text_user_data.xp) / parseInt((Number(text_user_data.leavel) * (Number(text_user_data.leavel) / 3)) * 100 + 100).toFixed(3)) * 100) * 3.6 : 0, 35, 17.5, '#64ffbf');
                                                        fillRoundRect(ctx, 1038, 333, !voice_user_data ? 0 : Math.round((Number(voice_user_data.xp) / parseInt((Number(voice_user_data.leavel) * (Number(voice_user_data.leavel) / 2)) * 100 + 100).toFixed(3)) * 100) > 0 ? 35 + Math.round((Number(voice_user_data.xp) / parseInt((Number(voice_user_data.leavel) * (Number(voice_user_data.leavel) / 2)) * 100 + 100).toFixed(3)) * 100) * 3.6 : 0, 35, 17.5, '#ea79ff');
                                                        ctx.fillStyle = '#FF5809'
                                                        ctx.font = "30px font_xp";
                                                        ctx.textAlign = 'center';
                                                        //製作進度條訊息
                                                        ctx.fillText(`${text_user_data ? nFormatter(Number(text_user_data.xp)) : "0"}/${text_user_data ? nFormatter(parseInt((Number(text_user_data.leavel) * (Number(text_user_data.leavel) / 3)) * 100 + 100)): "0"}`, 750, 363)
                                                        ctx.fillStyle = '#28FF28'
                                                        ctx.fillText(`${voice_user_data ? nFormatter(Number(voice_user_data.xp)): "0"}/${voice_user_data ? nFormatter(parseInt((Number(voice_user_data.leavel) * (Number(voice_user_data.leavel) / 2)) * 100 + 100)): "0"}`, 1238, 363)
                                                        //伺服器排行榜的排名
                                                        ctx.fillStyle = '#FCFCFC'
                                                        ctx.font = "40px Comic Sans MS, TC, SC, JP, HK, font, Bengali, Arabic, emoji";
                                                        ctx.textAlign = 'center';
                                                        ctx.fillText(`#${get_text_rank()}`, 367, 243)
                                                        ctx.fillText(`#${get_voice_rank()}`, 367, 306)
                                                        ctx.fillText(`#${get_coin_rank()}`, 367, 369)
                                                        //聊天經驗
                                                        ctx.fillText(`${text_user_data ? nFormatter(Number(text_user_data.xp)): '沒有資料'}`, 864, 243)
                                                        ctx.fillText(`${!text_user_data ? "沒有資料" : text_user_data.leavel}`, 864, 306)
                                                        //語音經驗
                                                        ctx.fillText(`${voice_user_data ? nFormatter(Number(voice_user_data.xp)): "沒有資料"}`, 1351, 243)
                                                        ctx.fillText(`${!voice_user_data ? "沒有資料" : voice_user_data.leavel}`, 1351, 306)
                                                        //總代幣
                                                        ctx.fillText(`${!coin_user_data ? "0" : nFormatter(Number(coin_user_data.coin))}`, 295, 525)
                                                        ctx.fillText(`${!coin_user_data ? "沒有資料" : coin_user_data.today === 1 ? "已簽到" : coin_user_data.today === 0 ? "未簽到" : (Math.round(Date.now() / 1000) - coin_user_data.today) < (gift_change_data ? gift_change_data.time ? gift_change_data.time : 86400 : 86400) ? "已簽到" : "未簽到"}`, 295, 587)
                                                        ctx.fillText(`${work_user_data ? nFormatter(work_user_data.energi) : "0"}`, 639, 525)
                                                        ctx.fillText(`${work_user_data ? (work_user_data.end_time - Math.round(Date.now() / 1000)) > 0 ? `打工中` : '待業中' : "待業中"}`, 639, 587)
                                                        //伺服器相關設定
                                                        ctx.fillText(`${gift_change_data ? nFormatter(gift_change_data.coin_number) : "無資料"}`, 1045, 525)
                                                        ctx.fillText(`${gift_change_data ? nFormatter(gift_change_data.sign_coin) : "無資料"}`, 1045, 587)
                                                        ctx.fillText(`${work_set_data ? nFormatter(work_set_data.get_energy) : "無資料"}`, 1385, 525)
                                                        ctx.fillText(`${work_set_data ? nFormatter(work_set_data.max_energy) : "無資料"}`, 1385, 587)
                                                        ctx.fillText(`${gift_change_data ? nFormatter(gift_change_data.xp_multiple) : "無資料"}`, 1237, 587 + 65)
                                                        const row = new ActionRowBuilder()
                                                            .addComponents(
                                                                new ButtonBuilder()
                                                                .setEmoji("<:update:1020532095212335235>")
                                                                .setCustomId(user.id + 'my-profile')
                                                                .setLabel('更新')
                                                                .setStyle(ButtonStyle.Success)
                                                            );
                                                        //發送消息
                                                        const attachment = new AttachmentBuilder(canvas.toBuffer(), {
                                                            name: "user-info.png"
                                                        });
                                                        interaction.editReply({
                                                            files: [attachment],
                                                            embeds: [],
                                                            components: [row]
                                                        });
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        } else if (interaction.customId.includes('shardinfoupdate') || interaction.customId.includes('botinfoupdate')) {
            try {
                if (interaction.customId === 'shardinfoupdate') {
                    const botInfo = await client.receiveBotInfo();
                    const a = []
                    const test = {
                        name: `<:server:986064124209418251> 分片ID: ${botInfo.shardId}`,
                        value: `\`\`\`fix\n公會數量: ${botInfo.guild}\n使用者數量: ${botInfo.members}\n記憶體: ${botInfo.ram}\\${botInfo.rssRam} mb\n上線時間:${botInfo.uptime}\n延遲: ${botInfo.ping}\`\`\``,
                        inline: true
                    }
                    a.push(test)
                        const row = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setEmoji("<:update:1020532095212335235>")
                                .setCustomId('shardinfoupdate')
                                .setLabel('更新')
                                .setStyle(ButtonStyle.Success)
                            );
                        interaction.update({
                            embeds: [
                                new EmbedBuilder()
                                .setColor(`Random`)
                                .setTitle(`<:vagueness:999527612634374184> 以下是每個分片的資訊!!`)
                                .setFields(a)
                                .setTimestamp()
                            ],
                            components: [row]
                        })
                } else {
                    await interaction.deferReply({
                        ephemeral: true
                    });
                    const botInfo = await client.receiveBotInfo();
                    const a = []
                    let guildss = botInfo.guild
                    let membersss = botInfo.members
                    const totalRam = Math.round(os.totalmem() / 1024 / 1024);
                    const usedRam = Math.round((os.totalmem() - os.freemem()) / 1024 / 1024);
                    const osaa = require("os-utils");

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setEmoji("<:update:1020532095212335235>")
                            .setCustomId('botinfoupdate')
                            .setLabel('更新')
                            .setStyle(ButtonStyle.Success)
                        );
                    osaa.cpuUsage(function (v) {
                        const embed = new EmbedBuilder()
                            .setTitle("<a:mhcat:996759164875440219> MHCAT目前系統使用量:")
                            .addFields([{
                                    name: "<:cpu:986062422383161424> CPU型號:\n",
                                    value: `\`${os.cpus().map((i) => `${i.model}`)[0]}\``,
                                    inline: false
                                },
                                {
                                    name: "<:cpu:987630931932229632> CPU使用量:\n",
                                    value: `\`${(v * 100).toFixed(2)}\`**%**`,
                                    inline: true
                                },
                                {
                                    name: "<:vagueness:999527612634374184> 集群數量:\n",
                                    value: `\`${client.shard ? client.shard.count : 1}\` **個**`,
                                    inline: true
                                },
                                {
                                    name: "<:rammemory:986062763598155797> RAM使用量:",
                                    value: `\`${usedRam}\\${totalRam}\` **MB**\`(${((usedRam / totalRam) * 100).toFixed(2)}%)\``,
                                    inline: true
                                },
                                {
                                    name: "<:chronometer:986065703369080884> 開機時間:",
                                    value: `**<t:${Math.round((Date.now() / 1000) - process.uptime())}:R>**`,
                                    inline: true
                                },
                                {
                                    name: "<:server:986064124209418251> 總伺服器:",
                                    value: `\`${guildss}\``,
                                    inline: true
                                },
                                {
                                    name: `<:user:986064391139115028> 總使用者:`,
                                    value: `\`${membersss}\``,
                                    inline: true
                                },
                            ])
                            .setColor('Random')
                            .setTimestamp()
                        interaction.message.edit({
                            embeds: [embed],
                            components: [row]
                        })
                        interaction.editReply({
                            content: client.emoji.done + '** | 成功更新!**'
                        })
                    })

                }
            } catch (error) {
                interaction.editReply({
                    content: "opps,出現了錯誤!\n有可能是你設定沒設定好\n或是我沒有權限喔(請確認我的權限比你要加的權限高，還需要管理身分組的權限)"
                })
            }
            //身分組增加
        } else if (interaction.customId.includes('add') || interaction.customId.includes('delete')) {
            await interaction.deferReply({
                ephemeral: true
            });
            try {
                btn.findOne({
                    guild: interaction.guild.id,
                    number: interaction.customId,
                }, async (err, data) => {
                    if (err) throw err;
                    if (!data) {
                        return;
                    } else {
                        if (interaction.customId.includes('add')) {
                            const role = interaction.guild.roles.cache.get(data.role)
                            if (!role) return errors("請通知群主管裡員找不到這個身分組!")
                            if (interaction.member.roles.cache.has(role.id)) {
                                const error = new EmbedBuilder()
                                    .setColor("Red")
                                    .setTitle("<a:Discord_AnimatedNo:1015989839809757295> | 你已經擁有身分組了!")
                                interaction.editReply({
                                    embeds: [error],
                                    ephemeral: true
                                })

                            } else {
                                if (Number(role.position) >= Number(interaction.guild.members.me.roles.highest.position)) return errors("請通知群主管裡員我沒有權限給你這個身分組(請把我的身分組調高)!")
                                interaction.member.roles.add(role)
                                const add = new EmbedBuilder()
                                    .setColor("Green")
                                    .setTitle("<a:green_tick:994529015652163614> | 成功增加身分組!")
                                interaction.editReply({
                                    embeds: [add],
                                    ephemeral: true
                                })
                            }
                        } else if (interaction.customId.includes('delete')) {
                            const role = interaction.guild.roles.cache.get(data.role)
                            if (!role) return errors("找不到這個身分組!")
                            if (interaction.member.roles.cache.has(role.id)) {
                                if (Number(role.position) >= Number(interaction.guild.members.me.roles.highest.position)) return errors("請通知群主管裡員我沒有權限給你這個身分組(請把我的身分組調高)!")
                                interaction.member.roles.remove(role)
                                const warn = new EmbedBuilder()
                                    .setColor("Green")
                                    .setTitle("<a:green_tick:994529015652163614> | 成功刪除身分組!")
                                interaction.editReply({
                                    embeds: [warn],
                                    ephemeral: true
                                })
                            } else {
                                const warn = new EmbedBuilder()
                                    .setColor("Red")
                                    .setTitle("<a:Discord_AnimatedNo:1015989839809757295> |  你沒有這個身分組!")
                                interaction.editReply({
                                    embeds: [warn],
                                    ephemeral: true
                                })
                            }
                        } else {
                            interaction.editReply({
                                content: "很抱歉，出現了錯誤!",
                                ephemeral: true
                            })
                        }
                    }
                })
            } catch (error) {
                interaction.editReply({
                    content: "opps,出現了錯誤!\n有可能是你設定沒設定好\n或是我沒有權限喔(請確認我的權限比你要加的權限高，還需要管理身分組的權限)"
                })
            }
            //投票
        } else if (interaction.customId.includes("lotter")) {
            await interaction.deferReply({
                ephemeral: true
            });
            //投票收尋
            if (interaction.customId.includes("lottersearch")) {
                const iddd = interaction.customId.replace("search", '')
                lotter.findOne({
                    guild: interaction.guild.id,
                    id: iddd,
                }, async (err, data) => {
                    if (!data) return interaction.editReply({
                        content: "<a:Discord_AnimatedNo:1015989839809757295> | 這個抽獎已經因為時間過久而被刪除資料(結束超過30天)!",
                        ephemeral: true
                    })
                    if (data) {
                        const e = data.member.map(
                            (w, i) => `${interaction.guild.members.cache.get(w.id) ? interaction.guild.members.cache.get(w.id).user.username + '#' + interaction.guild.members.cache.get(w.id).user.discriminator : '使用者已消失!'}`
                        )
                        const a = data.member.map(
                            (w, i) => w.id
                        )

                        function timeConverter(UNIX_timestamp) {

                            const date = new Date(UNIX_timestamp);
                            const options = {
                                formatMatcher: 'basic',
                                timeZone: 'Asia/Taipei',
                                timeZoneName: 'long',
                                year: 'numeric',
                                month: "2-digit",
                                day: "2-digit",
                                hour12: false
                            };
                            return date.toLocaleTimeString('zh-TW', options)
                        }
                        const b = data.member.map(
                            (w, i) => `${interaction.guild.members.cache.get(w.id) ? interaction.guild.members.cache.get(w.id).user.username + '#' + interaction.guild.members.cache.get(w.id).user.discriminator : '使用者已退出伺服器!'}(id:${w.id})|參加時間:${!isNaN(w.time) ? timeConverter(w.time) : w.time}`
                        )
                        const match = a.find(element => {
                            if (element.includes(interaction.user.id)) {
                                return true;
                            } else {
                                return false;
                            }
                        });
                        let atc = new AttachmentBuilder(Buffer.from(`${b.join(`\n`)}`), {
                            name: 'discord.txt'
                        });
                        const embed = new EmbedBuilder()
                            .setTitle(`抽獎人數資訊`)
                            .setDescription(`<:list:992002476360343602>**目前共有**\`${e.length}\`**人參加抽獎**\n<:star:987020551698649138>**您是否有參加該抽獎:**${match ? '\`有\`' : '\`沒有\`'}\n\n${e.length < 100 ? '┃ ' + '' + e.join(' ┃ ') + '┃' : "**由於人數過多，無法顯示所有成員名稱!\n請使用`.txt`檔案觀看**"}`)
                            .setColor("Random")
                        const bt = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId(iddd + 'restart')
                                .setLabel('點我重抽!')
                                .setEmoji("<:votingbox:988878045882499092>")
                                .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                .setCustomId(iddd + 'stop')
                                .setLabel('點我取消此次抽獎!')
                                .setEmoji("<:warning:985590881698590730>")
                                .setStyle(ButtonStyle.Danger),
                            );

                        interaction.editReply({
                            content: (((data.owner && data.owner === interaction.member.id) || (interaction.guild.ownerId === interaction.user.id)) ? true : (!data.owner && interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) ? true : false) ? "<:shield:1019529265101930567> | 你有權限(創辦人或服主)執行終止抽獎或是重抽，是否要執行其中一項?" : null,
                            ephemeral: true,
                            components: (((data.owner && data.owner === interaction.member.id) || (interaction.guild.ownerId === interaction.user.id)) ? true : (!data.owner && interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) ? true : false) ? [bt] : null,
                            embeds: [embed],
                            files: [atc]
                        })
                    }
                })
                //重新投票
            } else if (interaction.customId.includes("lotterrestart")) {
                const iddd = interaction.customId.replace("restart", '')

                function getRandomArbitrary(min, max) {
                    min = Math.ceil(min);
                    max = Math.floor(max);
                    return Math.floor(Math.random() * (max - min) + min);
                }
                lotter.findOne({
                    guild: interaction.guild.id,
                    id: iddd,
                }, async (err, data) => {
                    if (!data) return interaction.editReply({
                        content: "<a:Discord_AnimatedNo:1015989839809757295> | 這個抽獎已經因為時間過久而被刪除資料(結束超過30天)!",
                        ephemeral: true
                    })
                    if (data) {
                        const winner_array = []
                        for (y = data.howmanywinner - 1; y > -1; y--) {
                            const winner = data.member[getRandomArbitrary(0, data.member.length)]
                            if (winner === undefined) {
                                y--
                            } else {
                                winner_array.push(winner.id)
                            }
                            const guild = client.guilds.cache.get(data.guild);
                            if (!guild) return
                            let channel = guild.channels.cache.get(data.message_channel);
                            if (!channel) return
                            const winner_embed = new EmbedBuilder()
                                .setTitle("<:fireworks:997374182016958494> 恭喜中獎者! <:fireworks:997374182016958494>")
                                .setDescription(data.member.length === 0 ? "**沒有人參加抽獎欸QQ**" : `
**<:celebration:997374188060946495> 恭喜:**
<@${winner_array.join('>\n<@')}>
<:gift:994585975445528576> **抽中:** ${data.gift}
`)
                                .setColor(interaction.guild.members.me.displayHexColor)
                                .setFooter({
                                    text: "沒抽中的我給你一個擁抱w"
                                })
                            channel.send({
                                content: `<@${winner_array.join('><@')}>`,
                                embeds: [winner_embed]
                            })
                            data.collection.updateOne(({
                                guild: data.guild,
                                id: data.id
                            }), {
                                $set: {
                                    end: true
                                }
                            })
                            data.save()
                            interaction.editReply({
                                content: "<a:green_tick:994529015652163614> | 成功重抽!",
                                ephemeral: true
                            })
                        }
                    }
                })


                //投票停止
            } else if (interaction.customId.includes("lotterstop")) {
                const iddd = interaction.customId.replace("stop", '')
                lotter.findOne({
                    guild: interaction.guild.id,
                    id: iddd,
                }, async (err, data) => {
                    if (!data) return interaction.editReply({
                        content: "<a:Discord_AnimatedNo:1015989839809757295> | 很抱歉，這個抽獎已經因為超過時間而刪除資料了!",
                        ephemeral: true
                    })
                    if (data) {
                        data.collection.updateOne(({
                            guild: data.guild,
                            id: data.id
                        }), {
                            $set: {
                                end: true
                            }
                        })
                        const greate = new EmbedBuilder()
                            .setColor("Green")
                            .setTitle("<a:green_tick:994529015652163614> | 成功取消此次抽獎!")
                        interaction.editReply({
                            embeds: [greate],
                            ephemeral: true
                        })
                    }
                })
            } else {
                lotter.findOne({
                    guild: interaction.guild.id,
                    id: interaction.customId,
                }, async (err, data) => {
                    if (!data) return interaction.editReply({
                        content: "<a:Discord_AnimatedNo:1015989839809757295> | 這個抽獎已經因為時間過久而被刪除資料(結束超過30天)!",
                        ephemeral: true
                    })
                    if (data) {
                        const match = data.member.find(element => {
                            if (element.id.includes(interaction.user.id)) {
                                return true;
                            } else {
                                return false;
                            }
                        });
                        if (match) {
                            if (data.end === true) return interaction.editReply({
                                content: "<a:Discord_AnimatedNo:1015989839809757295> | 很抱歉，這個抽獎已經過期!",
                                ephemeral: true
                            })
                            return interaction.editReply({
                                content: "<a:Discord_AnimatedNo:1015989839809757295> | 你無法重複參加!",
                                ephemeral: true
                            })
                        }
                        const date = Math.floor(Date.now() / 1000)
                        if (data.maxNumber !== null && data.member.length >= data.maxNumber) return interaction.editReply({
                            content: "<a:Discord_AnimatedNo:1015989839809757295> | 以達到最高參與人數",
                            ephemeral: true
                        })
                        if (Number(data.date) >= Number(date)) {
                            if (data.yesrole !== null && !interaction.member.roles.cache.some(role => role.id === data.yesrole)) return interaction.editReply({
                                content: "<a:Discord_AnimatedNo:1015989839809757295> | 很抱歉，創辦人設定你不能抽獎!",
                                ephemeral: true
                            })
                            if (data.norole !== null && interaction.member.roles.cache.some(role => role.id === data.norole)) return interaction.editReply({
                                content: "<a:Discord_AnimatedNo:1015989839809757295> | 很抱歉，創辦人設定你不能抽獎!",
                                ephemeral: true
                            })
                            const object = {
                                time: Date.now(),
                                id: interaction.user.id,
                            }
                            data.member.push(object)
                            data.save()
                            const greate = new EmbedBuilder()
                                .setColor("Green")
                                .setTitle("<a:green_tick:994529015652163614> | 成功參加抽獎!")
                            interaction.editReply({
                                embeds: [greate],
                                ephemeral: true
                            })
                        } else {
                            return interaction.editReply({
                                content: "<a:Discord_AnimatedNo:1015989839809757295> | 很抱歉，這個抽獎已經過期!",
                                ephemeral: true
                            })
                        }
                    } else {
                        return interaction.editReply({
                            content: "<a:Discord_AnimatedNo:1015989839809757295> | 這個抽獎已經找不到囉"
                        })
                    }
                })
            }










            //驗證
        } else if (interaction.customId.includes("verification")) {
            function errors1(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            const verification = require("../models/verification.js");
            verification.findOne({
                guild: interaction.guild.id,
            }, async (err, data) => {
                if (err) throw err;
                const role = interaction.guild.roles.cache.get(data.role)
                if (!role) return errors1("驗證身分組已經不存在了，請通管理員!")
                if (Number(role.position) >= Number(interaction.guild.members.me.roles.highest.position)) return errors1("請通知群主管裡員我沒有權限給你這個身分組(請把我的身分組調高)!")
                const text = interaction.customId.replace("verification", "")
                const {
                    ActionRowBuilder,
                    ModalBuilder,
                    TextInputBuilder,
                    TextInputStyle
                } = require('discord.js');
                const modal = new ModalBuilder()
                    .setCustomId(text + 'ver')
                    .setTitle('請輸入驗證碼!');
                const favoriteColorInput = new TextInputBuilder()
                    .setCustomId(text + 'ver')
                    .setLabel("請輸入圖片上的驗證碼")
                    .setStyle(TextInputStyle.Short);
                const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
                modal.addComponents(firstActionRow);
                await interaction.showModal(modal);
            })


        } else if (interaction.customId.includes("teach21point")) {
            await interaction.deferReply({
                ephemeral: true
            });
            interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setTitle("<:creativeteaching:986060052949524600> 以下是21點介紹")
                    .setDescription(`
**這邊的倍數是一個人的賭注等於1所以兩個人就會是2**
\`\`\`fix
1.機器人是莊
2.機器人自己發一張排給自己
3.給遊玩的兩個人各兩張牌
4.在發一張給自己
5.問兩個人要不要加牌，直到兩個都選擇不加或沒牌了
6.把莊家加超過13
7.莊如果大於21點，兩個人各獲得原本賭注的1.5倍
8.如果莊家沒爆，兩個人比
9.如果其中一個玩家爆，另一個拿走2倍賭注，爆的那個拿走0倍
10.如果兩個都爆等於平局，不加不減
11.如果其中兩人都沒報，比大小，贏的人拿走全部賭注
\`\`\`
**不會的話，玩玩看就知道ㄌ**`)
                    .setColor("Random")
                ],
                ephemeral: true
            })


        } else if (interaction.customId.includes("thansize")) {
            await interaction.deferReply({
                ephemeral: true
            });
            interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setTitle("<:creativeteaching:986060052949524600> 以下為比大小介紹")
                    .setDescription(`
**這邊的倍數是一個人的賭注等於1所以兩個人就會是2**
\`\`\`fix
1.同意遊玩
2.由機器人抽取兩位的數字(1-100)
3.比大小
4.大的拿走所有賭注
\`\`\`
**不會的話，玩玩看就知道ㄌ**`)
                    .setColor("Random")
                ],
                ephemeral: true
            })
        }
    } else if (interaction.isMessageComponent) {
        if (interaction.customId != 'helphelphelphelpmenu') return;
        await interaction.deferReply({
            ephemeral: true
        });
        const {
            description,
            emo
        } = require('../config.json')
        const {
            readdirSync
        } = require("fs");
        let {
            values
        } = interaction;
        let color = 'Random'
        let value = values[0];
        let cots = [];
        let catts = [];

        readdirSync("./slashCommands/").forEach((dir) => {
            if (dir.toLowerCase() !== value.toLowerCase()) return;
            const commands = readdirSync(`./slashCommands/${dir}/`).filter((file) =>
                file.endsWith(".js")
            );


            const cmds = commands.map((command) => {
                let file = require(`../slashCommands/${dir}/${command}`); //getting the commands again

                if (!file.name) return "沒有任何指令";

                let name1 = file.name.replace(".js", "");

                if (client.slash_commands.get(name1).hidden) return;
                let slashcommand = client.slash_commands.get(name1)
                let name = slashcommand.name_localizations ? slashcommand.name_localizations[interaction.guild.preferredLocale] : name1
                let des = slashcommand.description_localizations ? slashcommand.description_localizations[interaction.guild.preferredLocale] : slashcommand.description;
                let emo = slashcommand.emoji;
                let optionsa = slashcommand.options;
                let docs = slashcommand.docs;
                let emoe = emo ? `${emo}` : ``;
                let id = client.application.commands.cache.find(u => u.name === name1) ? client.application.commands.cache.find(u => u.name === name1).id : undefined 

                let obj = {
                    cname: `${emoe} </${name}`,
                    des,
                    optionsa,
                    docs,
                    id
                }
                return obj;
            });

            let dota = new Object();

            cmds.map(co => {
                if (co == undefined) return;
                if (co.optionsa?.[0]?.type === 1) {
                    for (let x = 0; x < co.optionsa.length; x++) {
                      let { name_localizations, name, description_localizations, description } = co.optionsa[x];
                      let localizedName = name_localizations?.[interaction.guild.preferredLocale] || name;
                      let localizedDescription = description_localizations?.[interaction.guild.preferredLocale] || description;
                      let dota = {
                        name: `${cmds.length === 0 ? "進行中" : "" + co.cname + " " + localizedName + `:${co.id ? co.id : '964185876559196181'}>`}`,
                        value: `${co.docs?.[x] ? `[前往文檔](https://docsmhcat.yorukot.me/${co.docs[x]})` : ''}\`\`\`fix\n${localizedDescription}\`\`\``,
                        inline: true,
                      };
                      catts.push(dota);
                    }
                  } else {
                    let dota = {
                      name: `${cmds.length === 0 ? "進行中" : "" + co.cname + ":964185876559196181>"}`,
                      value: co.des ? `\`\`\`fix\n${co.des}\`\`\`` : `\`沒有說明\``,
                      inline: true,
                    };
                    catts.push(dota);
                  }
            });

            cots.push(dir.toLowerCase());
        });

        if (cots.includes(value.toLowerCase())) {
            const combed = new EmbedBuilder()
                .setTitle(`__${emo[value.charAt(0).toUpperCase() + value.slice(1)]} ${value.charAt(0).toUpperCase() + value.slice(1)} 指令!__`)
                .setDescription(`> 使用 \`/help 指令名稱:\` 以獲取有關指令的更多信息!\n> 例: \`/help 指令名稱:公告發送\`\n\n`)
                .addFields(catts)
                .setColor(color)
                .setFooter({
                    text: `${interaction.user.tag}的查詢`,
                    iconURL: interaction.user.displayAvatarURL({
                        dynamic: true
                    })
                });

            return interaction.editReply({
                embeds: [combed],
                ephemeral: true
            })
        };
    }
    /*} catch (error) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setURL("https://discord.gg/7g7VE2Sqna")
                .setStyle(ButtonStyle.Link)
                .setLabel("支援伺服器")
                .setEmoji("<:customerservice:986268421144592415>"),
                new ButtonBuilder()
                .setURL("https://docsmhcat.yorukot.me")
                .setEmoji("<:worldwideweb:986268131284627507>")
                .setStyle(ButtonStyle.Link)
                .setLabel("官方網站")
            );
        return interaction.editReply({
            embeds: [new EmbedBuilder()
                .setTitle("<a:Discord_AnimatedNo:1015989839809757295> | 很抱歉，出現了錯誤!")
                .setDescription("**如果可以的話再麻煩幫我到支援伺服器回報w**" + `\n\`\`\`${error}\`\`\``)
                .setColor("Red")
            ],
            components: [row]
        })
    }*/
})

































function len(str) {
    return str.replace(/[^\x00-\xff]/g, "xx").length;
}




function roundedImage(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function nFormatter(num) {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num;
}



function fillRoundRect(cxt, x, y, width, height, radius, fillColor) {
    //圆的直径必然要小于矩形的宽高          
    if (2 * radius > width || 2 * radius > height) {
        return false;
    }

    cxt.save();
    cxt.translate(x, y);
    //绘制圆角矩形的各个边  
    drawRoundRectPath(cxt, width, height, radius);
    cxt.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值  
    cxt.fill();
    cxt.restore();
}


/**该方法用来绘制圆角矩形 
 *@param cxt:canvas的上下文环境 
 *@param x:左上角x轴坐标 
 *@param y:左上角y轴坐标 
 *@param width:矩形的宽度 
 *@param height:矩形的高度 
 *@param radius:圆的半径 
 *@param lineWidth:线条粗细 
 *@param strokeColor:线条颜色 
 **/
function strokeRoundRect(cxt, x, y, width, height, radius, lineWidth, strokeColor) {
    //圆的直径必然要小于矩形的宽高          
    if (2 * radius > width || 2 * radius > height) {
        return false;
    }

    cxt.save();
    cxt.translate(x, y);
    //绘制圆角矩形的各个边  
    drawRoundRectPath(cxt, width, height, radius);
    cxt.lineWidth = lineWidth || 2; //若是给定了值就用给定的值否则给予默认值2  
    cxt.strokeStyle = strokeColor || "#000";
    cxt.stroke();
    cxt.restore();
}

function drawRoundRectPath(cxt, width, height, radius) {
    cxt.beginPath(0);
    //从右下角顺时针绘制，弧度从0到1/2PI  
    cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

    //矩形下边线  
    cxt.lineTo(radius, height);

    //左下角圆弧，弧度从1/2PI到PI  
    cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

    //矩形左边线  
    cxt.lineTo(0, radius);

    //左上角圆弧，弧度从PI到3/2PI  
    cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);

    //上边线  
    cxt.lineTo(width - radius, 0);

    //右上角圆弧  
    cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);

    //右边线  
    cxt.lineTo(width, height - radius);
    cxt.closePath();
}





function get_str(str, first, last) {
    return str.substring(
        str.indexOf(first) + 1,
        str.lastIndexOf(last)
    );
}




function createSimpleObject(name, value) {
    var obj = {};
    obj[name] = value;
    return obj;
}

function createSimpleArray(name, value) {
    var obj = [];
    obj[name] = value;
    return obj;
}






//将数据进行高斯模糊
function gaussBlur(imgData) {
    var pixes = imgData.data;
    var width = imgData.width;
    var height = imgData.height;
    var gaussMatrix = [],
        gaussSum = 0,
        x, y,
        r, g, b, a,
        i, j, k, len;

    var radius = 5;
    var sigma = 5;

    a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
    b = -1 / (2 * sigma * sigma);
    //生成高斯矩阵
    for (i = 0, x = -radius; x <= radius; x++, i++) {
        g = a * Math.exp(b * x * x);
        gaussMatrix[i] = g;
        gaussSum += g;

    }

    //归一化, 保证高斯矩阵的值在[0,1]之间
    for (i = 0, len = gaussMatrix.length; i < len; i++) {
        gaussMatrix[i] /= gaussSum;
    }
    //x 方向一维高斯运算
    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            r = g = b = a = 0;
            gaussSum = 0;
            for (j = -radius; j <= radius; j++) {
                k = x + j;
                if (k >= 0 && k < width) { //确保 k 没超出 x 的范围
                    //r,g,b,a 四个一组
                    i = (y * width + k) * 4;
                    r += pixes[i] * gaussMatrix[j + radius];
                    g += pixes[i + 1] * gaussMatrix[j + radius];
                    b += pixes[i + 2] * gaussMatrix[j + radius];
                    // a += pixes[i + 3] * gaussMatrix[j];
                    gaussSum += gaussMatrix[j + radius];
                }
            }
            i = (y * width + x) * 4;
            // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
            // console.log(gaussSum)
            pixes[i] = r / gaussSum;
            pixes[i + 1] = g / gaussSum;
            pixes[i + 2] = b / gaussSum;
            // pixes[i + 3] = a ;
        }
    }
    //y 方向一维高斯运算
    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            r = g = b = a = 0;
            gaussSum = 0;
            for (j = -radius; j <= radius; j++) {
                k = y + j;
                if (k >= 0 && k < height) { //确保 k 没超出 y 的范围
                    i = (k * width + x) * 4;
                    r += pixes[i] * gaussMatrix[j + radius];
                    g += pixes[i + 1] * gaussMatrix[j + radius];
                    b += pixes[i + 2] * gaussMatrix[j + radius];
                    // a += pixes[i + 3] * gaussMatrix[j];
                    gaussSum += gaussMatrix[j + radius];
                }
            }
            i = (y * width + x) * 4;
            pixes[i] = r / gaussSum;
            pixes[i + 1] = g / gaussSum;
            pixes[i + 2] = b / gaussSum;
        }
    }
    return imgData;
}