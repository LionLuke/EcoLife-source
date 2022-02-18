const { embed } = require('../../handler/functions.js');
const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'suggest',
  category: 'Bot',
  permLevel: '0',
  perm: 'User',
  aliases: ['suggestion'],
  usage: '<suggestion>',
  description: 'Send a suggestion for the bot to the main server',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    if (!args || args.join(' ').length < 20) return embed(msg, 'RED', 'You need to insert a suggestion of at least 20 characters!')
    if (args.join(' ').length > 2000) return embed(msg, 'RED', 'Your suggestion may not exceed 2000 characters!')
    const em = new MessageEmbed()
      .setTitle(`${msg.author.username}'s Suggestion`)
      .setColor("BLUE")
      .setThumbnail(msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
      .setDescription(args.join(' '))
      .setFooter(msg.author.id);
      client.channels.cache.get('713751730554404873').send(em).then(msg => {
        msg.react('✅');
        msg.react('❌');
      });
      msg.delete();
      return embed(msg, 'GREEN', 'Your suggestion has been sent, thank you for your feedback!')
  }
}