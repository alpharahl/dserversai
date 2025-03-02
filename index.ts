const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const { token } = require("./config.json");
const { SlashCommandBuilder } = require('discord.js');

const fs = require("node:fs")
const path = require("node:path")


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
})

client.commands = new Collection()

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".ts"))
  for (const file of commandFiles){
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command){
      client.commands.set(command.data.name, command);
    } else {
      console.warn(`Command at ${filePath} is missing required data or execute`);
    }
  }
}

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  console.log(interaction)
  const command = interaction.client.commands.get(interaction.commandName);
  if(!command){
    console.error(`No command matching ${interaction.commandName} was found`)
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error){
    console.error(error);
    if (interaction.replied || interaction.deferred){
      await interaction.followUp({
        content: "There was an error executing this command!",
        ephemeral: true,
      })
    } else {
      await interaction.reply({
        content: "There was an error executing this command!",
        ephemeral: true,
      })
    }
  }
  console.log(interaction)
})

client.once(Events.ClientReady, readyClient => {
  console.log(`Ready Logged in as ${readyClient.user.tag}`)
})

client.login(token);