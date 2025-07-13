const coin = require("../../models/coin.js");
const gift_change = require("../../models/gift_change.js");
const sign_list = require("../../models/sign_list.js");
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
    errorMonitor
} = require("ws");
const moment = require("moment")
const calendar = require('calendar-js')
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
registerFont(`./fonts/Comic-Sans-MS-copy-5-.ttf`, {
    family: 'Comic Sans MS'
})


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

module.exports = {
    name: '簽到',
    cooldown: 60,
    description: '簽到來獲得代幣',
    video: 'https://docsmhcat.yorukot.me/docs/snig',
    emoji: `<:sign:997374180632825896>`,
    run: async (client, interaction, options, perms) => {


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
        try {
            function errors(content) {
                const embed = new EmbedBuilder().setTitle(`<a:Discord_AnimatedNo:1015989839809757295> | ${content}`).setColor("Red");
                interaction.editReply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            let error = ''
            coin.findOne({
                guild: interaction.guild.id,
                member: interaction.member.id
            }, async (err, data) => {
                gift_change.findOne({
                    guild: interaction.guild.id,
                }, async (err, data1111) => {
                    if (!data) {
                        data = new coin({
                            guild: interaction.guild.id,
                            member: interaction.member.id,
                            coin: data1111 ? data1111.sign_coin : 25,
                            today: !data1111 || ((data1111.time && data1111.time === 0)) ? 1 : Math.round(Date.now() / 1000)
                        })
                        data.save()
                    } else if (!data1111) {
                        if (data.today === 1) return error = `⚠ | 你今天已經簽到過了!請於隔天(0:00)後再來簽到!`
                        if (data.coin + Number((data1111 ? data1111.sign_coin : 25)) > 999999999) return errors("⚠ | 不可以加超過`999999999`!!")
                        data.collection.updateOne(({
                            guild: interaction.channel.guild.id,
                            member: interaction.member.id
                        }), {
                            $set: {
                                today: 1
                            }
                        })
                        data.collection.updateOne(({
                            guild: interaction.channel.guild.id,
                            member: interaction.member.id
                        }), {
                            $set: {
                                coin: data.coin + (data1111 ? data1111.sign_coin : 25)
                            }
                        })
                    } else if (data1111.time === 0) {
                        if (data.today === 1) return error = `⚠ | 你今天已經簽到過了!請於隔天(0:00)後再來簽到!`
                        if (data.coin + Number((data1111 ? data1111.sign_coin : 25)) > 999999999) return errors("⚠ | 不可以加超過`999999999`!!")
                        data.collection.updateOne(({
                            guild: interaction.channel.guild.id,
                            member: interaction.member.id
                        }), {
                            $set: {
                                today: 1
                            }
                        })
                        data.collection.updateOne(({
                            guild: interaction.channel.guild.id,
                            member: interaction.member.id
                        }), {
                            $set: {
                                coin: data.coin + (data1111 ? data1111.sign_coin : 25)
                            }
                        })
                    } else {
                        if ((Math.round(Date.now() / 1000) - data.today) < (data1111 ? data1111.time ? data1111.time : 86400 : 86400)) return error = `⚠ | 你今天已經簽到過了喔!`
                        if (data.coin + Number((data1111 ? data1111.sign_coin : 25)) > 999999999) return error = "⚠ | 不可以加超過`999999999`!!"
                        data.collection.updateOne(({
                            guild: interaction.channel.guild.id,
                            member: interaction.member.id
                        }), {
                            $set: {
                                today: Math.round(Date.now() / 1000)
                            }
                        })
                        data.collection.updateOne(({
                            guild: interaction.channel.guild.id,
                            member: interaction.member.id
                        }), {
                            $set: {
                                coin: data.coin + (data1111 ? data1111.sign_coin : 25)
                            }
                        })
                    }
                    error = '🎉 | 今天有準時簽到很棒喔! 明天也要記得來簽到.w.'
                })
            })
            sign_list.findOne({
                guild: interaction.guild.id,
                member: interaction.member.id
            }, async (err, data) => {
                let ddddd = moment().utcOffset('+08:00').format('DD')
                if (String(moment().utcOffset('+08:00').format('DD')).slice(0, 1) === "0") ddddd = String(moment().utcOffset('+08:00').format('DD')).slice(1, 2)
                let month = createSimpleObject(moment().utcOffset('+08:00').format('MM'), [ddddd])
                let year = createSimpleObject(moment().utcOffset('+08:00').format('yyyy'), month)
                if (!data) {
                    data = new sign_list({
                        guild: interaction.guild.id,
                        member: interaction.member.id,
                        date: year,
                    })
                    data.save()
                } else if (!data.date[moment().utcOffset('+08:00').format('yyyy')]) {
                    var obj = data.date
                    obj[moment().utcOffset('+08:00').format('yyyy')] = month
                    data.collection.updateOne(({
                        guild: interaction.channel.guild.id,
                        member: interaction.member.id
                    }), {
                        $set: {
                            date: obj
                        }
                    })
                } else if (!data.date[moment().utcOffset('+08:00').format('yyyy')][moment().utcOffset('+08:00').format('MM')]) {
                    var obj = data.date
                    var obj_1 = data.date
                    obj[moment().utcOffset('+08:00').format('yyyy')][moment().utcOffset('+08:00').format('MM')] = [ddddd]
                    data.collection.updateOne(({
                        guild: interaction.channel.guild.id,
                        member: interaction.member.id
                    }), {
                        $set: {
                            date: obj
                        }
                    })
                } else if (!data.date[moment().utcOffset('+08:00').format('yyyy')][moment().utcOffset('+08:00').format('MM')][ddddd]) {
                    let test = data.date[moment().utcOffset('+08:00').format('yyyy')][moment().utcOffset('+08:00').format('MM')]
                    test.push(ddddd)
                    var obj = data.date
                    obj[moment().utcOffset('+08:00').format('yyyy')][moment().utcOffset('+08:00').format('MM')] = test
                    data.collection.updateOne(({
                        guild: interaction.channel.guild.id,
                        member: interaction.member.id
                    }), {
                        $set: {
                            date: obj
                        }
                    })
                } else {
                    return
                }
            })










            const canvas_user = createCanvas(128, 128)
            const ctx_user = canvas_user.getContext('2d')
            const img = loadImage(interaction.user.avatarURL({
                extension: 'png'
            }) ? interaction.user.avatarURL({
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
                let calebdar = calendar().of(Number(moment().utcOffset('+08:00').format('yyyy')), Number(moment().utcOffset('+08:00').month()))

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
                    ctx.fillText("Fri.", 709, 185);
                    ctx.fillText("Sat.", 837, 185);

                    ctx.drawImage(canvas_user, 900, 35, 80, canvas_user.height * (80 / canvas_user.width))



                    ctx.drawImage(imgg, 20, 35, 65, 65)
                    ctx.fillStyle = "#00FFFF";
                    ctx.fillText(`${moment().utcOffset('+08:00').format('yyyy/MM')}`, 100, 89)
                    sign_list.findOne({
                        guild: interaction.guild.id,
                        member: interaction.member.id
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
                            if (data ? data.date[moment().utcOffset('+08:00').format('yyyy')] ? data.date[moment().utcOffset('+08:00').format('yyyy')][moment().utcOffset('+08:00').format('MM')] ? data.date[moment().utcOffset('+08:00').format('yyyy')][moment().utcOffset('+08:00').format('MM')].includes(`${calebdar.calendar[0][x]}`) : false : false : false) ctx.drawImage(imggg, 115 + x * 128, 202)
                            if (data ? data.date[moment().utcOffset('+08:00').format('yyyy')] ? data.date[moment().utcOffset('+08:00').format('yyyy')][moment().utcOffset('+08:00').format('MM')] ? data.date[moment().utcOffset('+08:00').format('yyyy')][moment().utcOffset('+08:00').format('MM')].includes(`${calebdar.calendar[1][x]}`) : false : false : false) ctx.drawImage(imggg, 115 + x * 128, 277)
                            if (data ? data.date[moment().utcOffset('+08:00').format('yyyy')] ? data.date[moment().utcOffset('+08:00').format('yyyy')][moment().utcOffset('+08:00').format('MM')] ? data.date[moment().utcOffset('+08:00').format('yyyy')][moment().utcOffset('+08:00').format('MM')].includes(`${calebdar.calendar[2][x]}`) : false : false : false) ctx.drawImage(imggg, 115 + x * 128, 352)
                            if (data ? data.date[moment().utcOffset('+08:00').format('yyyy')] ? data.date[moment().utcOffset('+08:00').format('yyyy')][moment().utcOffset('+08:00').format('MM')] ? data.date[moment().utcOffset('+08:00').format('yyyy')][moment().utcOffset('+08:00').format('MM')].includes(`${calebdar.calendar[3][x]}`) : false : false : false) ctx.drawImage(imggg, 115 + x * 128, 427)
                            if (data ? data.date[moment().utcOffset('+08:00').format('yyyy')] ? data.date[moment().utcOffset('+08:00').format('yyyy')][moment().utcOffset('+08:00').format('MM')] ? data.date[moment().utcOffset('+08:00').format('yyyy')][moment().utcOffset('+08:00').format('MM')].includes(`${calebdar.calendar[4][x]}`) : false : false : false) ctx.drawImage(imggg, 115 + x * 128, 502)
                            if (data ? data.date[moment().utcOffset('+08:00').format('yyyy')] ? data.date[moment().utcOffset('+08:00').format('yyyy')][moment().utcOffset('+08:00').format('MM')] ? data.date[moment().utcOffset('+08:00').format('yyyy')][moment().utcOffset('+08:00').format('MM')].includes(`${calebdar[5] ? calebdar.calendar[5][x] : "321312312321321321312321"}`) : false : false : false) ctx.drawImage(imggg, 115 + x * 128, 577)
                        }
                        ctx.fillStyle = "#FFFFFF";
                        ctx.font = "30px font_new, TC, SC, JP, HK, font, Bengali, Arabic, emoji";
                        ctx.textAlign = 'center';
                        ctx.fillText(`${error}`, 500, 690)
                        ctx.fillStyle = "#FFFFFF";
                        ctx.font = "45px TC, SC, JP, HK, font, Bengali, Arabic, emoji";
                        ctx.textAlign = 'right';
                        ctx.fillText(`${interaction.user.username}`, 880, 89)
                        const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setEmoji("<:lefft:1079286176332136480>")
                            .setCustomId(`/${interaction.user.id}_sing{${Number(moment().utcOffset('+08:00').format('yyyy')) - 1}}-[${Number(moment().utcOffset('+08:00').format('MM'))}]`)
                            .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                            .setEmoji("<:left:1079286186570436609>")
                            .setCustomId(`/${interaction.user.id}_sing{${Number(moment().utcOffset('+08:00').format('MM')) - 1 < 1 ? Number(moment().utcOffset('+08:00').format('yyyy')) - 1 :  Number(moment().utcOffset('+08:00').format('yyyy'))}}-[${Number(moment().utcOffset('+08:00').format('MM')) - 1 < 1 ? 12 : Number(moment().utcOffset('+08:00').format('MM')) - 1}]`)
                            .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                            .setEmoji("<:right:1079285288645447730>")
                            .setCustomId(`/${interaction.user.id}_sing{${Number(moment().utcOffset('+08:00').format('MM')) + 1 > 12 ? Number(moment().utcOffset('+08:00').format('yyyy')) + 1 :  Number(moment().utcOffset('+08:00').format('yyyy'))}}-[${Number(moment().utcOffset('+08:00').format('MM')) + 1 > 12 ? 1 : Number(moment().utcOffset('+08:00').format('MM')) + 1}]`)
                            .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                            .setEmoji("<:right_r:1079285582263500920>")
                            .setCustomId(`/${interaction.user.id}_sing{${Number(moment().utcOffset('+08:00').format('yyyy')) + 1}}-[${moment().utcOffset('+08:00').format('MM')}]`)
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
        } catch (error) {
            const error_send = require('../../functions/error_send.js')
            error_send(error, interaction)
        }
    }
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