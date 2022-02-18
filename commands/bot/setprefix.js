const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");
const { embed, setPrefix, getPrefix } = require('../../handler/functions.js');
const config = require('../../config.json');

module.exports = {
  name: 'setprefix',
  category: 'Bot',
  permLevel: '0',
  perm: 'User',
  aliases: [],
  usage: '<new prefix>',
  description: 'Change the guild\'s prefix',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    const input = args[0];
    new Enmap({ name: `guildSettings` }).ensure(msg.guild.id, {prefix: ')'});
    const curPrefix = getPrefix(msg.guild.id); // Current guild prefix.
    if (!input) return embed(msg, 'GREEN', `The current guild's prefix is: \`${curPrefix}\``);
    if (!config.developer.includes(msg.author.id)) {
      if (!msg.guild.member(msg.author.id).hasPermission("MANAGE_GUILD")) return embed(msg, 'RED', 'In order to change the guild\'s prefix, you require the permission `Manage Guild`!');
      if (input.length > 5) return embed(msg, 'RED', 'The prefix may only be 5 characters long!');
      setPrefix(msg.guild.id, input, 'prefix')
      return embed(msg, 'GREEN', `The current guild's prefix has been set to: \`${input}\``);
    } else {
      if (input.length > 5) return embed(msg, 'RED', 'The prefix may only be 5 characters long!');
      setPrefix(msg.guild.id, input, 'prefix')
      return embed(msg, 'GREEN', `The current guild's prefix has been set to: \`${input}\``);
    }
  }
}