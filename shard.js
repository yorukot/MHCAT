require('dotenv').config();
const { ClusterManager, ReClusterManager, HeartbeatManager } = require(
  "discord-hybrid-sharding",
);
const config = require("./config");
const fetch = require('node-fetch');
const chalk = require("chalk");
const moment = require("moment");
const manager = new ClusterManager(`${__dirname}/index.js`, {
  totalShards: 'auto',
  shardsPerClusters: 1,
  mode: "process",
  token: process.env.TOKEN,
  totalClusters: "auto",
});
let optional = {
  totalShards: 'auto',
  shardsPerClusters: 1,
  mode: "process",
  token: process.env.TOKEN,
  totalClusters: "auto",
};
manager.extend(
  new ReClusterManager(),
  new HeartbeatManager({
    interval: 5000,
    maxMissedHeartbeats: 3,
  }),
);

manager.on("clusterCreate", (cluster) => {
  console.log(
    chalk.hex("#FFFF37").bold("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓"),
  );
  console.log(
    chalk.hex("#FFFF37").bold(
      `┃             集群${cluster.id}正在啟動            ┃`,
    ),
  );
  console.log(
    chalk.hex("#FFFF37").bold("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛"),
  );
  cluster.on("message", (message) => {
    console.log(message.raw.content);
    if (message.raw.content === "MHCAT restart now") {
      manager.recluster?.start({ restartMode: "rolling", optional });
    }
  });
});

manager.on('shardCreate', shard => {
  console.log(`Shard ${shard.id} launched`);
});

manager.spawn({ timeout: -1 });

const end_start = chalk.hex("#4DFFFF");

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
  console.log(end_start("=== 褪出 ===\n"));
});