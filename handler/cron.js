var CronJob = require('cron').CronJob;
const client = require('../index');
const cron_set = require('../models/cron_set.js')
const work_user = require('../models/work_user.js')
const work_set = require('../models/work_set.js')
const {
    InteractionType,
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
setTimeout(() => {
    let guilds = client.guilds.cache
    let array = []
    guilds.map(x => {
        array.push(x.id)
    })
    cron_set.find({
        guild: { $in: array}
    }, async (err, data) => {
        if (data.length === 0) return;
        for (let i = 0; i < data.length; i++) {
            const guild = client.guilds.cache.get(data[i].guild)
            if (guild) {
                if (data[i].cron === null) return data[i].delete()
                const x = i
                const job = new CronJob(
                    data[x].cron,
                    function () {
                        const guild = client.guilds.cache.get(data[x].guild)
                        if (!guild) return 
                        const channel = guild.channels.cache.get(data[x].channel)
                        if (!channel) return 
                        const auto = data[x].id
                        cron_set.findOne({
                            guild: guild.id,
                            id: auto
                        }, async (err, data) => {
                            if (!data) {
                                return job.stop()
                            } else {
                                let test = data.message.embeds ? data.message.embeds[0] ? [new EmbedBuilder(data.message.embeds[0].data)] : null : null
                                channel.send({
                                    content: data.message.content,
                                    embeds: test
                                })
                            }
                        })
                    },
                    null,
                    true,
                    'Asia/Taipei'
                );
            }
        }
    })
}, 60 * 1500);

if (client.shard && client.shard.ids[0] === 0) {
    cron_set.find({
    }, async (err, data) => {
        if (!data) return;
        for (let i = 0; i < data.length; i++) {
            if (data[i].cron === null) data[i].delete()
        }
    })
    const job = new CronJob(
        '5 13 * * *',
        async function () {
            const coin = require('../models/coin.js')
            const gift_change = require("../models/gift_change.js");

            try {
                // Reset "today" for all coins except guilds with active gift_change time.
                const excludedGuilds = await gift_change.distinct('guild', { time: { $ne: 0 } });
                const coinResult = await coin.updateMany({ guild: { $nin: excludedGuilds } }, { $set: { today: 0 } });
                console.log('[cron] coin reset', { matched: coinResult.matchedCount, modified: coinResult.modifiedCount, excludedGuilds });
            } catch (err) {
                console.error('cron: coin reset failed', err);
            }

            try {
                const workConfigs = await work_set.find({});

                await Promise.all(workConfigs.map(async (config) => {
                    const { guild, max_energy, get_energy } = config;
                    // Bump energy where it is below the cap.
                    const incResult = await work_user.updateMany({ guild, energi: { $lt: max_energy } }, { $inc: { energi: get_energy } });
                    // Clamp anything that crossed the cap.
                    const clampResult = await work_user.updateMany({ guild, energi: { $gt: max_energy } }, { $set: { energi: max_energy } });
                    console.log('[cron] work energy refill', { guild, incremented: incResult.modifiedCount, clamped: clampResult.modifiedCount });
                }));
            } catch (err) {
                console.error('cron: work energy refill failed', err);
            }

        },
        null,
        true,
        'Asia/Taipei'
    );
}
