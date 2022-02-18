const { embed, userDB, exec, ensure, currentWeight, getKeyByValue, set, deleteUser } = require('../../handler/functions.js');
const Enmap = require('enmap');

module.exports = {
    name: 'rebirth',
    category: 'General',
    permLevel: '0',
    aliases: ['prestige', 'birth'],
    perm: 'User',
    usage: 'confirm',
    description: 'Rebirth, lose all progress and start over with a multiplier',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        let confirm = args[0];
        if (!confirm) return embed(msg, 'ORANGE', `Are you sure you want to rebirth? You will lose all of your current progress (except for pets) and have to start life over completely, rebirths however grant you access to new jobs. If you are sure of your decision, do **\`${prefix}rebirth confirm\`**`);
        confirm = confirm.toLowerCase().trim();
        if (confirm.toLowerCase() !== 'confirm') return embed(msg, 'ORANGE', `Are you sure you want to rebirth? You will lose all of your current progress (except for pets) and have to start life over completely, rebirths however grant you access to new jobs. If you are sure of your decision, do **\`${prefix}rebirth confirm\`**`);
        if (userDB(msg.author.id).balance < 125000000 * userDB(msg.author.id).rebirth_level) return embed(msg, 'RED', `In order to rebirth to rebirth level **${userDB(msg.author.id).rebirth_level}** you need at least **$${(125000000 * userDB(msg.author.id).rebirth_level).stringify(msg)}**.`)
        const pets = userDB(msg.author.id).items.pets;
        const multiplier = userDB(msg.author.id).multiplier + 0.75;
        const rebirthLevel = userDB(msg.author.id).rebirth_level + 1;
        await deleteUser(msg.author.id);
        await ensure(msg.author.id);
        await set(msg.author.id, multiplier, 'multiplier');
        await set(msg.author.id, rebirthLevel, 'rebirth_level');
        await set(msg.author.id, pets, 'items.pets');
        return embed(msg, 'GREEN', `You successfully rebirthed to level **${userDB(msg.author.id).rebirth_level - 1}**, your progress has been reset!`);
    }
}
