require('dotenv').config();
const { ShardingManager } = require('discord.js');
const chalk = require("chalk");
const moment = require("moment");

const manager = new ShardingManager('./index.js', {
    token: process.env.TOKEN,
    totalShards: 'auto',
    respawn: true,
    timeout: 30000,
    spawnTimeout: -1,
});

const end_start = chalk.hex("#4DFFFF");

manager.on('shardCreate', shard => {
    console.log(
        chalk.hex("#FFFF37").bold("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓")
    );
    console.log(
        chalk.hex("#FFFF37").bold(
            `┃             分片${shard.id}正在啟動            ┃`
        )
    );
    console.log(
        chalk.hex("#FFFF37").bold("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛")
    );
});

manager.spawn();

// Error handling
process.on("unhandledRejection", (reason, p) => {
    console.log(moment().utcOffset("+08:00").format("YYYYMMDDHHmm"));
    console.log(end_start("\n[🚩 崩潰通知] 未處理的拒絕:"));
    console.log(reason.stack ? reason.stack : reason);
    console.log(end_start("=== 未處理的拒絕 ==="));
});

process.on("uncaughtException", (err, origin) => {
    console.log(moment().utcOffset("+08:00").format("YYYYMMDDHHmm"));
    console.log(end_start("\n[🚩 崩潰通知] 未捕獲的異常"));
    console.log(err);
    console.log(origin);
    console.log(end_start("=== 未捕獲的異常 ===\n"));
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.log(moment().utcOffset("+08:00").format("YYYYMMDDHHmm"));
    console.log(end_start("\n[🚩 崩潰通知] 未捕獲的異常監視器"));
    console.log(err);
    console.log(origin);
    console.log(end_start("=== 未捕獲的異常監視器 ===\n"));
});

process.on("exit", (code) => {
    console.log(moment().utcOffset("+08:00").format("YYYYMMDDHHmm"));
    console.log(end_start("\n[🚩 崩潰通知] 退出"));
    console.log(code);
    console.log(end_start("=== 退出 ===\n"));
});