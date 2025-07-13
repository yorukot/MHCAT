const voice_xp = require("../../models/voice_xp.js");
const canvacord = require("canvacord")
const text_xp_channel = require('../../models/text_xp_channel.js');
var validateColor = require("validate-color").default;

function checkURL(image) {
    return (image.match(/\.(jpg|png)$/) != null);
}
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

const moment = require('moment')
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
    name: '語音排行榜',
    cooldown: 10,
    description: '查詢語音經驗的排行榜',
    //video: 'https://docsmhcat.yorukot.me/commands/announcement.html',
    emoji: `<:level1:985947371957547088>`,
    run: async (client, interaction, options, perms) => {
        try {

        function errors(content) {
            const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
            interaction.reply({
                embeds: [embed]
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
        voice_xp.find({
            guild: interaction.guild.id,
        }, async (err, data1) => {
            const array = []
            for (x = data1.length - 1; x > -1; x--) {
                let b = 0
                for (y = data1[x].leavel - 1; y > -1; y--) {
                    b = b + parseInt(Number(y) * (Number(y) / 3)) * 100
                }
                array.push({
                    xp_totle: b + 100 + Number(data1[x].xp),
                    member: data1[x].member,
                    leavel: data1[x].leavel,
                    xp: data1[x].xp
                });
            }
            var byDate = array.slice(0);
            byDate.sort(function (a, b) {
                return b.xp_totle - a.xp_totle;
            });

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

            const a = byDate.map(
                (w, i) => `${nFormatter(w.xp_totle)}`
            )

            const e = byDate.map(
                (w, i) => `${client.users.cache.get(w.member) ? client.users.cache.get(w.member).tag : '找不到該名使用者'}`
            )

            //const number = Number(interaction.customId.replace("getmusic", ""))
            const number = 0
            const canvas_user = createCanvas(128, 128)
            const ctx_user = canvas_user.getContext('2d')
            voice_xp.findOne({
                guild: interaction.guild.id,
                member: interaction.user.id
            }, async (err, coin_user_data) => {
                const img = loadImage(interaction.guild.iconURL({
                    extension: 'png'
                }) ? interaction.guild.iconURL({
                    extension: 'png'
                }) : "asset/blue_discord.png")
                //頭貼load
                img.then((img) => {
                    //背景設置
                    const canvas = createCanvas(1000, 500)
                    const ctx = canvas.getContext('2d')
                    const background = loadImage ("asset/rank_background.png")
                    //背景圖片load
                    background.then((background) => {
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
                                const array = []
                                for (x = data1.length - 1; x > -1; x--) {
                                    let b = 0
                                    for (y = data1[x].leavel - 1; y > -1; y--) {
                                        b = b + parseInt(Number(y) * (Number(y) / 3)) * 100 + 100
                                    }
                                    array.push(b + 100 + Number(data1[x].xp));
                                }

                                let m = 0
                                for (y = coin_user_data.leavel - 1; y > 0; y--) {
                                    m = m + parseInt(Number(y) * (Number(y) / 3)) * 100 + 100
                                }
                                let result = findGreater(array, (m + 100 + Number(coin_user_data.xp)))
                                return result.length
                            } else {
                                return '沒有資料!'
                            }
                        }
                        
                        function get_coin_rank_number() {
                            if (coin_user_data) {
                                const array_02 = []
                                for (x = data1.length - 1; x > -1; x--) {
                                    array_02.push(data1[x].xp);
                                }
                                let result_02 = findGreater(array_02, coin_user_data.xp)
                                return result_02.length
                            } else {
                                return '沒有資料'
                            }

                        }



                        //背景放上去
                        ctx.drawImage(background, 0, 0);
                        //頭貼圓角
                        ctx_user.save();
                        roundedImage(ctx_user, 0, 0, 128, 128, 40);
                        ctx_user.clip();
                        ctx_user.drawImage(img, 0, 0, 128, 128);
                        ctx_user.restore();
                        // 頭貼放上去
                        ctx.drawImage(canvas_user, 33, 10, 70, canvas_user.height * (70 / canvas_user.width))

                        //設定字體等相關
                        ctx.fillStyle = "#d3d3d3";
                        ctx.font = "37px TC, SC, JP, HK, font, Bengali, Arabic, emoji";
                        ctx.textAlign = 'left';
                        //伺服器名稱輸入
                        ctx.fillText(len(interaction.guild.name) > 34 ? len(interaction.guild.name.substr(0, 33)) > 34 ? `${interaction.guild.name.substr(0, 16)}` : `${interaction.guild.name.substr(0, 33)}` : interaction.guild.name, 115, 50)
                        ctx.font = "30px Comic Sans MS, TC, SC, JP, HK, font, Bengali, Arabic, emoji";
                        ctx.textAlign = 'left';
                        ctx.fillText(moment(interaction.guild.createdTimestamp).format('YYYY/MM/DD'), 790, 70)
                        ctx.textAlign = 'center';
                        ctx.fillText(get_coin_rank(), 710, 70)

                        ctx.font = "20px TC, SC, JP, HK, font, Bengali, Arabic, emoji";
                        ctx.fillStyle = '#a8a8a8'
                        ctx.textAlign = 'left';
                        ctx.fillText(`語音經驗排行榜`, 118, 74)
                        //輸入排名
                        ctx.fillStyle = "#FFFF";
                        let font_size = number > 99 && number < 1000 ? 30 : number > 999 ? 25 : 40
                        ctx.font = `${font_size}px Comic Sans MS,TC, SC, JP, HK, font, Bengali, Arabic, emoji`;
                        ctx.textAlign = 'center';
                        for (let index = 1; index < 6; index++) {
                            ctx.fillText(`${number * 10 + index}`, 73, 146 + ((index - 1) * 74))
                            ctx.fillText(`${number * 10 + (index + 5)}`, 73 + 484, 146 + ((index - 1) * 74))
                        }
                        //輸入使用者名稱
                        ctx.font = `25px TC, SC, JP, HK, font, Bengali, Arabic, emoji`;
                        ctx.textAlign = 'left';
                        for (let index = 1; index < 6; index++) {
                            ctx.fillText(`${e[number * 10 + index - 1] ? `${len(e[number*10 + index - 1]) > 34 ? len(e[number*10 + index - 1].substr(0, 33)) > 34 ? e[number*10 + index - 1].substr(0, 16) : e[number*10 + index - 1].substr(0, 33) : e[number*10 + index - 1]}` : ""}`, 121, 131 + ((index - 1) * 74))
                            ctx.fillText(`${e[number * 10 + (index + 4)] ? `${len(e[number*10 + index + 4]) > 34 ? len(e[number*10 + index + 4].substr(0, 33)) > 34 ? e[number*10 + index + 4].substr(0, 16) : e[number*10 + index + 4].substr(0, 33) : e[number*10 + index + 4]}` : ""}`, 121 + 484, 131 + ((index - 1) * 74))
                        }
                        //輸入使用者擁有的代幣量
                        ctx.font = `15px Comic Sans MS, TC, SC, JP, HK, font, Bengali, Arabic, emoji`;
                        for (let index = 1; index < 6; index++) {
                            ctx.fillText(`${a[number * 10 + index - 1] ? a[number * 10 + index - 1]  : ""}`, 137, 153 + ((index - 1) * 74))
                            ctx.fillText(`${a[number * 10 + index + 4] ? a[number * 10 + index + 4]  : ""}`, 137 + 484, 153 + ((index - 1) * 74))
                        }

                        //製作按鈕
                        const bt100 = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId(`[${interaction.member.id}]{${number - 10}}voice_rank`)
                                .setEmoji("<:lefft:1079286176332136480>")
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(number - 10 < 0 ? true : false),
                                new ButtonBuilder()
                                .setCustomId(`[${interaction.member.id}]{${number - 1}}voice_rank`)
                                .setEmoji("<:left:1079286186570436609>")
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(number - 1 === -1 ? true : false),
                                new ButtonBuilder()
                                .setCustomId(`text_rank`)
                                .setLabel(`${number + 1}/${Math.ceil(e.length / 10)}`)
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setCustomId(`[${interaction.member.id}]{${number + 1}}voice_rank`)
                                .setEmoji("<:right:1079285288645447730>")
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(number + 1 >= Math.ceil(e.length / 10) ? true : false),
                                new ButtonBuilder()
                                .setCustomId(`[${interaction.member.id}]{${number + 10}}voice_rank`)
                                .setEmoji("<:right_r:1079285582263500920>")
                                .setStyle(ButtonStyle.Success)
                                .setDisabled(number + 10 >= Math.ceil(e.length / 10) ? true : false),
                            )
                        const bt101 = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setCustomId(`text_rank1`)
                                .setEmoji("<:__:1079291288748314655>")
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setCustomId(`text_rank2`)
                                .setEmoji("<:__:1079291288748314655>")
                                .setStyle(ButtonStyle.Secondary)
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setCustomId(`[${interaction.member.id}]voice_rank {${Math.trunc(get_coin_rank() / 10)}}`)
                                .setEmoji("<:aim:1079305123773284422>")
                                .setStyle(ButtonStyle.Secondary),
                                new ButtonBuilder()
                                .setCustomId(`text_rank4`)
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji("<:__:1079291288748314655>")
                                .setDisabled(true),
                                new ButtonBuilder()
                                .setCustomId(`text_rank5`)
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji("<:__:1079291288748314655>")
                                .setDisabled(true),
                            );

                        //發送消息
                        const attachment = new AttachmentBuilder(canvas.toBuffer(), {
                            name: "user-info.png"
                        });
                        interaction.editReply({
                            files: [attachment],
                            embeds: [],
                            components: get_coin_rank() === '沒有資料' ? [bt100] : [bt100, bt101]
                        });
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