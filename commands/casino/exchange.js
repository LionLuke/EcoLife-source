const { embed, userDB, exec, ensure, getKeyByValue, hasEnough, set } = require('../../handler/functions.js');
const Enmap = require('enmap');

module.exports = {
    name: 'exchange',
    category: 'Casino',
    permLevel: '0',
    perm: 'User',
    usage: '<amount (leave blank for 1)>',
    description: 'Exchange casino chips into money',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        let amount = args[0];
        if (amount) amount = amount.replace(/,/g, '').trim();
        if (!/^[0-9]+$/.test(amount) && amount.toLowerCase() == 'all') amount = parseInt(userDB(msg.author.id).items.general.casino_chips.amount);
        if (!/^[0-9]+$/.test(amount)) return embed(msg, 'RED', 'Your input may only include numbers!');
        amount = parseInt(amount);
        if (!userDB(msg.author.id).items.general.casino_chips) return embed(msg, 'RED', `You do not own any casino chips, consider buying some by doing \`${prefix}buy chip\``);
        const totalChips = parseInt(userDB(msg.author.id).items.general.casino_chips.amount);
        if (totalChips < amount) return embed(msg, 'RED', `You do not have the amount of chips that you would like to exchange, you currently only have **${totalChips.stringify(msg)}** chips.`);
        const newBal = parseInt(userDB(msg.author.id).balance) + amount;
        const newChips = totalChips - amount;
        set(msg.author.id, newBal, 'balance');
        set(msg.author.id, newChips, 'items.general.casino_chips.amount');
        return embed(msg, 'GREEN', `You successfully exchanged **${amount.stringify(msg)}** Casino Chips into **$${amount.stringify(msg)}**!`);
    }
}