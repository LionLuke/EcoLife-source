const { embed, userDB, exec, ensure, deHunger, deHealth, deThirst, deathNotify, healthNotify, incHealth, incHunger, incThirst, set } = require('../../handler/functions.js');
const Enmap = require('enmap');
const moment = require('moment');
const ms = require('parse-ms');

module.exports = {
    name: 'work',
    category: 'General',
    permLevel: '0',
    perm: 'User',
    usage: '',
    cooldown: 200000,
    description: 'Work for your money',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        const previous = parseInt(userDB(msg.author.id).cooldowns.work);
        let cd = (client.economy.get('work').cooldown - (Date.now() - previous))
        if (previous !== null && previous !== undefined && cd > 0) return embed(msg, 'RED', `Please wait **${moment.duration(cd).format('d [days], h [hours], m [minutes] [and] s [seconds]')}** more before working again, you're still exhausted.`)
        if ((client.economy.get('work').cooldown - (Date.now() - previous)) >= 0) return
        let mult = 0;
        if (Object.keys(userDB(msg.author.id).items.pets).length > 0) {
            Object.keys(userDB(msg.author.id).items.pets).forEach((key) => {
                mult = mult + userDB(msg.author.id).items.pets[key].multiplier;
            })
        }
        if (userDB(msg.author.id).multiplier !== 0) mult = mult + userDB(msg.author.id).multiplier;
        const vehicles = client.economy.get('vehicles');
        const jobs = client.economy.get('jobs');
        const curVehicle = userDB(msg.author.id).vehicle;
        const curJob = userDB(msg.author.id).job;
        if (curJob == 'unemployed') return embed(msg, 'RED', `You do not have a job, please apply for one using '${prefix}job apply'!`);
        if (curVehicle == 'none') return embed(msg, 'RED', `You do not have a vehicle to travel to your job with, please buy one using '${prefix}dealer buy'!`);
        let payout = Math.floor(Math.random() * jobs[curJob.replace(/ /g, '_')].payout.max) + jobs[curJob.replace(/ /g, '_')].payout.min;
        if (payout > jobs[curJob.replace(/ /g, '_')].payout.max) payout = jobs[curJob.replace(/ /g, '_')].payout.max;
        payout = Math.floor(payout) + Math.floor(Math.floor(payout) * mult) 
        const vehBreakNumber = Math.floor(Math.random() * 100) + 1;
        const vehBreakDownChance = vehicles[curVehicle.replace(/ /g, '_')].reliability;
        const vehMechanicPrice = vehicles[curVehicle.replace(/ /g, '_')].mechanicPrice;
        const story = jobs[curJob.replace(/ /g, '_')].stories[Math.floor(Math.random() * jobs[curJob.replace(/ /g, '_')].stories.length)];
        if (vehBreakNumber > vehBreakDownChance) { // Break Down.
            const newBal = parseInt(userDB(msg.author.id).balance) - vehMechanicPrice;
            const em = new MessageEmbed()
            .setTitle("Work - Vehicle Break Down")
            .setColor("BLUE")
            .setThumbnail(client.user.displayAvatarURL({format:'png'}))
            .setDescription(`Your vehicle broke down, you had to pay the mechanic **$${vehMechanicPrice.stringify(msg)}**. You could not make it to your job in time and did not earn any money.`)
            .setFooter(`Better luck next time ${msg.author.username}`);
            msg.channel.send(em).catch(err => err);
            set(msg.author.id, newBal, 'balance');
            set(msg.author.id, Date.now(), 'cooldowns.work');
            const a = deHunger(msg.author.id, 5);
            const b = deThirst(msg.author.id, 5);
            if (a) {
                const c = deHealth(msg.author.id, 5);
                if (c) {
                    const output = (parseInt(userDB(msg.author.id).balance) * 0.95);
                    const newBal = parseInt(userDB(msg.author.id).balance) - output;
                    if (parseInt(userDB(msg.author.id).balance) >= 1) set(msg.author.id, newBal, 'balance');
                    incHealth(msg.author.id, 100);
                    incHunger(msg.author.id, 100);
                    incThirst(msg.author.id, 100);
                    return deathNotify(msg, msg.author.id);
                }
                if (parseInt(userDB(msg.author.id).body.health) <= 50) {
                    return healthNotify(msg, msg.author.id);
                }
            } else if (b) {
                const c = deHealth(msg.author.id, 5);
                if (c) {
                    const output = Math.floor(parseInt(userDB(msg.author.id).balance) * 0.95);
                    const newBal = parseInt(userDB(msg.author.id).balance) - output;
                    if (parseInt(userDB(msg.author.id).balance) >= 1) set(msg.author.id, newBal, 'balance');
                    incHealth(msg.author.id, 100);
                    incHunger(msg.author.id, 100);
                    incThirst(msg.author.id, 100);
                    return deathNotify(msg, msg.author.id);
                }
                if (parseInt(userDB(msg.author.id).body.health) <= 50) {
                    return healthNotify(msg, msg.author.id);
                }
            }
            return;
        } else { // Do Not Break Down.
            const newBal = parseInt(userDB(msg.author.id).balance) + payout;
            const em = new MessageEmbed()
            .setTitle(`Work - ${curJob.toProperCase()}`)
            .setColor("BLUE")
            .setThumbnail(client.user.displayAvatarURL({format:'png'}))
            .setDescription(story)
            .addField("Paycheck", `$${payout.stringify(msg)}`)
            .setFooter(`Good job ${msg.author.username}`);
            msg.channel.send(em).catch(err => err);
            set(msg.author.id, newBal, 'balance');
            set(msg.author.id, Date.now(), 'cooldowns.work');
            const a = deHunger(msg.author.id, 5);
            const b = deThirst(msg.author.id, 5);
            if (a) {
                const c = deHealth(msg.author.id, 5);
                if (c) {
                    const output = (parseInt(userDB(msg.author.id).balance) * 95) / 100;
                    const newBal = parseInt(userDB(msg.author.id).balance) - output;
                    if (parseInt(userDB(msg.author.id).balance >= 1)) set(msg.author.id, newBal, 'balance');
                    incHealth(msg.author.id, 100);
                    incHunger(msg.author.id, 100);
                    incThirst(msg.author.id, 100);
                    return deathNotify(msg, msg.author.id);
                }
                if (parseInt(userDB(msg.author.id).body.health) <= 50) {
                    return healthNotify(msg, msg.author.id);
                }
            } else if (b) {
                const c = deHealth(msg.author.id, 5);
                if (c) {
                    const output = (parseInt(userDB(msg.author.id).balance) * 95) / 100;
                    const newBal = parseInt(userDB(msg.author.id).balance) - output;
                    if (parseInt(userDB(msg.author.id).balance >= 1)) set(msg.author.id, newBal, 'balance');
                    incHealth(msg.author.id, 100);
                    incHunger(msg.author.id, 100);
                    incThirst(msg.author.id, 100);
                    return deathNotify(msg, msg.author.id);
                }
                if (parseInt(userDB(msg.author.id).body.health) <= 50) {
                    return healthNotify(msg, msg.author.id);
                }
            }
            return;
        }
    }
}