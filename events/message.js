const { Discord, MessageEmbed } = require('discord.js');
const config = require('../config.json');
const { level, settings, clientSettings, embed, getPrefix, userDB, set, ensure } = require('../handler/functions.js');

module.exports = async (client, message) => {
    let Enmap = require('enmap');
    if (!message.guild) return;
    new Enmap({ name: 'guildSettings' }).ensure(message.guild.id, {prefix: ')'});
    let runCommand = false;
    const e = new MessageEmbed().setColor('RED')
    const msg = message;


    if (!msg.content) return;
    if (msg.author.bot || (message.guild && !message.channel.permissionsFor(client.user).has('SEND_MESSAGES'))) return;
    let personalPrefix = userDB(msg.author.id)?.config?.prefix || 'ewbjwbhe', prefix, command, cmdName, args, found = false;
    const prefixes = [getPrefix(msg.guild.id), personalPrefix, `<@${client.user.id}>`].sort((a, b) => b.length - a.length);
    for (i = 0; i < prefixes.length; i++) {
        if (found) break;
        args = msg.content.slice(prefixes[i].length).trim().split(/\s+/g);
        cmdName = args.shift().toLowerCase();
        command = client.commands.get(cmdName) || client.commands.get(client.aliases.get(cmdName));
        prefix = prefixes[i];
        if (msg.content.startsWith(prefix)) found = true;
    }
    if (!found) return;
    if (!command && msg.content.split(' ').length === 1 && msg.mentions.users.first() == client.user) return msg.channel.send(`My prefix in this guild is: \`${prefix}\``);
    if (!command) return;

    let server = msg.guild;
    let botAdmins = config.developer;
    let blacklist = new Enmap({ name: 'blacklist' });

    // Command Handler
    await ensure(msg.author.id);
    if (new Enmap({ name: 'users' }).has(msg.author.id) && !userDB(msg.author.id).multiplier) set(msg.author.id, 0, 'multiplier');
    if (new Enmap({ name: 'users' }).has(msg.author.id) && !userDB(msg.author.id).rebirth_level) set(msg.author.id, 1, 'rebirth_level'); // 1 is actually 0 here;

    if (command.permLevel == '1') {
        if (botAdmins.includes(msg.author.id)) { // User is a bot dev
            return command.run(client, msg, args, prefix, command, Discord, MessageEmbed, server, Enmap, botAdmins);
        } else { // User isnt a bot admin
            e.setDescription('You must be the bot developer to execute this command.')
            return msg.channel.send(e)
        }
    } else if (blacklist.has(msg.author.id)) {
        return embed(msg, 'RED', 'You were blacklisted from using the bot, if you think this is a mistake please contact support in the [support server](https://discord.gg/rVuNcaa)');
    } else {
        if (!new Enmap({ name: 'users' }).has(msg.author.id)) await msg.reply(`It seems like you are new to using this bot, check out \`${prefix}intro\` for a quick tutorial!`)
        return command.run(client, msg, args, prefix, command, Discord, MessageEmbed, botAdmins, server, Enmap);
    }
}
