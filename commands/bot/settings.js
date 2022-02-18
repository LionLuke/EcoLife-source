const { embed, userDB, exec, ensure, currentWeight, getKeyByValue, getPrefix } = require('../../handler/functions.js');
const Enmap = require('enmap');
const paginationEmbed = require('discord.js-pagination');

module.exports = {
    name: 'settings',
    category: 'General',
    permLevel: '0',
    aliases: [],
    perm: 'User',
    usage: '',
    description: 'Look at some settings',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        const user = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.member;
        await ensure(user.id);
        const guildPrefix = getPrefix(msg.guild.id);
        const personalPrefix = !userDB(user.id).config ? null : !userDB(user.id).config.prefix ? null : userDB(user.id).config.prefix;
        const numberDisplay =  !userDB(user.id).config ? null : !userDB(user.id).config.numberDisplay ? null : userDB(user.id).config.numberDisplay;
        const em1 = new MessageEmbed()
        .setTitle("Guild Settings")
        .addField("Prefix", `**\`${guildPrefix || prefix}\`**`)
        .setColor("BLUE");
        if (user.id != msg.author.id) {
            em1.setFooter(`Requested by: ${msg.author.tag}`, msg.author.displayAvatarURL({ format: 'png', dynamic: true }));
        }
        const em2 = new MessageEmbed()
        .setTitle("Personal Settings")
        .addField("Prefix", `**\`${personalPrefix === null ? ')' : personalPrefix}\`**`)
        .addField("Number Display", `Example: **\`${numberDisplay === 'commas' ? '1,000,000' : numberDisplay === 'suffixes' ? '1m' : '1m'}\`**`)
        .setColor("BLUE");
        if (user.id != msg.author.id) {
            em2.setFooter(`Requested by: ${msg.author.tag}`, msg.author.displayAvatarURL({ format: 'png', dynamic: true }));
        }
        const pages = [
            em1,
            em2
        ];
        const emojiList = [
            '⬅️',
            '➡️'
        ];
        return paginationEmbed(msg, pages, emojiList, 120000);
    }
}
