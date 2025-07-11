const client = require('../index');
const {
    EmbedBuilder,
    WebhookClient
} = require('discord.js')
const readywebhook = new WebhookClient({
    url: process.env.READY_WEBHOOK
})

const MAX_PING = 400;
const MAX_FAILS = 3;

let fails = 0;

client.on('ready', () => {
    setTimeout(() => {
    console.log(`Logged in as ${client.user.tag} with ${client.cluster.id}`);
  
    setInterval(() => {
      const ping = client.ws.ping;
      console.log(`${client.cluster.id} Ping: ${ping}ms`);
      
      if (ping > MAX_PING || !ping) {
        console.log(`${client.cluster.id} Ping too high, ${fails + 1} fails`);
        
        fails++;
        
        if (fails >= MAX_FAILS) {
          let embed = new EmbedBuilder()
          .setTitle(`正在重啟${client.cluster.id}!`)
          .setColor("Green")
      if (client.user.id !== "984485913201635358") readywebhook.send({
          embeds: [embed]
      })
          console.log(`${client.cluster.id} Max fails reached, restarting...`);
          console.log(`${client.cluster.id} Restarting...`);
          process.exit(0);
        }
      } else {
        fails = 0;
      }
    }, 30000); 
  }, 60000);
})