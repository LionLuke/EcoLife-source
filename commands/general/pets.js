const { embed, userDB, exec, ensure, getKeyByValue } = require('../../handler/functions.js');
const Enmap = require('enmap');
const moment = require('moment');
const paginationEmbed = require('discord.js-pagination');

module.exports = {
    name: 'pets',
    category: 'General',
    permLevel: '0',
    perm: 'User',
    aliases: [],
    usage: '',
    description: 'Look what pets are available in the vote crates',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        const pets = client.economy.get('pets');
        const types = {
            0: 'Common',
            1: 'Uncommon',
            2: 'Rare',
            3: 'Epic',
            4: 'Legendary',
            5: 'Mythic'
        };
        const percentage = {
            0: '60%',
            1: '20%',
            2: '10%',
            3: '5%',
            4: '4%',
            5: '1%'
        }
        const em = new MessageEmbed()
        .setColor("BLUE")
        .setTitle("Pets");
        Object.keys(pets).forEach((k) => {
        em.addField(pets[k].name.toProperCase(), `\`\`\`css\ntype: ${types[pets[k].rarity]}\nrarity: ${percentage[pets[k].rarity]}\nmultiplier: x${pets[k].multiplier}\nvalue: $${pets[k].value.stringify(msg)}\`\`\``);
        })
        msg.channel.send(em);
        /*
            Rarity Chart
            -- Math.floor(Math.random() * 100) --
            common: 0 - 0 -- 60 ; 60%
            uncommon: 1 - 60 -- 80 ; 20%
            rare: 2 - 80 -- 90 ; 10%
            epic: 3 - 90 -- 95 ; 5%
            legendary: 4 - 95 -- 99 ; 4%
            mythic: 5 - 99 -- 100 ; 1%
        */
    }
}