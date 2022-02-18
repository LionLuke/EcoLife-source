const { embed, userDB, exec, ensure, currentWeight, getKeyByValue } = require('../../handler/functions.js');
const Enmap = require('enmap');
const paginationEmbed = require('discord.js-pagination');

module.exports = {
    name: 'profile',
    category: 'General',
    permLevel: '0',
    aliases: ['balance', 'bal'],
    perm: 'User',
    usage: '<@mention/ID/blank>',
    description: 'Look at someone\'s account',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        const user = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.member;
        await ensure(user.id);
        const properties = client.economy.get('properties');
        const vehicles = client.economy.get('vehicles');
        const health = parseInt(userDB(user.id).body.health);
        const hunger = parseInt(userDB(user.id).body.hunger);
        const thirst = parseInt(userDB(user.id).body.thirst);
        const fat = parseInt(userDB(user.id).body.fat);
        const balance = `${parseInt(userDB(user.id).balance) <= 0 ? '-' : '+'}$${String(userDB(user.id).balance.stringify(msg)).replace('-', '')}`
        const netWorthMath = userDB(user.id).balance + (vehicles[userDB(user.id).vehicle.replace(/ /g, '_')] ? vehicles[userDB(user.id).vehicle.replace(/ /g, '_')].price : 0) + (properties[userDB(user.id).property.replace(/ /g, '_')] ? properties[userDB(user.id).property.replace(/ /g, '_')].price : 0);
        const netWorth = `${netWorthMath <= 0 ? '-' : '+'}$${String(netWorthMath.stringify(msg)).replace('-', '')}`;
        const vehicle = userDB(user.id).vehicle;
        const job = userDB(user.id).job;
        const property = userDB(user.id).property;
        const em1 = new MessageEmbed()
        .setColor("BLUE")
        .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .setAuthor(`${user.user.username}'s money`, user.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .addField("Balance", `\`\`\`diff\n${balance}\`\`\``)
        .addField("Net Worth", `\`\`\`diff\n${netWorth}\`\`\``);
        if (user.id != msg.author.id) {
            em1.setFooter(`Requested by: ${msg.author.tag}`, msg.author.displayAvatarURL({ format: 'png', dynamic: true }));
        }
        const em2 = new MessageEmbed()
        .setColor("BLUE")
        .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .setAuthor(`${user.user.username}'s body stats`, user.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .addField(`Health [${health}]`, `${'```js\n'}${'❤️'.repeat(Math.floor(health/10) * 10 / 10) + `🖤`.repeat((100 - Math.floor(health / 10) * 10) / 10)}${'```'}`)
        .addField(`Hunger [${hunger}]`, `${'```js\n'}${`🍖️`.repeat(Math.floor(hunger/10) * 10 / 10) + `🦴`.repeat((100 - Math.floor(hunger / 10) * 10) / 10)}${'```'}`)
        .addField(`Thirst [${thirst}]`, `${'```js\n'}${`🥤`.repeat(Math.floor(thirst/10) * 10 / 10) + `😩`.repeat((100 - Math.floor(thirst / 10) * 10) / 10)}${'```'}`)
        .addField(`Fat [${fat}]`, `${'```js\n'}${`🍔`.repeat(Math.floor(fat/10) * 10 / 10) + `🥗`.repeat((100 - Math.floor(fat / 10) * 10) / 10)}${'```'}`);
        if (user.id != msg.author.id) {
            em2.setFooter(`Requested by: ${msg.author.tag}`, msg.author.displayAvatarURL({ format: 'png', dynamic: true }));
        }
        const em3 = new MessageEmbed()
        .setColor("BLUE")
        .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .setAuthor(`${user.user.username}'s owned`, user.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .addField("Vehicle", `\`\`\`css\n${vehicle}\`\`\``)
        .addField("Property", `\`\`\`css\n${property}\`\`\``)
        .addField("Job", `\`\`\`css\n${job}\`\`\``);
        if (user.id != msg.author.id) {
            em3.setFooter(`Requested by: ${msg.author.tag}`, msg.author.displayAvatarURL({ format: 'png', dynamic: true }));
        }
        const em4 = new MessageEmbed()
        .setColor("BLUE")
        .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .setAuthor(`${user.user.username}'s pockets`, user.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .addField("Max Weight", `\`\`\`css\n${((userDB(user.id).maxWeight + (getKeyByValue(client.economy.get('items').storage, userDB(user.id).items.storage) ? getKeyByValue(client.economy.get('items').storage, userDB(user.id).items.storage, 'weight') : 0)).toFixed(2))}\`\`\``)
        .addField("Total Weight", `\`\`\`css\n${currentWeight(client.economy.get('items'), user.id)}\`\`\``);
        if (userDB(msg.author.id).items.storage) {
            em4.addField("Storage Item", `\`\`\`css\n${getKeyByValue(client.economy.get('items').storage, userDB(user.id).items.storage, 'name').toProperCase()}\`\`\``);
        }
        if (user.id != msg.author.id) {
            em4.setFooter(`Requested by: ${msg.author.tag}`, msg.author.displayAvatarURL({ format: 'png', dynamic: true }));
        }
        const em5 = new MessageEmbed()
        .setColor("BLUE")
        .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .setAuthor(`${user.user.username}'s rebirths`, user.user.displayAvatarURL({ format: 'png', dynamic: true }))
        .addField("Rebirth Level", `\`\`\`css\n${(userDB(user.id).rebirth_level - 1).stringify(msg)}\`\`\``)
        .addField("Multiplier", `\`\`\`css\nx${userDB(user.id).multiplier}\`\`\``);
        if (user.id != msg.author.id) {
            em5.setFooter(`Requested by: ${msg.author.tag}`, msg.author.displayAvatarURL({ format: 'png', dynamic: true }));
        }
        const pages = [
            em1,
            em2,
            em3,
            em4,
            em5
        ];
        const emojiList = [
            '⬅️',
            '➡️'
        ];
        return paginationEmbed(msg, pages, emojiList, 120000);
    }
}
