const { embed, userDB, exec, ensure, deHunger, deHealth, deThirst, deathNotify, healthNotify, incHealth, incHunger, incThirst, set } = require('../../handler/functions.js');
const Enmap = require('enmap');
const moment = require('moment');

module.exports = {
    name: 'realestate',
    category: 'General',
    permLevel: '0',
    aliases: ['realstate', 'restate', 'estate', 're'],
    perm: 'User',
    usage: '<view/sell/buy> <property name>',
    description: 'View, sell or buy a property (\'[prefix]restate view all\' to view all available properties. \'[prefix]restate view <property name>\' to see the price of a property)',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        const properties = client.economy.get('properties');
        const budget = parseInt(userDB(msg.author.id).balance);
        const currentProperty = userDB(msg.author.id).property;
        const action = args[0];
        const propertyName = args.join(' ').replace(args[0], '').trim().replace(/ /g, '_').toLowerCase();
        if (action == 'view') {
            if (!properties[propertyName]) {
                const properties2 = Object.keys(properties);
                const em = new MessageEmbed()
                .setTitle("Properties")
                .setThumbnail(client.user.displayAvatarURL({format:'png'}))
                .setColor("BLUE")
                .setDescription('**' + '- ' + properties2.join('\n- ').replace(/_/g, ' ') + '**')
                .setFooter(`Requested by: ${msg.author.username} (${msg.author.id})`);
                return msg.channel.send(em).catch(em => em);
            } else {
                const propertyPrice = properties[propertyName].price.stringify(msg);
                const em = new MessageEmbed()
                .setTitle(propertyName.replace(/_/g, ' ').toProperCase())
                .setThumbnail(client.user.displayAvatarURL({format:'png'}))
                .setColor("BLUE")
                .setDescription(`**$${propertyPrice}**`)
                .setFooter(`Requested by: ${msg.author.username} (${msg.author.id})`);
                return msg.channel.send(em).catch(em => em);
            }
        } else if (action == 'sell') {
            if (!currentProperty) return embed(msg, 'RED', 'You do not have a property to sell!');
            if (currentProperty == 'homeless') return embed(msg, 'RED', 'You do not have a property to sell!');
            const curProp = currentProperty.replace(/ /g, '_');
            if (!properties[curProp]) return embed(msg, 'RED', 'Something went wrong, please contact one of the developers!');
            const curPropPrice = properties[curProp].price;
            const chargeBack = curPropPrice * 0.60;
            const newBal = budget + chargeBack;
            set(msg.author.id, newBal, 'balance');
            set(msg.author.id, 'homeless', 'property');
            const em = new MessageEmbed()
            .setTitle("Real Estate")
            .setThumbnail(client.user.displayAvatarURL({format:'png'}))
            .setColor("BLUE")
            .setDescription(`You have successfully sold your property back to the real estate company, you were given back **$${chargeBack.stringify(msg)}** for the property.`)
            .setFooter(`Requested by: ${msg.author.username} (${msg.author.id})`);
            return msg.channel.send(em).catch(em => em);
        } else if (action == 'buy') {
            if (currentProperty != 'homeless') return embed(msg, 'RED', `You already own a property, please sell it first using '${prefix}restate sell'!`);
            if (!properties[propertyName]) return embed(msg, 'RED', `Please select a valid property to buy, check out '${prefix}restate view' for a list of properties!`);
            const propToBuyPrice = properties[propertyName].price;
            if (budget < propToBuyPrice) return embed(msg, 'RED', 'You do not have the funds to pay for this property!');
            const newBal = budget - propToBuyPrice;
            set(msg.author.id, newBal, 'balance');
            set(msg.author.id, propertyName.replace(/_/g, ' '), 'property');
            const em = new MessageEmbed()
            .setTitle("Real Estate")
            .setThumbnail(client.user.displayAvatarURL({format:'png'}))
            .setColor("BLUE")
            .setDescription(`You have successfully bought a **${propertyName.replace(/_/g, ' ')}**, you were charged **$${propToBuyPrice.stringify(msg)}** for the property.`)
            .setFooter(`Requested by: ${msg.author.username} (${msg.author.id})`);
            return msg.channel.send(em).catch(em => em);
        } else {
            return embed(msg, 'RED', 'Please select one of the following options: view/sell/buy');
        }
    }
}