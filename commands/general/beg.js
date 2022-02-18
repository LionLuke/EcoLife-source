const { embed, userDB, exec, ensure, deHunger, deHealth, deThirst, deathNotify, healthNotify, incHealth, incHunger, incThirst, set } = require('../../handler/functions.js');
const Enmap = require('enmap');
const moment = require('moment');

module.exports = {
    name: 'beg',
    category: 'General',
    permLevel: '0',
    aliases: [],
    perm: 'User',
    usage: '',
    cooldown: 900000,
    description: 'Beg for some money',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        const beg = client.economy.get('beg');
        const previous = parseInt(userDB(msg.author.id).cooldowns.beg) || 0;
        let cd = (parseInt(beg.cooldown) - (Date.now() - previous))
        if (previous !== null && previous !== undefined && cd > 0) {
            return embed(msg, 'RED', `Please wait another **${moment.duration(cd).format('d [days], h [hours], m [minutes] [and] s [seconds]')}** before begging for money again.`)
        } if ((parseInt(beg.cooldown) - (Date.now() - previous)) <= 0) {
            const stories = client.economy.get('beg').stories;
            let mult = 0;
            if (Object.keys(userDB(msg.author.id).items.pets).length > 0) {
                Object.keys(userDB(msg.author.id).items.pets).forEach((key) => {
                    mult = mult + userDB(msg.author.id).items.pets[key].multiplier;
                })
            }
            if (userDB(msg.author.id).multiplier !== 0) mult = mult + userDB(msg.author.id).multiplier;
            const story = stories[Math.floor(Math.random() * stories.length)];
            const payout = Math.floor(parseInt(Math.floor(Math.random() * parseInt(beg.payout.max))) + parseInt(beg.payout.min)) + (Math.floor(parseInt(Math.floor(Math.random() * parseInt(beg.payout.max))) + parseInt(beg.payout.min) * mult));
            const newBal = parseInt(userDB(msg.author.id).balance) + parseInt(payout);
            const em = new MessageEmbed()
            .setColor("BLUE")
            .setTitle("Beg")
            .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            .addField("Story", story)
            .addField("Paycheck", `$${payout.stringify(msg)}`);
            msg.channel.send(em).catch(err => console.error);
            set(msg.author.id, newBal, 'balance');
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
            return set(msg.author.id, Date.now(), 'cooldowns.beg'); 
        }
    }
}