const coin = require("../../models/coin.js");
const gift_change = require("../../models/gift_change.js");
const voice_xp = require("../../models/voice_xp.js");
const text_xp = require("../../models/text_xp.js");
const work_user = require('../../models/work_user.js')
const work_set = require('../../models/work_set.js')
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
    Embed
} = require('discord.js');
const moment = require("moment")
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
module.exports = {
    name: 'my-profile',
    cooldown: 10,
    description: 'Check about data in specific server!!',
    name_localizations: {
        "zh-TW": "我的檔案",
        "zh-CN": "我的档案",
        "en-US": "my-profile",
        "en-GB": "my-profile",
    },
    description_localizations: {
        "zh-TW": "查看自己在伺服器內的所有資料!",
        "zh-CN": "查看自己在伺服器内的所有资料!",
        "en-US": "Check about data in specific server!",
        "en-GB": "Check about data in specific server!",
    },
    options: [{
        name: 'user',
        name_localizations: {
            "zh-TW": "使用者",
            "zh-CN": "使用者",
            "en-US": "user",
            "en-GB": "user",
        },
        type: ApplicationCommandOptionType.User,
        description: '查詢某位使用者的資料',
        description_localizations: {
            "zh-TW": "查詢某位使用者的資料!",
            "zh-CN": "查询某位使用者的资料!",
            "en-US": "Check a users data!",
            "en-GB": "Check a users data!",
        },
        required: false,
    }],
    video: 'https://docsmhcat.yorukot.me/docs/snig',
    emoji: `<:sign:997374180632825896>`,
    run: async (client, interaction, options, perms) => {
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            await interaction.reply({
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
                ]
            });
            const user = interaction.options.getUser('user') ? interaction.options.getUser('user') : interaction.user
            const member = await interaction.guild.members.fetch(user.id)
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
                const backgroundPromise = loadImage("asset/background_profile.png")
                //背景圖片load
                backgroundPromise.then((background) => {
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
        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
}



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