const { inspect } = require('util');
const Discord = require('discord.js');
const { embed, userDB, exec, getKeyByValue, incHealth, incHunger, incThirst, set } = require('../../handler/functions.js');
const Enmap = require('enmap');
module.exports = {
  name: 'blacklist',
  category: 'Developer',
  permLevel: '1',
  description: 'Add or remove someone from the blacklist',
  usage: '<add/remove> <ID>',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed, userLevel, guildBotSettings) => {
    const blacklist = new Enmap({ name: 'blacklist' });
    const developers = require('../../config.json').developer;
    const action = args[0];
    const user = args[1];
    const reason = args.slice(2);
    if (!action) return embed(msg, 'RED', 'Please tell me what to do... add or remove? Comon boss..');
    if (!['add', 'remove'].includes(action.toLowerCase())) return embed(msg, 'RED', 'Please tell me what to do... add or remove? Comon boss..');
    if (!user) return embed(msg, 'RED', 'You mind actually... you know.. telling me who to add/remove?!');
    try {
      await client.users.fetch(user);
    } catch (error) {
      return embed(msg, 'RED', 'The user you provided does not exist..');
    }
    if (developers.includes(user)) return embed(msg, 'RED', `Excuse me?! Why are you trying to blacklist another developer?!`);
    if (action.toLowerCase() == 'add') {
      if (blacklist.has(user)) return embed(msg, 'RED', `**${client.users.cache.get(user).tag}** is already blacklisted!`);
      blacklist.set(user, reason.join(' ') || 'no reason provided');
      return embed(msg, 'GREEN', `I have successfully added **${client.users.cache.get(user).tag}** to the blacklist!`);
    } else {
      if (!blacklist.has(user)) return embed(msg, 'RED', `**${client.users.cache.get(user).tag}** isn't even blacklisted...`);
      blacklist.delete(user);
      return embed(msg, 'GREEN', `I have successfully removed **${client.users.cache.get(user).tag}** from the blacklist!`);
    }
  }
} 