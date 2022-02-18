const { embed, userDB, exec, ensure, deHunger, deHealth, deThirst, deathNotify, healthNotify, incHealth, incHunger, incThirst, set } = require('../../handler/functions.js');;
const Enmap = require('enmap');
require("moment-duration-format");
const config = require('../../config.json');

module.exports = {
  name: 'selfconfig',
  category: 'Bot',
  permLevel: '0',
  perm: 'User',
  aliases: ['sf'],
  usage: '<prefix/numbers> <input>',
  description: 'Change your personal settings',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    await ensure(msg.author.id);
    const userdb = userDB(msg.author.id);
    if (!userDB(msg.author.id).config) set(msg.author.id, {}, 'config');
    let setting = args[0];
    let input = args[1];
    if (!setting) return embed(msg, 'RED', `You must specify one of the following options: prefix/numbers`);
    setting = setting.toLowerCase()
    if (['prefix', 'numbers'].includes(setting)) {
      if (setting === 'prefix') {
        if (!input && input.length < 1) return embed(msg, 'RED', `You must input a personal prefix, your prefix may not be empty!`);
        if (userdb.config.prefix && userdb.config.prefix === input) return embed(msg, 'RED', `Your new personal prefix may not be the same as your current one!`);
        set(msg.author.id, input, 'config.prefix');
        return embed(msg, 'GREEN', `Your new personal prefix has been set to **\`${input}\`**`);
      } else if (setting === 'numbers') {
        if (!input) return embed(msg, 'RED', `You must specify one of the following options: commas/suffixes`);
        if (['commas', 'suffixes'].includes(input.toLowerCase())) {
          if (input.toLowerCase() === 'commas') {
            set(msg.author.id, 'commas', 'config.numberDisplay');
            return embed(msg, 'GREEN', `Your number display has been set to **\`commas\`**`);
          } else if (input.toLowerCase() === 'suffixes') {
            set(msg.author.id, 'suffixes', 'config.numberDisplay');
            return embed(msg, 'GREEN', `Your number display has been set to **\`suffixes\`**`);
          } else {
            return embed(msg, 'RED', `You must specify one of the following options: commas/suffixes`);
          }
        } else {
          return embed(msg, 'RED', `You must specify one of the following options: commas/suffixes`);
        }
      }
    } else {
      return embed(msg, 'RED', `You must specify one of the following options: prefix/numbers`);
    }
  }
}