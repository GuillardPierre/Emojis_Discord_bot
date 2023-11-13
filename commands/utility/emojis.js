const { SlashCommandBuilder } = require("discord.js");
const dotenv = require("dotenv");

const clientId = process.env.clientId;
const guildId = process.env.guildId;
const token = process.env.TOKEN;
const regexEmoji = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27FF]/g;
let tableauTrie = [];

module.exports = {
  //module.exports permet de rendre le fichier accessible partout avec la méthode require()
  data: new SlashCommandBuilder()
    .setName("emojis")
    .setDescription("Donne les émojis les plus utilisés"),

  async execute(interaction) {
    try {
      const result = await fetch(
        `https://discord.com/api/v10/guilds/${guildId}/channels`,
        {
          method: "GET",
          headers: {
            Authorization: `Bot ${token}`,
          },
        }
      );

      // const data = await rest.get(Routes.guildChannels(guildId));
      const resultJson = await result.json();
      idChannels = [];
      resultJson.forEach((channels) => {
        if (channels.type === 0) {
          idChannels.push(channels.id);
        }
      });

      const allMessages = [];
      for (let i = 0; i < idChannels.length; i++) {
        const messages = await fetch(
          `https://discord.com/api/v10/channels/${idChannels[i]}/messages`,
          {
            method: "GET",
            headers: {
              Authorization: `Bot ${token}`,
            },
          }
        );
        (await messages.json()).forEach((message) => allMessages.push(message));
      }
      const messagesEcrits = allMessages.filter((type) => type.type === 0);
      const contents = messagesEcrits.map((message) => message.content);

      let emojisSeulement = [];
      for (const element of contents) {
        const emojisTrouves = element.match(regexEmoji);
        if (emojisTrouves) {
          // emojisTrouves = emojisTrouves.join(" ");
          emojisSeulement.push(...emojisTrouves);
        }
      }
      emojisSeulement = emojisSeulement.flat();
      let statsEmojis = {};
      for (let i = 0; i < emojisSeulement.length; i++) {
        if (!statsEmojis[emojisSeulement[i]]) {
          statsEmojis[emojisSeulement[i]] = 1;
        } else {
          statsEmojis[emojisSeulement[i]]++;
        }
      }
      const tableauPaires = Object.entries(statsEmojis);
      tableauTrie = tableauPaires.sort((a, b) => b[1] - a[1]);
    } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error(error);
    }
    await interaction.reply(
      `Smileys les plus utilisés :
      :first_place: : ${tableauTrie[0][0]} utilisé ${tableauTrie[0][1]} fois. 
      :second_place: : ${tableauTrie[1][0]} utilisé ${tableauTrie[1][1]} fois. 
      :third_place: : ${tableauTrie[2][0]} utilisé ${tableauTrie[2][1]} fois.`
    );
  },
};
