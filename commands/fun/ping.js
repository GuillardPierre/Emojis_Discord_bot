const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  //module.exports permet de rendre le fichier accessible partout avec la méthode require()
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply("Lol non");
  },
};
