require('dotenv').config();
const {
    Collection,
    Client,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    WebhookClient,
    GatewayIntentBits,
    Partials,
    Options
} = require('discord.js');
const moment = require("moment")
const admin = ["1045177533320134657", "579544867626024960", "230217502385373184"]

const client = new Client({
    makeCache: Options.cacheWithLimits({
        ReactionManager: 10,
        GuildMemberManager: {
            maxSize: Infinity,
            keepOverLimit: member => member.id === client.user.id,
        },
    }),
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
    ],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
    sweepers: {
        messages: {
            interval: 600,
            lifetime: 300,
        },
    },
    // Add connection options for better VPS performance
    ws: {
        large_threshold: 250,
        properties: {
            os: process.platform,
            browser: 'Discord.js',
            device: 'Discord.js'
        }
    }
});

module.exports = client;

const {
    color,
    emoji
} = require("./config.json");
const mongoose = require("mongoose");
mongoose.set('strictQuery', false);

// Optimize MongoDB connection for VPS
const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 30000, // Keep trying to send operations for 30 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    bufferMaxEntries: 0, // Disable mongoose buffering
    bufferCommands: false, // Disable mongoose buffering
    heartbeatFrequencyMS: 10000, // Every 10 seconds
    maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
    retryWrites: true,
    retryReads: true
};

mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING, mongooseOptions).then(test => {
    const chalk = require('chalk')
    console.log(chalk.hex('#28FF28').bold('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'))
    console.log(chalk.hex('#28FF28').bold('┃          成功連線至資料庫            ┃'))
    console.log(chalk.hex('#28FF28').bold('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛'))
}).catch(err => {
    console.error('MongoDB connection error:', err);
    // Don't exit immediately, let the process handle it
});

// Add MongoDB connection event handlers
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
});

client.commands = new Collection()
client.config = require('./config.json')
client.prefix = client.config.prefix
client.aliases = new Collection()
client.slash_commands = new Collection();
client.color = color
client.emoji = emoji

// Load handlers with error handling
try {
    require('./handler/slash_commands');
    require('./handler')(client);
    require('./handler/channel_status');
    require('./handler/gift');
    require('./handler/cron');
} catch (error) {
    console.error('Error loading handlers:', error);
}

const chalk = require('chalk');
const end_start = chalk.hex('#4DFFFF');

client.on('messageCreate', async (message) => {
    if ((message.author && admin.includes(message.author.id) && message.content === "MHCAT restart now") || (message.author?.id === "1085973338238754848" && message.content === "請MHCAT開始執行重啟任務!")) {
        // Use Discord.js native shard restart
        if (client.shard) {
            client.shard.respawnAll();
        }
        message.reply(`<a:emoji_92:1075595165747650570> **| 開始對MHCAT的分片進行零停機重啟!**`)
    }
})

process.on("unhandledRejection", (reason, p) => {
    console.log(moment().utcOffset("+08:00").format('YYYYMMDDHHmm'))
    console.log(end_start("\n[🚩 崩潰通知] 未處理的拒絕:"));
    console.log((reason.stack ? reason.stack : reason))
    console.log(end_start("=== 未處理的拒絕 ==="));
});
process.on("uncaughtException", (err, origin) => {
    console.log(moment().utcOffset("+08:00").format('YYYYMMDDHHmm'))
    console.log(end_start("\n[🚩 崩潰通知] 未捕獲的異常"));
    console.log(err)
    console.log(origin)
    console.log(end_start("=== 未捕獲的異常 ===\n"));
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(moment().utcOffset("+08:00").format('YYYYMMDDHHmm'))
    console.log(end_start("\n[🚩 崩潰通知] 未捕獲的異常監視器"));
    console.log(err)
    console.log(origin)
    console.log(end_start("=== 未捕獲的異常監視器 ===\n"));
});
process.on("beforeExit", (code) => {
    const webhookClient = new WebhookClient({ url:'https://discord.com/api/webhooks/1085973338238754848/LKhKMjZHtI79ETab2-7yOufBEKtlOKiPyJsWFcALxgVQAyrJKyZB7qwTpLL36HLBqDRN' });
    webhookClient.send({
        content: '請MHCAT開始執行重啟任務!',
    });
    console.log(moment().utcOffset("+08:00").format('YYYYMMDDHHmm'))
    console.log(end_start("\n[🚩 崩潰通知] 退出前"));
    console.log(code)
    console.log(end_start("=== 退出前 ===\n"));
});
process.on("exit", (code) => {
    console.log(moment().utcOffset("+08:00").format('YYYYMMDDHHmm'))
    console.log(end_start("\n[🚩 崩潰通知] 退出"));
    console.log(code)
    console.log(end_start("=== 退出 ===\n"));
});

client.receiveBotInfo = async () => {
    function format(seconds) {
        function pad(s) {
            return (s < 10 ? '0' : '') + s;
        }
        var hours = Math.floor(seconds / (60 * 60));
        var minutes = Math.floor(seconds % (60 * 60) / 60);
        var seconds = Math.floor(seconds % 60);
        return pad(hours) + 'h' + pad(minutes) + 'm' + pad(seconds) + "s";
    }
    
    // Use Discord.js native shard info
    const shardId = client.shard ? client.shard.ids[0] : 0;
    const guild = client.guilds.cache.size;
    const members = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
    const ram = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(0);
    const rssRam = (process.memoryUsage().rss / 1024 / 1024).toFixed(0);
    const ping = client.ws.ping;
    const uptime = format(process.uptime())
    
    return {
        shardId,
        guild,
        members,
        ram,
        rssRam,
        ping,
        uptime
    }
}

// Add login with retry mechanism for VPS
let loginAttempts = 0;
const maxLoginAttempts = 3;

async function loginWithRetry() {
    try {
        await client.login(process.env.TOKEN);
    } catch (error) {
        loginAttempts++;
        console.error(`Login attempt ${loginAttempts} failed:`, error);
        
        if (loginAttempts < maxLoginAttempts) {
            console.log(`Retrying login in 5 seconds... (attempt ${loginAttempts + 1}/${maxLoginAttempts})`);
            setTimeout(loginWithRetry, 5000);
        } else {
            console.error('Max login attempts reached. Exiting...');
            process.exit(1);
        }
    }
}

loginWithRetry();