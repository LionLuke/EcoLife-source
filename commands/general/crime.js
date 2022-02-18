const { embed, userDB, exec, ensure, deHunger, deHealth, deThirst, deathNotify, healthNotify, incHealth, incHunger, incThirst, set } = require('../../handler/functions.js');
const Enmap = require('enmap');
const moment = require('moment');
const ms = require('parse-ms');

module.exports = {
    name: 'crime',
    category: 'General',
    permLevel: '0',
    perm: 'User',
    usage: '',
    cooldown: 500000,
    description: 'Perform a crime',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        const previous = parseInt(userDB(msg.author.id).cooldowns.crime);
        let cd = (client.economy.get('crime').cooldown - (Date.now() - previous))
        if (previous !== null && previous !== undefined && cd > 0) {
            return embed(msg, 'RED', `Please wait **${moment.duration(cd).format('d [days], h [hours], m [minutes] [and] s [seconds]')}** more before performing a crime again, you're still exhausted.`)
        } if ((client.economy.get('crime').cooldown - (Date.now() - previous)) <= 0) {
            let mult = 0;
            if (Object.keys(userDB(msg.author.id).items.pets).length > 0) {
                Object.keys(userDB(msg.author.id).items.pets).forEach((key) => {
                    mult = mult + userDB(msg.author.id).items.pets[key].multiplier;
                })
            }
            if (userDB(msg.author.id).multiplier !== 0) mult = mult + userDB(msg.author.id).multiplier;
            let stories;
            const number = Math.floor(Math.random() * 20) + 1;
            if (number <= 10) {
                stories = client.economy.get('crime').storiesWon;
                const story = stories[Math.floor(Math.random() * stories.length)];
                const payout = Math.floor(Math.floor(Math.random() * parseInt(client.economy.get('crime').payout.max)) + parseInt(client.economy.get('crime').payout.min)) + Math.floor(Math.floor(Math.random() * parseInt(client.economy.get('crime').payout.max)) + parseInt(client.economy.get('crime').payout.min) * mult);
                const newBal = parseInt(userDB(msg.author.id).balance) + payout;
                const em = new MessageEmbed()
                    .setColor('BLUE')
                    .setTitle("Crime")
                    .setThumbnail(client.user.displayAvatarURL({
                        format: 'png',
                        dynamic: true
                    }))
                    .addField("Story", story)
                    .addField("Paycheck", `$${payout.stringify(msg)}`);
                msg.channel.send(em);
                new Enmap({
                    name: 'users'
                }).set(msg.author.id, newBal, 'balance');
                new Enmap({
                    name: 'users'
                }).set(msg.author.id, Date.now(), 'cooldowns.crime');
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
            } else {
                stories = client.economy.get('crime').storiesLost;
                const story = stories[Math.floor(Math.random() * stories.length)];
                const payout = Math.floor(Math.random() * parseInt(client.economy.get('crime').payout.max)) + parseInt(client.economy.get('crime').payout.min);
                const newBal = parseInt(userDB(msg.author.id).balance) - payout;
                const em = new MessageEmbed()
                    .setColor('BLUE')
                    .setTitle("Crime")
                    .setThumbnail(client.user.displayAvatarURL({
                        format: 'png',
                        dynamic: true
                    }))
                    .addField("Story", story)
                    .addField("Fine", `-$${payout.stringify(msg)}`);
                msg.channel.send(em);
                new Enmap({
                    name: 'users'
                }).set(msg.author.id, newBal, 'balance');
                new Enmap({
                    name: 'users'
                }).set(msg.author.id, Date.now(), 'cooldowns.crime');
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
}