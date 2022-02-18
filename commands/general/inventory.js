const { embed, userDB, exec, ensure } = require('../../handler/functions.js');
const Enmap = require('enmap');
const paginationEmbed = require('discord.js-pagination');

module.exports = {
    name: 'inventory',
    category: 'General',
    permLevel: '0',
    aliases: ['inv'],
    perm: 'User',
    usage: '<@mention/ID/blank>',
    description: 'Look what items you or someone else has',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        const user = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.member;
        await ensure(user.id);
        const drinks = userDB(user.id).items.drinks
        const food = userDB(user.id).items.food;
        const general = userDB(user.id).items.general;
        const pets = userDB(user.id).items.pets;
        const em1 = new MessageEmbed()
        .setColor("BLUE")
        .setTitle("Drinks");
        Object.keys(drinks).filter(item => drinks[item].amount > 0).forEach((k) => {
        em1.addField(drinks[k].name.toProperCase(), `\`\`\`css\namount: ${parseInt(drinks[k].amount).stringify(msg)}x\nid: ${drinks[k].id}\`\`\``);
        })
        if (Object.keys(drinks).filter(item => drinks[item].amount > 0).length == 0) {
            em1.setDescription("Nothing to see here!");
        }
        const em2 = new MessageEmbed()
        .setColor("BLUE")
        .setTitle("General");
        Object.keys(general).filter(item => general[item].amount > 0).forEach((k) => {
        em2.addField(general[k].name.toProperCase(), `\`\`\`css\namount: ${parseInt(general[k].amount).stringify(msg)}x\nid: ${general[k].id}\`\`\``);
        })
        if (Object.keys(general).filter(item => general[item].amount > 0).length == 0) {
            em2.setDescription("Nothing to see here!");
        }
        const em3 = new MessageEmbed()
        .setColor("BLUE")
        .setTitle("Food");
        Object.keys(food).filter(item => food[item].amount > 0).forEach((k) => {
        em3.addField(food[k].name.toProperCase(), `\`\`\`css\namount: ${parseInt(food[k].amount).stringify(msg)}x\nid: ${food[k].id}\`\`\``);
        })
        if (Object.keys(food).filter(item => food[item].amount > 0).length == 0) {
            em3.setDescription("Nothing to see here!");
        }
        const em4 = new MessageEmbed()
        .setColor("BLUE")
        .setTitle("Pets");
        Object.keys(pets).forEach((k) => {
        em4.addField(pets[k].name.toProperCase(), `\`\`\`css\nmultiplier: x${pets[k].multiplier.stringify(msg)}\nvalue: $${pets[k].value.stringify(msg)}\`\`\``);
        })
        if (Object.keys(pets).length == 0) {
            em4.setDescription("Nothing to see here!");
        }
        const pages = [
            em1,
            em2,
            em3,
            em4
        ];
        const emojiList = [
            '⬅️',
            '➡️'
        ];
        return paginationEmbed(msg, pages, emojiList, 120000);
    }
}