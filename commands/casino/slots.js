const { embed, userDB, exec, ensure, deHunger, deHealth, deThirst, deathNotify, healthNotify, incHealth, incHunger, incThirst, set } = require('../../handler/functions.js');
const Enmap = require('enmap');
const moment = require('moment');

module.exports = {
    name: 'slots',
    category: 'Casino',
    permLevel: '0',
    perm: 'User',
    usage: '<amount of casino chips to bet>',
    cooldown: 30000,
    description: 'Try your luck on the casino slots',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        const previous = parseInt(userDB(msg.author.id).cooldowns.slots);
        let cd = (client.economy.get('slots').cooldown - (Date.now() - previous))
        if (previous !== null && previous !== undefined && cd > 0) return embed(msg, 'RED', `Please wait **${moment.duration(cd).format('d [days], h [hours], m [minutes] [and] s [seconds]')}** more before trying your luck on the slots machine again.`)
        if ((client.economy.get('slots').cooldown - (Date.now() - previous)) >= 0) return
        if (!args[0]) return embed(msg, 'RED', 'You must specify an amount of Casino Chips to bet!');
        let bet = args[0].replace(/,/g, '').replace('all', userDB(msg.author.id).balance).trim();
        if (bet) bet = String(bet).intify();
        if (bet && !/^[0-9]+$/.test(bet) && bet.toLowerCase() == 'max') bet = 20000;
        if (!/^[0-9]+$/.test(bet)) return embed(msg, 'RED', 'Your input may only include numbers!');
        if (!userDB(msg.author.id).items.general.casino_chips) return embed(msg, 'RED', `You do not own any casino chips, consider buying some by doing \`${prefix}buy chip\``);
        if (parseInt(userDB(msg.author.id).items.general.casino_chips.amount) < parseInt(args[0])) return embed(msg, 'RED', 'You do not have enough Casino Chips for this bet!');
        if (parseInt(bet) < 100) return embed(msg, 'RED', 'You must bet at least **100** Casino Chips!');
        if (parseInt(bet) > 20000) return embed(msg, 'RED', 'You may not bet more than **20,000** Casino Chips!');
        if (isNaN(parseInt(bet))) return embed(msg, 'RED', 'You must specify a number!');
        if (['infinity', 'nan'].includes(bet.toLowerCase())) return embed(msg, 'RED', 'You must specify a number!');
        let mult = 0;
        if (Object.keys(userDB(msg.author.id).items.pets).length > 0) {
            Object.keys(userDB(msg.author.id).items.pets).forEach((key) => {
                mult = mult + userDB(msg.author.id).items.pets[key].multiplier;
            })
        }
        if (userDB(msg.author.id).multiplier !== 0) mult = mult + userDB(msg.author.id).multiplier;
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
        function hasClover(id) {
            let has = false;
            if (!userDB(msg.author.id).items.general.clover) return has;
            if (userDB(msg.author.id).items.general.clover.amount > 0) has = true;
            return has;
        };
        let items = ['💎', '🛎️', '🗿', '💰', '👑', '🤩', '🎖️'];
        let usedClover = false;
        if (hasClover(msg.author.id)) {
            items = ['💎', '🛎️', '🗿', '💰', '👑'];
            usedClover = true;
            const newAmount = parseInt(userDB(msg.author.id).items.general.clover.amount) - 1;
            set(msg.author.id, newAmount, 'items.general.clover.amount');
        }
        const item1 = items[Math.floor(Math.random() * items.length)];
        const item2 = items[Math.floor(Math.random() * items.length)];
        const item3 = items[Math.floor(Math.random() * items.length)];
        function areEqual(){
            var len = arguments.length;
            for (var i = 1; i< len; i++){
               if (arguments[i] === null || arguments[i] !== arguments[i-1])
                  return false;
            }
            return true;
        }
        if (areEqual(item1, item2, item3)) {
            const payout = Math.floor(parseInt(bet) * 1.25) + Math.floor((parseInt(bet) * 1.25) * mult)
            const newBal = Math.floor(parseInt(userDB(msg.author.id).items.general.casino_chips.amount) + payout);
            const em = new MessageEmbed()
            .setTitle("Slots")
            .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true }))
            em.setColor("BLUE");
            if (usedClover) em.setDescription("You rubbed a clover out on your skin before trying your luck on the slots machine, it was very affective.");
            em.addField("Output", `${item1} | ${item2} | ${item3}`);
            em.addField("Casino Chips", `**${payout.stringify(msg)}**`);
            msg.channel.send(em);
            set(msg.author.id, newBal, 'items.general.casino_chips.amount');
            return set(msg.author.id, Date.now(), 'cooldowns.slots');
        } else if (areEqual(item1, item2)) {
            const payout = Math.floor(parseInt(bet) * 0.80) + Math.floor((parseInt(bet) * 0.80) * mult)
            const newBal = Math.floor(parseInt(userDB(msg.author.id).items.general.casino_chips.amount) + payout);
            const em = new MessageEmbed()
            .setTitle("Slots")
            .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true }))
            em.setColor("BLUE");
            if (usedClover) em.setDescription("You rubbed a clover out on your skin before trying your luck on the slots machine, it was a little affective.");
            em.addField("Output", `${item1} | ${item2} | ${item3}`);
            em.addField("Casino Chips", `**${payout.stringify(msg)}**`);
            msg.channel.send(em);
            set(msg.author.id, newBal, 'items.general.casino_chips.amount');
            return set(msg.author.id, Date.now(), 'cooldowns.slots');
        } else if (areEqual(item1, item3)) {
            const payout = Math.floor(parseInt(bet) * 0.80) + Math.floor((parseInt(bet) * 0.80) * mult)
            const newBal = Math.floor(parseInt(userDB(msg.author.id).items.general.casino_chips.amount) + payout);
            const em = new MessageEmbed()
            .setTitle("Slots")
            .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true }))
            em.setColor("BLUE");
            if (usedClover) em.setDescription("You rubbed a clover out on your skin before trying your luck on the slots machine, it was a little affective.");
            em.addField("Output", `${item1} | ${item2} | ${item3}`);
            em.addField("Casino Chips", `**${payout.stringify(msg)}**`);
            msg.channel.send(em);
            set(msg.author.id, newBal, 'items.general.casino_chips.amount');
            return set(msg.author.id, Date.now(), 'cooldowns.slots');
        } else if (areEqual(item2, item3)) {
            const payout = Math.floor(parseInt(bet) * 0.80) + Math.floor((parseInt(bet) * 0.80) * mult)
            const newBal = Math.floor(parseInt(userDB(msg.author.id).items.general.casino_chips.amount) + payout);
            const em = new MessageEmbed()
            .setTitle("Slots")
            .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true }))
            em.setColor("BLUE");
            if (usedClover) em.setDescription("You rubbed a clover out on your skin before trying your luck on the slots machine, it was a little affective.");
            em.addField("Output", `${item1} | ${item2} | ${item3}`);
            em.addField("Casino Chips", `**${payout.stringify(msg)}**`);
            msg.channel.send(em);
            set(msg.author.id, newBal, 'items.general.casino_chips.amount');
            return set(msg.author.id, Date.now(), 'cooldowns.slots');
        } else {
            const newBal = parseInt(userDB(msg.author.id).items.general.casino_chips.amount) - bet;
            const em = new MessageEmbed()
            .setTitle("Slots")
            .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true }))
            em.setColor("BLUE");
            if (usedClover) em.setDescription("You rubbed a clover out on your skin before trying your luck on the slots machine, it wasn't very affective.");
            em.addField("Output", `${item1} | ${item2} | ${item3}`);
            em.addField("Casino Chips", `-**${parseInt(bet).stringify(msg)}**`);
            msg.channel.send(em);
            set(msg.author.id, newBal, 'items.general.casino_chips.amount');
            return set(msg.author.id, Date.now(), 'cooldowns.slots'); 
        }
    }
}