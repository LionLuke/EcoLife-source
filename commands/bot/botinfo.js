const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'botinfo',
  category: 'Bot',
  permLevel: '0',
  perm: 'User',
  aliases: ['bi'],
  usage: '',
  description: 'Shows information about the bot',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    const uptime = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
    const guilds = client.guilds.cache.size.stringify(msg);
    const users = client.users.cache.size.stringify(msg);
    const commands = client.commands.size;
    const os = 'Linux Ubuntu';
    const nodeVersion = process.version;
    const players = new Enmap({ name: 'users' }).filter(u => u.balance > 0).size.stringify(msg);
    const discordjsVersion = require('discord.js').version;
    const ping = `${Math.round(client.ws.ping)} ms`;
    let money = 0;
    new Enmap({ name: 'users' }).filter(m => m.balance > 0).filter(m => m.balance !== null).forEach((m) => money = money + parseInt(m.balance));
    money = Number(money).stringify(msg)
    const em = new MessageEmbed()
      .setTitle("Bot Info")
      .setColor("BLUE")
      .addField('Client Information:', `\`\`\`\nUptime:\n» ${uptime}\nGuilds:\n» ${guilds}\nUsers:\n» ${users}\nPlayers:\n» ${players}\nCommands:\n» ${commands}\nTotal Money:\n» $${money}\`\`\``)
      .addField('System Information:', `\`\`\`\nOperating System:\n» ${os}\nNode Version:\n» ${nodeVersion}\nDiscord.js Version:\n» ${discordjsVersion}\nPing:\n» ${ping}\n\`\`\``);
      msg.channel.send(em);
  }
}