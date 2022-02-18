const { embed, userDB, exec, ensure, getKeyByValue } = require('../../handler/functions.js');
const Enmap = require('enmap');
const moment = require('moment');
const paginationEmbed = require('discord.js-pagination');

module.exports = {
    name: 'shop',
    category: 'General',
    permLevel: '0',
    perm: 'User',
    aliases: ['market', 'store'],
    usage: '',
    description: 'Look what items are available in the shop',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        const drinks = client.economy.get('items').drinks;
        const food = client.economy.get('items').food;
        const general = client.economy.get('items').general;
        const storage = client.economy.get('items').storage;
        const em1 = new MessageEmbed()
        .setColor("BLUE")
        .setTitle("Drinks");
        Object.keys(drinks).forEach((k) => {
        em1.addField(drinks[k].name.toProperCase(), `\`\`\`css\nprice: $${parseInt(drinks[k].price).stringify(msg)}\nthirst regain: ${drinks[k].thirst_regain}\n${drinks[k].fatInc ? `fat increase: ${drinks[k].fatInc}` : drinks[k].fatDe ? `fat decrease: ${drinks[k].fatDe}` : 'lightweight drink'}\ndescription: ${drinks[k].description}\nid: ${drinks[k].id}\nweight: ${drinks[k].weight}kg\`\`\``);
        })
        const em2 = new MessageEmbed()
        .setColor("BLUE")
        .setTitle("General");
        Object.keys(general).forEach((k) => {
        em2.addField(general[k].name.toProperCase(), `\`\`\`css\nprice: $${parseInt(general[k].price).stringify(msg)}\ndescription: ${general[k].description}\nid: ${general[k].id}\nweight: ${general[k].weight}kg\`\`\``);
        })
        const em3 = new MessageEmbed()
        .setColor("BLUE")
        .setTitle("Food");
        Object.keys(food).forEach((k) => {
        em3.addField(food[k].name.toProperCase(), `\`\`\`css\nprice: $${parseInt(food[k].price).stringify(msg)}\nhunger regain: ${food[k].food_regain}\n${food[k].fatInc ? `fat increase: ${food[k].fatInc}` : food[k].fatDe ? `fat decrease: ${food[k].fatDe}` : 'lightweight food'}\ndescription: ${food[k].description}\nid: ${food[k].id}\nweight: ${food[k].weight}kg\`\`\``);
        })
        const em4 = new MessageEmbed()
        .setColor("BLUE")
        .setTitle("Storage");
        Object.keys(storage).forEach((k) => {
        em4.addField(storage[k].name.toProperCase(), `\`\`\`css\nprice: $${parseInt(storage[k].price).stringify(msg)}\nspace: ${storage[k].weight.stringify(msg)}kg\nid: ${storage[k].id}\`\`\``);
        })
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