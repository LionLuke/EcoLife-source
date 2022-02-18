const { embed, userDB, exec, ensure, deHunger, deHealth, deThirst, deathNotify, healthNotify, incHealth, incHunger, incThirst, set } = require('../../handler/functions.js');
const Enmap = require('enmap');
const moment = require('moment');

module.exports = {
    name: 'dealership',
    category: 'General',
    permLevel: '0',
    aliases: ['dealer', 'dl'],
    perm: 'User',
    usage: '<view/sell/buy> <vehicle name>',
    description: 'View, sell or buy a vehicle (\'[prefix]dealer view all\' to view all available vehicles. \'[prefix]dealer view <vehicle name>\' to see the price of a vehicle)',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        const vehicles = client.economy.get('vehicles');
        const budget = parseInt(userDB(msg.author.id).balance);
        const currentVehicle = userDB(msg.author.id).vehicle;
        const action = args[0];
        const vehicleName = args.join(' ').replace(args[0], '').trim().replace(/ /g, '_').toLowerCase();
        if (action == 'view') {
            if (!vehicles[vehicleName]) {
                const vehicles2 = Object.keys(vehicles);
                const em = new MessageEmbed()
                .setTitle("Vehicles")
                .setThumbnail(client.user.displayAvatarURL({format:'png'}))
                .setColor("BLUE")
                .setDescription('**' + '- ' + vehicles2.join('\n- ').replace(/_/g, ' ') + '**')
                .setFooter(`Requested by: ${msg.author.username} (${msg.author.id})`);
                return msg.channel.send(em).catch(em => em);
            } else {
                const vehiclePrice = vehicles[vehicleName].price.stringify(msg);
                const em = new MessageEmbed()
                .setTitle(vehicleName.replace(/_/g, ' ').toProperCase())
                .setThumbnail(client.user.displayAvatarURL({format:'png'}))
                .setColor("BLUE")
                .addField("Price", `$${vehiclePrice}`)
                .addField("Reliability", `${vehicles[vehicleName].reliability.stringify(msg)}%`)
                .addField("Mechanic Price", `$${vehicles[vehicleName].mechanicPrice.stringify(msg)}`)
                .setFooter(`Requested by: ${msg.author.username} (${msg.author.id})`);
                return msg.channel.send(em).catch(em => em);
            }
        } else if (action == 'sell') {
            if (!currentVehicle) return embed(msg, 'RED', 'You do not have a vehicle to sell!');
            if (currentVehicle == 'none') return embed(msg, 'RED', 'You do not have a vehicle to sell!');
            const curVeh = currentVehicle.replace(/ /g, '_');
            if (!vehicles[curVeh]) return embed(msg, 'RED', 'Something went wrong, please contact one of the developers!');
            const curPropPrice = vehicles[curVeh].price;
            const chargeBack = curPropPrice * 0.60;
            const newBal = budget + chargeBack;
            set(msg.author.id, newBal, 'balance');
            set(msg.author.id, 'none', 'vehicle');
            const em = new MessageEmbed()
            .setTitle("Dealership")
            .setThumbnail(client.user.displayAvatarURL({format:'png'}))
            .setColor("BLUE")
            .setDescription(`You have successfully sold your vehicle back to the dealership, you were given back **$${chargeBack.stringify(msg)}** for the vehicle.`)
            .setFooter(`Requested by: ${msg.author.username} (${msg.author.id})`);
            return msg.channel.send(em).catch(em => em);
        } else if (action == 'buy') {
            if (currentVehicle != 'none') return embed(msg, 'RED', `You already own a vehicle, please sell it first using '${prefix}dealer sell'!`);
            if (!vehicles[vehicleName]) return embed(msg, 'RED', `Please select a valid vehicle to buy, check out '${prefix}dealer view' for a list of vehicles!`);
            const vehToBuyPrice = vehicles[vehicleName].price;
            if (budget < vehToBuyPrice) return embed(msg, 'RED', 'You do not have the funds to pay for this vehicle!');
            const newBal = budget - vehToBuyPrice;
            set(msg.author.id, newBal, 'balance');
            set(msg.author.id, vehicleName.replace(/_/g, ' '), 'vehicle');
            const em = new MessageEmbed()
            .setTitle("Dealership")
            .setThumbnail(client.user.displayAvatarURL({format:'png'}))
            .setColor("BLUE")
            .setDescription(`You have successfully bought a **${vehicleName.replace(/_/g, ' ')}**, you were charged **$${vehToBuyPrice.stringify(msg)}** for the vehicle.`)
            .setFooter(`Requested by: ${msg.author.username} (${msg.author.id})`);
            return msg.channel.send(em).catch(em => em);
        } else {
            return embed(msg, 'RED', 'Please select one of the following options: view/sell/buy');
        }
    }
}