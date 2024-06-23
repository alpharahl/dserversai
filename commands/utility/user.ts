import {SlashCommandBuilder} from 'discord.js';

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Provides user information"),
  async execute(interaction){
    await interaction.reply(`This command was run by ${interaction.user.username}`)
  }
}
