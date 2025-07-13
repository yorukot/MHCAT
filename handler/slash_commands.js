const client = require('../index');
const fs = require('fs');
const {
    readdirSync
} = fs;
const {
    token
} = require('../config.json')
const { REST, Routes } = require('discord.js');
const rest = new REST({ version: '10' }).setToken(token);
client.once('ready', () => {
    setTimeout(() => {
        readdirSync('./slashCommands').forEach(async (dir) => {
            const commands = readdirSync(`./slashCommands/${dir}/`).filter((file) =>
                file.endsWith(".js")
            )

            commands.map(async cmd => {
                let file = require(`../slashCommands/${dir}/${cmd}`);

                let name = file.name || null;
                let name_localizations = file.name_localizations || null;
                let description = file.description || null;
                let description_localizations = file.description_localizations || null;
                let options = file.options || [];
                let DefaultMemberPermissions = file.DefaultMemberPermissions || [];
                const data = {
                    name,
                    name_localizations,
                    description,
                    description_localizations,
                    options,
                    DefaultMemberPermissions,
                }

                let option = name == "No command name." ? `${name} | ❌斜線命令加載失敗` : `${name} | ✅ 斜線命令加載`;
                if (option.includes('✅ 斜線命令加載')) {
                    setTimeout(async () => {
                        client.slash_commands.set(name, {
                            ...data,
                            emoji: file.emoji,
                            UserPerms: file.UserPerms,
                            run: file.run,
                            video: file.video,
                            docs: file.docs
                        });
                        await client.application.commands.create(data)
                    }, 500);
                }
                
            })
        })
        setTimeout(() => { 
            rest.get(Routes.applicationCommands(client.user.id))
            .then(data => {
                for (const command of data) {
                    client.application.commands.fetch(`${command.id}`)
                    .then( (command1) => {
                    if(!client.slash_commands.get(command1.name)){
                        rest.delete(Routes.applicationCommand(client.user.id, command1.id))
                        .catch()
                    }
                    }).catch(console.error);
            }
        });
        }, 1000);
    }, 500);
})