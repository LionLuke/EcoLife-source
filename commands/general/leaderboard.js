const { embed, userDB, exec, ensure } = require('../../handler/functions.js');
const Enmap = require('enmap');
const moment = require('moment');
const ms = require('parse-ms');

module.exports = {
    name: 'leaderboard',
    category: 'General',
    permLevel: '0',
    perm: 'User',
    aliases: ['lb'],
    usage: '<(optional)userID/@mention>',
    description: 'Leaderboard',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        const DB = new Enmap({ name: 'users' })
        const filtered = DB.filter(u => u.balance > 0).array();
        const sorted = filtered.sort((a, b) => b.balance - a.balance);
        const top10 = sorted.splice(0, 10);
        if (args[0]) await client.users.fetch(args[0]).catch(err => console.log(err));
        const user = msg.mentions.users.first() || client.users.cache.get(args[0]) || msg.author;
        const em = new MessageEmbed()
            .setTitle("Leaderboard")
            .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true }))
            .setColor("BLUE");
            for (let [key, value] of top10.entries()) {
                em.addField(`${key + 1}) ${client.users.cache.get(value.id) ? client.users.cache.get(value.id).username : 'Not Found'} ${value.id == user.id ? '⭐' : ''}`, `$${parseInt(value.balance).stringify(msg)}`)
            }
            const filtered2 = DB.filter(u => u.balance > 0).array();
            const sorted2 = filtered2.sort((a, b) => b.balance - a.balance);
            for (let [key, value] of sorted2.entries()) {
                if (value.id == user.id) {
                    if (!top10.some(v => v.id == user.id)) {
                        await client.users.fetch(value.id);
                        em.addField(`${key + 1}) ${client.users.cache.get(value.id) ? client.users.cache.get(value.id).username : 'Not Found'} ${value.id == user.id ? '⭐' : ''}`, `$${parseInt(value.balance).stringify(msg)}`)
                    }
                }
            }
            em.setFooter(`Requested by: ${msg.author.tag}`, msg.author.displayAvatarURL({ format: 'png', dynamic: true }));
            msg.channel.send(em);
    }
}