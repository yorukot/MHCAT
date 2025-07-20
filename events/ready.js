const client = require('../index')
const {
    EmbedBuilder,
    WebhookClient
} = require('discord.js')
const config = require('../config')

const readywebhook = new WebhookClient({
    url: process.env.READY_WEBHOOK
})
client.once('ready', () => {
    const chalk = require('chalk')
    console.log(chalk.hex('#00FFFF').bold('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'))
    console.log(chalk.hex('#00FFFF').bold(`┃           分片${client.shard ? client.shard.ids[0] : 0}機器人成功上線            ┃`))
    console.log(chalk.hex('#00FFFF').bold('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛'))
    let embed = new EmbedBuilder()
        .setTitle(`**分片${client.shard ? client.shard.ids[0] : 0} | ${client.user.username}**已就緒`)
        .setColor("Green")
    if (client.user.id !== "984485913201635358") readywebhook.send({
        embeds: [embed]
    })
    client.user.setPresence({
        activities: [{
            name: `/help | mhcat.yorukot.me`
        }],
        status: 'idle',
        type: "idle"
    })
    
    /*let i = 0
    setInterval(() => {
        i = i + 1
        aaa.findOne({
            guild: Math.floor(Math.random() * 100000) + 1,
        }, async (err, data1) => {
            if(!data1){
                console.log(`${i} + aaa`)
                data1 = new aaa({
                    guild: Math.floor(Math.random() * 100000) + 1,
                    parent: Math.floor(Math.random() * 100000) + 1,
                    memberNumber: Math.floor(Math.random() * 100000) + 1,
                    memberNumber_name: Math.floor(Math.random() * 100000) + 1,
                    userNumber: Math.floor(Math.random() * 100000) + 1,
                    userNumber_name: Math.floor(Math.random() * 100000) + 1,
                    BotNumber: Math.floor(Math.random() * 100000) + 1,
                    BotNumber_name: Math.floor(Math.random() * 100000) + 1,
                    channelnumber: Math.floor(Math.random() * 100000) + 1,
                    channelnumber_name: Math.floor(Math.random() * 100000) + 1,
                    textnumber: Math.floor(Math.random() * 100000) + 1,
                    textnumber_name: Math.floor(Math.random() * 100000) + 1,
                    voicenumber: Math.floor(Math.random() * 100000) + 1,
                    voicenumber_name: Math.floor(Math.random() * 100000) + 1,
                    categoriesnumber: Math.floor(Math.random() * 100000) + 1,
                    categoriesnumber_name: Math.floor(Math.random() * 100000) + 1,
                    rolesnumber: Math.floor(Math.random() * 100000) + 1,
                    rolesnumber_name: Math.floor(Math.random() * 100000) + 1,
                    rolenumber: Math.floor(Math.random() * 100000) + 1,
                    rolenumber_name: Math.floor(Math.random() * 100000) + 1,
                    norolenumber: Math.floor(Math.random() * 100000) + 1,
                    norolenumber_name: Math.floor(Math.random() * 100000) + 1,
                    emojisnumber: Math.floor(Math.random() * 100000) + 1, 
                    emojisnumber_name: Math.floor(Math.random() * 100000) + 1,
                    staticnumber: Math.floor(Math.random() * 100000) + 1,
                    staticnumber_name: Math.floor(Math.random() * 100000) + 1,
                    gifnumber: Math.floor(Math.random() * 100000) + 1,
                    gifnumber_name: Math.floor(Math.random() * 100000) + 1,
                    stickersnumber:Math.floor(Math.random() * 100000) + 1,
                    stickersnumber_name: Math.floor(Math.random() * 100000) + 1,
                    boostsnumber: Math.floor(Math.random() * 100000) + 1,
                    boostsnumber_name: Math.floor(Math.random() * 100000) + 1,
                    tier: Math.floor(Math.random() * 100000) + 1,
                    tier_name: Math.floor(Math.random() * 100000) + 1,
                    onlinenumber: Math.floor(Math.random() * 100000) + 1,
                    onlinenumber_name: Math.floor(Math.random() * 100000) + 1,
                    dndnumber: Math.floor(Math.random() * 100000) + 1,
                    dndnumber_name: Math.floor(Math.random() * 100000) + 1,
                    idlenumber: Math.floor(Math.random() * 100000) + 1,
                    idlenumber_name: Math.floor(Math.random() * 100000) + 1,
                    offlinenumber: Math.floor(Math.random() * 100000) + 1,
                    offlinenumber_name: Math.floor(Math.random() * 100000) + 1,
                    onlinebotnumber: Math.floor(Math.random() * 100000) + 1,
                    onlinebotnumber_name: Math.floor(Math.random() * 100000) + 1,
                    statusnumber: Math.floor(Math.random() * 100000) + 1,
                    statusnumber_name: Math.floor(Math.random() * 100000) + 1,
                })
                data1.save()
            }else{
                console.log(`${i} + bbb`)
                data1.delete()
                data1 = new aaa({
                    guild: Math.floor(Math.random() * 100000) + 1,
                    parent: Math.floor(Math.random() * 100000) + 1,
                    memberNumber: Math.floor(Math.random() * 100000) + 1,
                    memberNumber_name: Math.floor(Math.random() * 100000) + 1,
                    userNumber: Math.floor(Math.random() * 100000) + 1,
                    userNumber_name: Math.floor(Math.random() * 100000) + 1,
                    BotNumber: Math.floor(Math.random() * 100000) + 1,
                    BotNumber_name: Math.floor(Math.random() * 100000) + 1,
                    channelnumber: Math.floor(Math.random() * 100000) + 1,
                    channelnumber_name: Math.floor(Math.random() * 100000) + 1,
                    textnumber: Math.floor(Math.random() * 100000) + 1,
                    textnumber_name: Math.floor(Math.random() * 100000) + 1,
                    voicenumber: Math.floor(Math.random() * 100000) + 1,
                    voicenumber_name: Math.floor(Math.random() * 100000) + 1,
                    categoriesnumber: Math.floor(Math.random() * 100000) + 1,
                    categoriesnumber_name: Math.floor(Math.random() * 100000) + 1,
                    rolesnumber: Math.floor(Math.random() * 100000) + 1,
                    rolesnumber_name: Math.floor(Math.random() * 100000) + 1,
                    rolenumber: Math.floor(Math.random() * 100000) + 1,
                    rolenumber_name: Math.floor(Math.random() * 100000) + 1,
                    norolenumber: Math.floor(Math.random() * 100000) + 1,
                    norolenumber_name: Math.floor(Math.random() * 100000) + 1,
                    emojisnumber: Math.floor(Math.random() * 100000) + 1, 
                    emojisnumber_name: Math.floor(Math.random() * 100000) + 1,
                    staticnumber: Math.floor(Math.random() * 100000) + 1,
                    staticnumber_name: Math.floor(Math.random() * 100000) + 1,
                    gifnumber: Math.floor(Math.random() * 100000) + 1,
                    gifnumber_name: Math.floor(Math.random() * 100000) + 1,
                    stickersnumber:Math.floor(Math.random() * 100000) + 1,
                    stickersnumber_name: Math.floor(Math.random() * 100000) + 1,
                    boostsnumber: Math.floor(Math.random() * 100000) + 1,
                    boostsnumber_name: Math.floor(Math.random() * 100000) + 1,
                    tier: Math.floor(Math.random() * 100000) + 1,
                    tier_name: Math.floor(Math.random() * 100000) + 1,
                    onlinenumber: Math.floor(Math.random() * 100000) + 1,
                    onlinenumber_name: Math.floor(Math.random() * 100000) + 1,
                    dndnumber: Math.floor(Math.random() * 100000) + 1,
                    dndnumber_name: Math.floor(Math.random() * 100000) + 1,
                    idlenumber: Math.floor(Math.random() * 100000) + 1,
                    idlenumber_name: Math.floor(Math.random() * 100000) + 1,
                    offlinenumber: Math.floor(Math.random() * 100000) + 1,
                    offlinenumber_name: Math.floor(Math.random() * 100000) + 1,
                    onlinebotnumber: Math.floor(Math.random() * 100000) + 1,
                    onlinebotnumber_name: Math.floor(Math.random() * 100000) + 1,
                    statusnumber: Math.floor(Math.random() * 100000) + 1,
                    statusnumber_name: Math.floor(Math.random() * 100000) + 1,
                })
                data1.save()
            }
            
        })   
    }, 33);*/
})