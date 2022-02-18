const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'invite',
  category: 'Bot',
  permLevel: '0',
  perm: 'User',
  aliases: [],
  usage: '',
  description: 'Invite links for the bot (hyperlinks)',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    const em = new MessageEmbed()
      .setTitle("Invite Links")
      .setColor("BLUE")
      .setDescription("[support server](https://discord.gg/fG48t36)\n[bot invite](https://discordapp.com/oauth2/authorize?client_id=831223886300315700&scope=bot)")
      return msg.channel.send(em);
  }
}