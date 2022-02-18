const { embed, userDB, exec, ensure, getKeyByValue, hasEnough, set, exceedsWeight } = require('../../handler/functions.js');
const Enmap = require('enmap');

module.exports = {
    name: 'buy',
    category: 'General',
    permLevel: '0',
    perm: 'User',
    usage: '<itemID> <amount (leave blank for 1)>',
    description: 'Buy an item',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        const objectGeneral = client.economy.get('items').general;
        const objectFood = client.economy.get('items').food;
        const objectDrinks = client.economy.get('items').drinks;
        const objectStorage = client.economy.get('items').storage;
        let amount = args[1];
        if (!amount) amount = 1;
        if (amount) amount = String(amount).intify();
        if (!/^[0-9]+$/.test(amount)) return embed(msg, 'RED', `The amount may only include numbers!`);
        amount = parseInt(amount);
        let itemID = args[0];
        if (!itemID) return embed(msg, 'RED', 'You need to specify an item ID!');
        itemID = args[0].toLowerCase();
        let shopType;
        if (Object.keys(objectGeneral).some(item => objectGeneral[item].id == itemID.toLowerCase())) {
            shopType = 'general';
        } else if (Object.keys(objectFood).some(item => objectFood[item].id == itemID.toLowerCase())) {
            shopType = 'food';
        } else if (Object.keys(objectDrinks).some(item => objectDrinks[item].id == itemID.toLowerCase())) {
            shopType = 'drinks';
        } else if (Object.keys(objectStorage).some(item => objectStorage[item].id == itemID.toLowerCase())) {
            shopType = 'storage'
        } else {
            return embed(msg, 'RED', 'This item does not exist!')
        }
        if (shopType.toLowerCase() == 'general') {
            if (getKeyByValue(objectGeneral, itemID, 'price') == undefined) return embed(msg, 'RED', 'The id provided does not link to a valid item in this category.');
            let price = getKeyByValue(objectGeneral, itemID, 'price');
            price = price * amount;
            if (!hasEnough(msg.author.id, price)) return embed(msg, 'RED', 'You do not have enough money to buy this item.');
            if (itemID == 'chip')  {
                if (amount > 40000) {
                    return embed(msg, 'RED', 'You may not buy anymore casino chips after already owning **40,000** Casino Chips!');
                }

                if (userDB(msg.author.id).items.general.casino_chips && userDB(msg.author.id).items.general.casino_chips.amount >= 40000) {
                    return embed(msg, 'RED', 'You may not buy anymore casino chips after already owning **40,000** Casino Chips!');
                }
            }
            if (exceedsWeight(client.economy.get('items'), msg.author.id, getKeyByValue(objectGeneral, itemID), amount, 'general')) return embed(msg, 'RED', `By purchasing ${amount == 1 ? 'this item' : 'these items'} you will exceed your weight limit!`)
            const path = `items.general.${getKeyByValue(objectGeneral, itemID)}`;
            const path2 = `items.general.${getKeyByValue(objectGeneral, itemID)}.amount`;
            const item = getKeyByValue(objectGeneral, itemID);
            const newBal = parseInt(userDB(msg.author.id).balance) - parseInt(price);
            let skip = false;
            if (!userDB(msg.author.id)['items']['general'][item]) {
                set(msg.author.id, {id: getKeyByValue(objectGeneral, itemID, 'id'), name: getKeyByValue(objectGeneral, itemID, 'name'), amount: amount}, path);
                skip = true;
            }
            set(msg.author.id, newBal, 'balance');
            if (!skip) {
                const amount1 = parseInt(userDB(msg.author.id).items.general[item].amount) + amount;
                set(msg.author.id, amount1, path2);
            }
            return embed(msg, 'GREEN', `You succesfully bought **${amount.stringify(msg)}x** **${getKeyByValue(objectGeneral, itemID, 'name').toProperCase()}** for **$${(parseInt(price)).stringify(msg)}**.`);
        } else if (shopType.toLowerCase() == 'food') {
            if (getKeyByValue(objectFood, itemID, 'price') == undefined) return embed(msg, 'RED', 'The id provided does not link to a valid item in this category.');
            let price = getKeyByValue(objectFood, itemID, 'price');
            price = price * amount;
            if (!hasEnough(msg.author.id, price)) return embed(msg, 'RED', 'You do not have enough money to buy this item.');
            if (exceedsWeight(client.economy.get('items'), msg.author.id, getKeyByValue(objectFood, itemID), amount, 'food')) return embed(msg, 'RED', `By purchasing ${amount == 1 ? 'this item' : 'these items'} you will exceed your weight limit!`)
            const path = `items.food.${getKeyByValue(objectFood, itemID)}`;
            const path2 = `items.food.${getKeyByValue(objectFood, itemID)}.amount`;
            const item = getKeyByValue(objectFood, itemID);
            const newBal = parseInt(userDB(msg.author.id).balance) - parseInt(price);
            let skip = false;
            if (!userDB(msg.author.id)['items']['food'][item]) {
                set(msg.author.id, {id: getKeyByValue(objectFood, itemID, 'id'), name: getKeyByValue(objectFood, itemID, 'name'), amount: amount}, path);
                skip = true;
            }
            set(msg.author.id, newBal, 'balance');
            if (!skip) {
                const amount1 = parseInt(userDB(msg.author.id).items.food[item].amount) + amount;
                set(msg.author.id, amount1, path2);
            }
            return embed(msg, 'GREEN', `You succesfully bought **${amount.stringify(msg)}x** **${getKeyByValue(objectFood, itemID, 'name').toProperCase()}** for **$${(parseInt(price)).stringify(msg)}**.`);
        } else if (shopType.toLowerCase() == 'drinks') {
            if (getKeyByValue(objectDrinks, itemID, 'price') == undefined) return embed(msg, 'RED', 'The id provided does not link to a valid item in this category.');
            let price = getKeyByValue(objectDrinks, itemID, 'price');
            price = price * amount;
            if (!hasEnough(msg.author.id, price)) return embed(msg, 'RED', 'You do not have enough money to buy this item.');
            if (exceedsWeight(client.economy.get('items'), msg.author.id, getKeyByValue(objectDrinks, itemID), amount, 'drinks')) return embed(msg, 'RED', `By purchasing ${amount == 1 ? 'this item' : 'these items'} you will exceed your weight limit!`)
            const path = `items.drinks.${getKeyByValue(objectDrinks, itemID)}`;
            const path2 = `items.drinks.${getKeyByValue(objectDrinks, itemID)}.amount`;
            const item = getKeyByValue(objectDrinks, itemID);
            const newBal = parseInt(userDB(msg.author.id).balance) - parseInt(price);
            let skip = false;
            if (!userDB(msg.author.id)['items']['drinks'][item]) {
                set(msg.author.id, {id: getKeyByValue(objectDrinks, itemID, 'id'), name: getKeyByValue(objectDrinks, itemID, 'name'), amount: amount}, path);
                skip = true;
            }
            set(msg.author.id, newBal, 'balance');
            if (!skip) {
                const amount1 = parseInt(userDB(msg.author.id).items.drinks[item].amount) + amount;
                set(msg.author.id, amount1, path2);
            }
            return embed(msg, 'GREEN', `You succesfully bought **${amount.stringify(msg)}x** **${getKeyByValue(objectDrinks, itemID, 'name').toProperCase()}** for **$${(parseInt(price)).stringify(msg)}**.`);
        } else if (shopType == 'storage') {
            if (getKeyByValue(objectStorage, itemID, 'price') == undefined) return embed(msg, 'RED', 'The id provided does not link to a valid item in this category.');
            let price = getKeyByValue(objectStorage, itemID, 'price');
            price = price;
            if (!hasEnough(msg.author.id, price)) return embed(msg, 'RED', 'You do not have enough money to buy this item.');
            const item = getKeyByValue(objectStorage, itemID);
            const newBal = parseInt(userDB(msg.author.id).balance) - parseInt(price);
            if (!userDB(msg.author.id).items.storage) {
                set(msg.author.id, itemID, 'items.storage');
            } else {
                return embed(msg, 'RED', `You may only own **1** storage item at once, sell your current first by doing ${prefix}sell.`)
            }
            set(msg.author.id, newBal, 'balance');
            return embed(msg, 'GREEN', `You succesfully bought **1x** **${getKeyByValue(objectStorage, itemID, 'name').toProperCase()}** for **$${(parseInt(price)).stringify(msg)}**.`);
        } else {
            return embed(msg, 'RED', 'The category you provided does not exist! Categories: general/food/drinks/storage.');
        }
    }
}