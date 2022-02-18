const { embed, userDB, exec, ensure, deHunger, deHealth, deThirst, deathNotify, healthNotify, incHealth, incHunger, incThirst, set } = require('../../handler/functions.js');
const Enmap = require('enmap');
const moment = require('moment');

module.exports = {
    name: 'blackjack',
    category: 'Casino',
    permLevel: '0',
    perm: 'User',
    usage: '<start/end/hit/stand> <your bet>',
    cooldown: 2000,
    aliases: ['bl', 'jack', 'bj'],
    description: 'Play some blackjack against the house',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        if (!userDB(msg.author.id).cooldowns.blackjack) set(msg.author.id, '0', 'cooldowns.blackjack');
        const previous = parseInt(userDB(msg.author.id).cooldowns.blackjack);
        let cd = (client.economy.get('blackjack').cooldown - (Date.now() - previous))
        if (previous !== null && previous !== undefined && cd > 0) return embed(msg, 'RED', `Please wait **${moment.duration(cd).format('d [days], h [hours], m [minutes] [and] s [seconds]')}** more before playing blackjack again.`)
        if ((client.economy.get('blackjack').cooldown - (Date.now() - previous)) >= 0) return
        const cards = { _5H: 5, _QH: 10, _QD: 10, _QC: 10, _KH: 10, _KD: 10, _KC: 10, _JS: 10, _JH: 10, _JD: 10, _JC: 10, _AS: 11, _AH: 11, _AD: 11, _AC: 11, _9S: 9, _9H: 9, _9D: 9, _9C: 9, _8S: 8, _8H: 8, _8D: 8, _8C: 8, _7S: 7, _7H: 7, _7D: 7, _7C: 7, _6S: 6, _6H: 6, _6D: 6, _6C: 6, _5S: 5, _5H: 5, _5D: 5, _5C: 5, _4S: 4, _4H: 4, _4D: 4, _4C: 4, _3S: 3, _3H: 3, _3D: 3, _3C: 3, _2S: 2, _2H: 2, _2D: 2, _2C: 2, _10S: 10, _10H: 10, _10D: 10, _10C: 10 }
        const array = Object.keys(cards);
        let mult = 0;
        if (Object.keys(userDB(msg.author.id).items.pets).length > 0) {
            Object.keys(userDB(msg.author.id).items.pets).forEach((key) => {
                mult = mult + userDB(msg.author.id).items.pets[key].multiplier;
            })
        }
        if (userDB(msg.author.id).multiplier !== 0) mult = mult + userDB(msg.author.id).multiplier;
        const action = args[0];
        let input = args[1];
        if (!action) return embed(msg, 'RED', 'You have to choose one of the following options: start/end/hit/stand');
        if (action.toLowerCase() == 'start' && !input) return embed(msg, 'RED', 'If you want to start a game you have to bet at least **$100**!');
        if (input) input = input.replace(/,/g, '').trim();
        if (input) input = String(input).intify();
        if (input && !/^[0-9]+$/.test(input) && input.toLowerCase() == 'max') input = 20000;
        if (action.toLowerCase() == 'start' && !/^[0-9]+$/.test(input)) return embed(msg, 'RED', 'Your bet may only include numbers!');
        if (action.toLowerCase() == 'start' && parseInt(input) < 100) return embed(msg, 'RED', 'If you want to start a game you have to bet at least **100** Casino Chips!');
        if (action.toLowerCase() == 'start' && parseInt(input) > 20000) return embed(msg, 'RED', 'If you want to start a game of blackjack you may not bet more than **20,000** Casino Chips!');
        if (action.toLowerCase() == 'start' && userDB(msg.author.id).blackjack.status == 'in_game') return embed(msg, 'RED', `You currently already are in a game, please finish it first or end it by doing ${prefix}blackjack end!`)
        if (!userDB(msg.author.id).items.general.casino_chips) return embed(msg, 'RED', `You do not own any casino chips, consider buying some by doing \`${prefix}buy chip\``);
        if (action.toLowerCase() == 'start' && userDB(msg.author.id).items.general.casino_chips.amount < parseInt(input)) return embed(msg, 'RED', 'You do not have enough Casino Chips for this bet!');
        if (action.toLowerCase() == 'start' && userDB(msg.author.id).blackjack.status == 'in_game') return embed(msg, 'RED', `You currently already are in a game, please finish it first or end it by doing ${prefix}blackjack end!`)
        if (action.toLowerCase() == 'end'   && userDB(msg.author.id).blackjack.status == 'not_in_game') return embed(msg, 'RED', `You are not currently in any game, you may start one by doing ${prefix}blackjack start <bet>`)
        if (action.toLowerCase() == 'hit'  && userDB(msg.author.id).blackjack.status != 'in_game') return embed(msg, 'RED', `You are not currently in a game, you can start one by doing ${prefix}blackjack start <bet>!`)
        if (action.toLowerCase() == 'stand'  && userDB(msg.author.id).blackjack.status != 'in_game') return embed(msg, 'RED', `You are not currently in a game, you can start one by doing ${prefix}blackjack start <bet>!`)
        if (action.toLowerCase() == 'start') {
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
            set(msg.author.id, 'in_game', 'blackjack.status');
            set(msg.author.id, parseInt(input), 'blackjack.bet');
            const newBal = userDB(msg.author.id).items.general.casino_chips.amount - parseInt(input);
            set(msg.author.id, newBal, 'items.general.casino_chips.amount');
            const card1 = array[Math.floor(Math.random() * array.length)];
            const card2 = array[Math.floor(Math.random() * array.length)];
            const card1House = array[Math.floor(Math.random() * array.length)];
            const card2House = array[Math.floor(Math.random() * array.length)];
            let cardsYour = userDB(msg.author.id).blackjack.cards;
            let cardsHouse = userDB(msg.author.id).blackjack.cardsHouse;
            cardsYour.push(card1);
            cardsYour.push(card2);
            cardsHouse.push(card1House);
            cardsHouse.push(card2House);
            set(msg.author.id, cardsYour, 'blackjack.cards');
            set(msg.author.id, cardsHouse, 'blackjack.cardsHouse');
            let houseValue = 0;
            let yourValue = 0;
            try {
            (userDB(msg.author.id).blackjack.cardsHouse).forEach(a => houseValue = houseValue + cards[a]);
            } catch (err) { console.error(err) }
            (userDB(msg.author.id).blackjack.cards).forEach(a => yourValue = yourValue + cards[a]);
            let Continue;
            let Paycheck;
            const em = new MessageEmbed()
            .setColor("BLUE")
            .setTitle("Blackjack")
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
            .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            if (houseValue == 21) {
                em.addField(`The house deck [${houseValue}]`, (userDB(msg.author.id).blackjack.cardsHouse).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
                em.addField(`Your deck [${yourValue}]`, (userDB(msg.author.id).blackjack.cards).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
                em.setDescription("Too bad you lost, the house got a blackjack..");
                Paycheck = 0;
                Continue = false;
            } else if (yourValue == 21) {
                em.addField(`The house deck [${houseValue}]`, (userDB(msg.author.id).blackjack.cardsHouse).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
                em.addField(`Your deck [${yourValue}]`, (userDB(msg.author.id).blackjack.cards).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
                em.setDescription(`Congratulations you got blackjack! You won **${(parseInt(input) * 5).stringify(msg)}** Casino Chips`);
                Paycheck = Math.floor((userDB(msg.author.id).blackjack.bet) * 5) + Math.floor((Math.floor((userDB(msg.author.id).blackjack.bet) * 5) * (mult)));
                Continue = false;
            } else if (yourValue == 22) {
                em.addField(`The house deck [${houseValue}]`, (userDB(msg.author.id).blackjack.cardsHouse).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
                em.addField(`Your deck [${yourValue}]`, (userDB(msg.author.id).blackjack.cards).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
                em.setDescription(`Bust, you got 22 (GG tho that's rare), you lost..`);
                Paycheck = 0;
                Continue = false;
            } else if (houseValue == 22) {
                em.addField(`The house deck [${houseValue}]`, (userDB(msg.author.id).blackjack.cardsHouse).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
                em.addField(`Your deck [${yourValue}]`, (userDB(msg.author.id).blackjack.cards).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
                em.setDescription(`You won, the house got 22 (that's rare), you got **${(parseInt(input) * 2.5).stringify(msg)}** Casino Chips`);
                Paycheck = Math.floor((userDB(msg.author.id).blackjack.bet) * 2.5) + Math.floor((Math.floor((userDB(msg.author.id).blackjack.bet) * 2.5) * (mult)));
                Continue = false;
            } else {
                em.addField(`The house deck [${houseValue - (cards[(userDB(msg.author.id).blackjack.cardsHouse)[0]])}]`, (userDB(msg.author.id).blackjack.cardsHouse).map(a => client.emojis.cache.find(b => b.name == a)).join('').replace((userDB(msg.author.id).blackjack.cardsHouse).map(a => client.emojis.cache.find(b => b.name == a))[0], client.emojis.cache.find(e => e.name == 'gray_back').toString()))
                em.addField(`Your deck [${yourValue}]`, (userDB(msg.author.id).blackjack.cards).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
                em.setDescription(`${prefix}blackjack hit - Draw a card.\n${prefix}blackjack stand - Stand and let the game end.\nTip: If you click on the cards you get a better view of them!`);
                Paycheck = 0;
                Continue = true;
            }
            await msg.channel.send(em).catch(err => console.error(err));
            if (!Continue && Paycheck > 0) {
                const newBal = (userDB(msg.author.id).items.general.casino_chips.amount + Paycheck);
                await set(msg.author.id, newBal, 'items.general.casino_chips.amount');
                await set(msg.author.id, 'not_in_game', 'blackjack.status');
                await set(msg.author.id, [], 'blackjack.cards');
                await set(msg.author.id, [], 'blackjack.cardsHouse');
                await set(msg.author.id, 0, 'blackjack.bet');
            } else if (!Continue && Paycheck == 0) {
                await set(msg.author.id, 'not_in_game', 'blackjack.status');
                await set(msg.author.id, [], 'blackjack.cards');
                await set(msg.author.id, [], 'blackjack.cardsHouse');
                await set(msg.author.id, 0, 'blackjack.bet');
            }
        } else if (action.toLowerCase() == 'end') {
            await set(msg.author.id, 'not_in_game', 'blackjack.status');
            await set(msg.author.id, [], 'blackjack.cards');
            await set(msg.author.id, [], 'blackjack.cardsHouse');
            await set(msg.author.id, 0, 'blackjack.bet');
            const em = new MessageEmbed()
            .setColor("BLUE")
            .setTitle("Blackjack")
            .setDescription("I have successfully ended your game of blackjack, you will not get a refund of your bet!")
            .setDescription(`To start a new game simply do ${prefix}blackjack start <bet>`);
            msg.channel.send(em);
        } else if (action.toLowerCase() == 'hit') {
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
            const card1 = array[Math.floor(Math.random() * array.length)];
            let cardsYour = userDB(msg.author.id).blackjack.cards;
            cardsYour.push(card1);
            set(msg.author.id, cardsYour, 'blackjack.cards');
            let houseValue = 0;
            let yourValue = 0;
            try {
            (userDB(msg.author.id).blackjack.cardsHouse).forEach(a => houseValue = houseValue + cards[a]);
            } catch (err) { console.error(err) }
            (userDB(msg.author.id).blackjack.cards).forEach(a => yourValue = yourValue + cards[a]);
            let Continue;
            const em = new MessageEmbed()
            .setColor("BLUE")
            .setTitle("Blackjack")
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
            .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            if (yourValue > 21) {
                em.addField(`The house deck [${houseValue}]`, (userDB(msg.author.id).blackjack.cardsHouse).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
                em.addField(`Your deck [${yourValue}]`, (userDB(msg.author.id).blackjack.cards).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
                em.setDescription("Bust, you went above 21, the house won..");
                Continue = false;
            } else {
                em.addField(`The house deck [${houseValue - (cards[(userDB(msg.author.id).blackjack.cardsHouse)[0]])}]`, (userDB(msg.author.id).blackjack.cardsHouse).map(a => client.emojis.cache.find(b => b.name == a)).join('').replace((userDB(msg.author.id).blackjack.cardsHouse).map(a => client.emojis.cache.find(b => b.name == a))[0], client.emojis.cache.find(e => e.name == 'gray_back').toString()))
                em.addField(`Your deck [${yourValue}]`, (userDB(msg.author.id).blackjack.cards).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
                em.setDescription(`${prefix}blackjack hit - Draw a card.\n${prefix}blackjack stand - Stand and let the game end.\nTip: If you click on the cards you get a better view of them!`);
                Continue = true;
            }
            msg.channel.send(em).catch(err => console.error(err));
            if (!Continue) {
                await set(msg.author.id, 'not_in_game', 'blackjack.status');
                await set(msg.author.id, [], 'blackjack.cards');
                await set(msg.author.id, [], 'blackjack.cardsHouse');
                await set(msg.author.id, 0, 'blackjack.bet');
            }
        } else if (action.toLowerCase() == 'stand') {
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
            let houseValue = 0;
            let yourValue = 0;
            let Paycheck;
            try {
            (userDB(msg.author.id).blackjack.cardsHouse).forEach(a => houseValue = houseValue + cards[a]);
            } catch (err) { console.error(err) }
            (userDB(msg.author.id).blackjack.cards).forEach(a => yourValue = yourValue + cards[a]);
            if (houseValue <= 16) {
                const card1House = array[Math.floor(Math.random() * array.length)];
                let cardsHouse = userDB(msg.author.id).blackjack.cardsHouse;
                cardsHouse.push(card1House);
                set(msg.author.id, cardsHouse, 'blackjack.cardsHouse');
                houseValue = 0;
                try {
                (userDB(msg.author.id).blackjack.cardsHouse).forEach(a => houseValue = houseValue + cards[a]);
                } catch (err) { console.error(err) }
                if (houseValue > 21) { // House bust.
                    Paycheck = Math.floor((userDB(msg.author.id).blackjack.bet) * 2.5) + Math.floor((Math.floor((userDB(msg.author.id).blackjack.bet) * 2.5) * (mult)));
                    const em = new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle("Blackjack")
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
                    .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
                    .setDescription(`The house drew a card, the house went bust. You won **${Paycheck.stringify(msg)}** Casino Chips!`)
                    .addField(`The house deck [${houseValue}]`, (userDB(msg.author.id).blackjack.cardsHouse).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
                    .addField(`Your deck [${yourValue}]`, (userDB(msg.author.id).blackjack.cards).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
                    msg.channel.send(em).catch(err => console.error(err));
                    const newBal = (userDB(msg.author.id).items.general.casino_chips.amount + Paycheck);
                    await set(msg.author.id, newBal, 'items.general.casino_chips.amount');
                    await set(msg.author.id, 'not_in_game', 'blackjack.status');
                    await set(msg.author.id, [], 'blackjack.cards');
                    await set(msg.author.id, [], 'blackjack.cardsHouse');
                    return await set(msg.author.id, 0, 'blackjack.bet');
                } else if (houseValue > yourValue) { // House won.
                    Paycheck = 0;
                    const em = new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle("Blackjack")
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
                    .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
                    .setDescription(`The house drew a card, the house has a higher value than yourself. You lost..`)
                    .addField(`The house deck [${houseValue}]`, (userDB(msg.author.id).blackjack.cardsHouse).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
                    .addField(`Your deck [${yourValue}]`, (userDB(msg.author.id).blackjack.cards).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
                    msg.channel.send(em).catch(err => console.error(err));
                    const newBal = (userDB(msg.author.id).items.general.casino_chips.amount + Paycheck);
                    await set(msg.author.id, newBal, 'items.general.casino_chips.amount');
                    await set(msg.author.id, 'not_in_game', 'blackjack.status');
                    await set(msg.author.id, [], 'blackjack.cards');
                    await set(msg.author.id, [], 'blackjack.cardsHouse');
                    return await set(msg.author.id, 0, 'blackjack.bet');
                } else if (houseValue < yourValue) { // House lost.
                    Paycheck = Math.floor((userDB(msg.author.id).blackjack.bet) * 2.5) + Math.floor((Math.floor((userDB(msg.author.id).blackjack.bet) * 2.5) * (mult)));
                    const em = new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle("Blackjack")
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
                    .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
                    .setDescription(`The house drew a card, you however still have a higher value than the house. You won **${Paycheck.stringify(msg)}** Casino Chips!`)
                    .addField(`The house deck [${houseValue}]`, (userDB(msg.author.id).blackjack.cardsHouse).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
                    .addField(`Your deck [${yourValue}]`, (userDB(msg.author.id).blackjack.cards).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
                    msg.channel.send(em).catch(err => console.error(err));
                    const newBal = (userDB(msg.author.id).items.general.casino_chips.amount + Paycheck);
                    await set(msg.author.id, newBal, 'items.general.casino_chips.amount');
                    await set(msg.author.id, 'not_in_game', 'blackjack.status');
                    await set(msg.author.id, [], 'blackjack.cards');
                    await set(msg.author.id, [], 'blackjack.cardsHouse');
                    return await set(msg.author.id, 0, 'blackjack.bet');
                } else if (houseValue == yourValue) { // Push
                    Paycheck = userDB(msg.author.id).blackjack.bet;
                    const em = new MessageEmbed()
                    .setColor("BLUE")
                    .setTitle("Blackjack")
                    .setAuthor(msg.author.username, msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
                    .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
                    .setDescription(`The house drew a card, the house got the same value as yourself. It's a push, you get your **${Paycheck.stringify(msg)}** Casino Chips back`)
                    .addField(`The house deck [${houseValue}]`, (userDB(msg.author.id).blackjack.cardsHouse).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
                    .addField(`Your deck [${yourValue}]`, (userDB(msg.author.id).blackjack.cards).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
                    msg.channel.send(em).catch(err => console.error(err));
                    const newBal = (userDB(msg.author.id).items.general.casino_chips.amount + Paycheck);
                    await set(msg.author.id, newBal, 'items.general.casino_chips.amount');
                    await set(msg.author.id, 'not_in_game', 'blackjack.status');
                    await set(msg.author.id, [], 'blackjack.cards');
                    await set(msg.author.id, [], 'blackjack.cardsHouse');
                    return await set(msg.author.id, 0, 'blackjack.bet');
                }
            }
            const em = new MessageEmbed()
            .setColor("BLUE")
            .setTitle("Blackjack")
            .setAuthor(msg.author.username, msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
            .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            .addField(`The house deck [${houseValue}]`, (userDB(msg.author.id).blackjack.cardsHouse).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
            .addField(`Your deck [${yourValue}]`, (userDB(msg.author.id).blackjack.cards).map(a => client.emojis.cache.find(b => b.name == a)).join(''))
            if (yourValue > houseValue) {
                Paycheck = Math.floor((userDB(msg.author.id).blackjack.bet) * 2.5) + Math.floor((Math.floor((userDB(msg.author.id).blackjack.bet) * 2.5) * (mult)));
                em.setDescription(`Congratulations you got a higher value than the house, you won **${Paycheck.stringify(msg)}** Casino Chips!`);
            } else if (yourValue < houseValue) {
                Paycheck = 0;
                em.setDescription(`Too bad, the house got a higher value than yourself, you lost..`);
            } else if (yourValue == houseValue) {
                Paycheck = Math.floor((userDB(msg.author.id).blackjack.bet));
                em.setDescription(`Push, you got the same value as the house, you got your **${Paycheck.stringify(msg)}** Casino Chips back`);
            }
            msg.channel.send(em).catch(err => console.error(err));
            const newBal = (userDB(msg.author.id).items.general.casino_chips.amount + Paycheck);
            await set(msg.author.id, newBal, 'items.general.casino_chips.amount');
            await set(msg.author.id, 'not_in_game', 'blackjack.status');
            await set(msg.author.id, [], 'blackjack.cards');
            await set(msg.author.id, [], 'blackjack.cardsHouse');
            await set(msg.author.id, 0, 'blackjack.bet');
        } else {
            return embed(msg, 'RED', 'You have to choose one of the following options: start/end/hit/stand');
        }
        return await set(msg.author.id, Date.now(), 'cooldowns.blackjack');
    }
}