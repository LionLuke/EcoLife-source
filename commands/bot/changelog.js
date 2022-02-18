const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'changelog',
  category: 'Bot',
  permLevel: '0',
  perm: 'User',
  aliases: ['changelogs', 'updates', 'version'],
  usage: '<version>',
  description: 'Shows the last or requested version/changelog for the bot',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    const input = args[0] || '1';
    const changelogs = client.channels.cache.get('713753131728633886');
    await changelogs.messages.fetch().catch(err => console.log(err));
    const version = changelogs.messages.cache.find(m => m.content.replace(/\n/g, ' ').split(' ')[2] == input) || changelogs.lastMessage;
    const changelog = version.content;
    const em = new MessageEmbed()
      .setColor("BLUE")
      .setDescription(changelog)
      .setFooter(`Requested by: ${msg.author.tag} (${msg.author.id})`, msg.author.displayAvatarURL({ format: 'png', dynamic: true }));
      msg.channel.send(em);
  }
}