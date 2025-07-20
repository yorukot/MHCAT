require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Options } = require('discord.js');

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
    ws: {
        large_threshold: 250,
        properties: {
            os: process.platform,
            browser: 'Discord.js',
            device: 'Discord.js'
        }
    }
});

client.once('ready', () => {
    console.log('✅ Bot is ready!');
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`Connected to ${client.guilds.cache.size} guilds`);
    process.exit(0);
});

client.on('error', (error) => {
    console.error('❌ Client error:', error);
    process.exit(1);
});

console.log('🔄 Starting bot test...');

client.login(process.env.TOKEN).catch(error => {
    console.error('❌ Login failed:', error);
    process.exit(1);
});

// Timeout after 30 seconds
setTimeout(() => {
    console.error('❌ Test timeout - bot took too long to start');
    process.exit(1);
}, 30000); 