require('dotenv').config();
const { ShardingManager } = require('discord.js');
const chalk = require("chalk");
const moment = require("moment");

const manager = new ShardingManager('./index.js', {
    token: process.env.TOKEN,
    totalShards: 'auto',
    respawn: true,
    timeout: 300000, // Increased to 5 minutes
    spawnTimeout: 300000, // Increased to 5 minutes
    mode: 'process', // Explicitly set process mode for better stability
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

    // Add shard event listeners for better debugging
    shard.on('spawn', () => {
        console.log(chalk.hex('#00FF00')(`分片 ${shard.id} 已生成`));
    });

    shard.on('ready', () => {
        console.log(chalk.hex('#00FF00')(`分片 ${shard.id} 已就緒`));
    });

    shard.on('disconnect', () => {
        console.log(chalk.hex('#FF0000')(`分片 ${shard.id} 已斷線`));
    });

    shard.on('reconnecting', () => {
        console.log(chalk.hex('#FFFF00')(`分片 ${shard.id} 正在重連`));
    });

    shard.on('death', () => {
        console.log(chalk.hex('#FF0000')(`分片 ${shard.id} 已死亡`));
    });

    // Add error handling for individual shards
    shard.on('error', (error) => {
        console.error(chalk.hex('#FF0000')(`分片 ${shard.id} 錯誤:`), error);
    });
});

// Add error handling for the manager itself
manager.on('error', (error) => {
    console.error(chalk.hex('#FF0000')('分片管理器錯誤:'), error);
});

// Add spawn error handling
manager.on('spawn', (shard) => {
    console.log(chalk.hex('#00FF00')(`分片 ${shard.id} 開始生成`));
});

// Add ready event for manager
manager.on('ready', () => {
    console.log(chalk.hex('#00FF00').bold('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓'));
    console.log(chalk.hex('#00FF00').bold('┃           分片管理器已就緒            ┃'));
    console.log(chalk.hex('#00FF00').bold('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛'));
});

manager.spawn({ timeout: 300000 }).catch(error => {
    console.error(chalk.hex('#FF0000')('分片管理器生成失敗:'), error);
    process.exit(1);
});

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