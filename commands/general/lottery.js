const { embed, userDB, exec, ensure, deHunger, deHealth, deThirst, deathNotify, healthNotify, incHealth, incHunger, incThirst, set } = require('../../handler/functions.js');
const Enmap = require('enmap');
const moment = require('moment');

module.exports = {
    name: 'lottery',
    category: 'General',
    permLevel: '0',
    perm: 'User',
    usage: '<(optional) check> <(optional (defaults back to 1 if input in higher than 400)) amount>',
    description: 'Check how big the jackpot is or scratch a ticket',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        const previous = parseInt(userDB(msg.author.id).cooldowns.lottery) || 0;
        let cd = (7200000 - (Date.now() - previous))
        if (previous !== null && previous !== undefined && cd > 0) {
            return embed(msg, 'RED', `Please wait **${moment.duration(cd).format('d [days], h [hours], m [minutes] [and] s [seconds]')}** before scratching tickets again, give others a chance to win the lottery as well.`)
        } if ((7200000 - (Date.now() - previous)) <= 0) {
            const tickets = userDB(msg.author.id).items.general.lottery_ticket ? userDB(msg.author.id).items.general.lottery_ticket.amount : 0;
            let amount = 1;
            if (args[0] && args[1] && /^[0-9]+$/.test(args[1]) && parseInt(args[1]) <= 400) amount = parseInt(args[1]);
            if (args[0] && tickets < amount) return embed(msg, 'RED', 'You do not have enough tickets to scratch!');
            const jackpot = new Enmap({ name: 'jackpot' }).get('global');
            if (!args[0]) {
                const em = new MessageEmbed()
                .setColor("BLUE")
                .setTitle("Lottery")
                .setDescription(`The current jackpot is set to **$${jackpot.stringify(msg)}**.`)
                .setFooter(`In order to buy a lottery ticket; run '${prefix}buy ticket'. Goodluck!\nIn order to check a ticket; run '${prefix}lottery check'. Goodluck!`)
                .setTimestamp();
                return msg.channel.send(em);
            } else {
                if (userDB(msg.author.id).balance > 100000000) return embed(msg, 'RED', 'You may not participate in the lottery if you have over $100 million in your balance!')
                const checking = new MessageEmbed()
                .setColor("BLUE")
                .setDescription(`<a:CheckingTicket:767749203643727872> Checking lottery ticket${amount > 1 ? 's' : ''}...`);
                const outcome = (Math.floor(Math.random() * (500 - amount)) + 1) == 1;
                const embed1 = await msg.channel.send(checking);
                setTimeout(async function () {
                    if (outcome) {
                        const em = new MessageEmbed()
                        .setColor("BLUE")
                        .setDescription(`Congratulations, you won the jackpot of **$${jackpot.stringify(msg)}**!`);
                        await embed1.edit(em);
                        const newBal = (userDB(msg.author.id).balance) + jackpot;
                        const newTicketCount = (userDB(msg.author.id).items.general.lottery_ticket.amount) - amount;
                        set(msg.author.id, newBal, 'balance');
                        set(msg.author.id, newTicketCount, 'items.general.lottery_ticket.amount');
                        const newJackpot = Math.floor(Math.random() * 1000000) + 100000;
                        const lotteryChan = client.channels.cache.get('713754084577902694');
                        const em2 = new MessageEmbed()
                        .setTitle("Congratuations!")
                        .setColor("BLUE")
                        .setDescription(`${msg.author.toString()} has won the jackpot of **$${jackpot.stringify(msg)}**!`)
                        .setFooter(`New jackpot: $${newJackpot.stringify(msg)}`);
                        await lotteryChan.send(em2).catch(err => err);
                        new Enmap({ name: 'jackpot' }).set('global', newJackpot);
                        set(msg.author.id, Date.now(), 'cooldowns.lottery');
                    } else {
                        const em = new MessageEmbed()
                        .setColor("BLUE")
                        .setDescription(`${amount > 1 ? 'These' : 'This'} ${amount > 1 ? 'are' : 'is'} not the winning lottery ticket${amount > 1 ? 's' : ''}, try to scratch another one. Better luck next time!`);
                        await embed1.edit(em);
                        const newTicketCount = (userDB(msg.author.id).items.general.lottery_ticket.amount) - amount;
                        set(msg.author.id, newTicketCount, 'items.general.lottery_ticket.amount');
                        const newJackpot = jackpot + (1000 * amount);
                        new Enmap({ name: 'jackpot' }).set('global', newJackpot);
                    }
                }, 1790);
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
                return
            }
        }
    }
}