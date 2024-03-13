

//Constatnes

const Discord = require("discord.js")
const { Client, Intents, MessageActionRow, MessageButton } = require('discord.js');
const mongoose = require('mongoose')
const config = require('./config.json')
const axios = require('axios')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

const client = new Client({
  intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});



const fs = require('fs');
let { readdirSync } = require('fs');


//Error catch

process.on('unhandledRejection', error => {
  console.error(error);
});
client.on('shardError', error => {
  console.error(error);
});

//Handlers

client.commands = new Discord.Collection()

fs.readdirSync('./commands').forEach(async (categorys) => {

  const commandFiles = fs.readdirSync(`./commands/${categorys}`).filter((archivo) => archivo.endsWith('js'))
  for (const archivo of commandFiles) {
    const command = require(`./commands/${categorys}/${archivo}`)
    client.commands.set(command.name, command)
  }
})

const eventFiles = fs.readdirSync('./eventos').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./eventos/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

function presence() {
  let statuses = [
    `${config.status}`,
    `${client.users.cache.size} usuarios`
  ];

  setInterval(function () {

    let status = statuses[Math.floor(Math.random() * statuses.length)];
    client.user.setActivity(status, { type: "WATCHING", status: 'dnd' });

  }, 10000);

}

client.on("ready", () => {
  presence();
});

client.slashcommand = new Discord.Collection()

fs.readdirSync('./slashcommands').forEach(async (categorys) => {
  const commandFilesSlash = fs.readdirSync(`./slashcommands/${categorys}`).filter((archivo) => archivo.endsWith('js'))
  for (const archivo of commandFilesSlash) {
    const command = require(`./slashcommands/${categorys}/${archivo}`)
    client.slashcommand.set(command.data.name, command)
  }
})


client.on('interactionCreate', async interaction => {

  if (interaction.isCommand()) {
    const command = client.slashcommand.get(interaction.commandName)
    if (!command) return;

    try {
      await command.run(client, interaction)
    } catch (e) {
      console.log(e)
      return interaction.reply({ content: `Hubo un error **${e}**`, ephemeral: true })
    }

  } else if (interaction.isAutocomplete()) {

    const command = client.slashcommand.get(interaction.commandName)

    if (!command) return;

    try {
      await command.autocomplete(client, interaction);
    } catch (error) {
      console.error(error);
    }

  }

})



client.on('ready', () => {
  console.log(`Logeado como: ${client.user.tag}`)
});

require('./slashcommands')

client.on('messageCreate', async (message) => {

  let prefix = config.prefix
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();


  let cmd = client.commands.find((c) => c.name === command || c.alias && c.alias.includes(command));


  if (cmd) {
    try {
      cmd.execute(client, message, args)
    } catch (e) {
      return;
    }
  }

});

client.once('ready', () => {
    console.log('Bot listo!');
});

client.login(config.token)
