const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'vote',
  category: 'Bot',
  permLevel: '0',
  perm: 'User',
  aliases: [],
  usage: '',
  description: 'Shows places where you can vote for the bot (hyperlinks)',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    const em = new MessageEmbed()
      .setTitle("Vote Places")
      .setColor("BLUE")
      .setDescription(`Here's some places where you can vote for me in order to receive a pet:\n\n**[voidbots.net](https://voidbots.net/bot/831223886300315700/vote)**\n\n**[botlist.me](https://botlist.me/bots/831223886300315700/vote)**`)
      return msg.channel.send(em);
  }
}