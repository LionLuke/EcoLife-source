const { embed, userDB, exec, ensure, getKeyByValue, incHunger, incHealth, incThirst, set, incFat, deFat } = require('../../handler/functions.js');
const Enmap = require('enmap');
const moment = require('moment');

module.exports = {
    name: 'use',
    category: 'General',
    permLevel: '0',
    perm: 'User',
    usage: '<itemID> <(leave blank for 1) amount>',
    description: 'Use items from your inventory',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        let itemID = args[0];
        if (!itemID) return embed(msg, 'RED', 'You need to provide an item to use! Check your inventory for your items and their ID.')
        itemID = args[0].toLowerCase();
        let amount = args[1];
        if (!amount) amount = 1;
        if (amount) amount = String(amount).intify();
        if (!/^[0-9]+$/.test(amount)) return embed(msg, 'RED', `The amount may only include numbers!`);
        amount = parseInt(amount);
        const objectDrinks = userDB(msg.author.id).items.drinks;
        const objectFood = userDB(msg.author.id).items.food;
        let shopType;
        if (false) {
            shopType = 'general';
        } else if (Object.keys(objectDrinks).some(item => objectDrinks[item].id == itemID.toLowerCase())) {
            shopType = 'drinks';
        } else if (Object.keys(objectFood).some(item => objectFood[item].id == itemID.toLowerCase())) {
            shopType = 'food';
        } else {
            return embed(msg, 'RED', 'This item does not exist!')
        }
        if (shopType.toLowerCase() == 'drinks') {
            if (!Object.keys(objectDrinks).some(item => objectDrinks[item].id == itemID.toLowerCase())) return embed(msg, 'RED', 'You do not have an item with the provided ID!');
            if (Object.keys(objectDrinks).some(item => objectDrinks[item].amount < amount && objectDrinks[item].id == itemID.toLowerCase())) return embed(msg, 'RED', 'You do not have an item with the provided ID!');
            const path = `items.drinks.${getKeyByValue(objectDrinks, itemID)}.amount`
            const itemRegain = (parseInt(getKeyByValue(client.economy.get('items').drinks, itemID, 'thirst_regain')) * amount);
            const newItemCount = parseInt(userDB(msg.author.id).items.drinks[getKeyByValue(objectDrinks, itemID)].amount) - amount;
            set(msg.author.id, newItemCount, path);
            incThirst(msg.author.id, itemRegain);
                        
            if (getKeyByValue(client.economy.get('items').drinks, itemID, 'fatInc')) {
                const a = incFat(msg.author.id, getKeyByValue(client.economy.get('items').drinks, itemID, 'fatInc'))
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
                }
            } else if (getKeyByValue(client.economy.get('items').drinks, itemID, 'fatDe')) {
                deFat(msg.author.id, getKeyByValue(client.economy.get('items').drinks, itemID, 'fatDe'));
            }
            
            return embed(msg, 'GREEN', `You succesfully consumed **${amount.stringify(msg)}x** **${objectDrinks[getKeyByValue(objectDrinks, itemID)].name.toProperCase()}** and refilled your thirst bar by **${itemRegain}**.`);
        } else if (shopType.toLowerCase() == 'general') {
            return embed(msg, 'RED', 'This category does not have any items that can be used manually at the moment.')
        } else if (shopType.toLowerCase() == 'food') {
            if (!Object.keys(objectFood).some(item => objectFood[item].id == itemID.toLowerCase())) return embed(msg, 'RED', 'You do not have an item in this category with the provided ID!');
            if (Object.keys(objectFood).some(item => objectFood[item].amount < amount && objectFood[item].id == itemID.toLowerCase())) return embed(msg, 'RED', 'You do not have an item in this category with the provided ID!');
            const path = `items.food.${getKeyByValue(objectFood, itemID)}.amount`
            const itemRegain = (parseInt(getKeyByValue(client.economy.get('items').food, itemID, 'food_regain')) * amount);
            if (itemID.toLowerCase() == 'goldapple') {
                const newItemCount = parseInt(userDB(msg.author.id).items.food.golden_apple.amount) - 1;
                set(msg.author.id, newItemCount, path);
                incHealth(msg.author.id, 0, true);
                incHunger(msg.author.id, 0, true);
                incThirst(msg.author.id, 0, true);
                return embed(msg, 'GREEN', 'You have succesfully consumed **1x** **golden apple**, all your bars have been reset.');
            }
            const newItemCount = parseInt(userDB(msg.author.id).items.food[getKeyByValue(objectFood, itemID)].amount) - amount;
            set(msg.author.id, newItemCount, path);
            incHunger(msg.author.id, itemRegain);
            
            if (getKeyByValue(client.economy.get('items').food, itemID, 'fatInc')) {
                const a = incFat(msg.author.id, getKeyByValue(client.economy.get('items').food, itemID, 'fatInc'))
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
                }
            } else if (getKeyByValue(client.economy.get('items').food, itemID, 'fatDe')) {
                deFat(msg.author.id, getKeyByValue(client.economy.get('items').food, itemID, 'fatDe'));
            }
            
            return embed(msg, 'GREEN', `You succesfully consumed **${amount.stringify(msg)}x** **${objectFood[getKeyByValue(objectFood, itemID)].name.toProperCase()}** and refilled your hunger bar by **${itemRegain}**.`);
        } else {
            return embed(msg, 'RED', 'The category you provided does not exist. Categories: general/food/drinks.');
        }
    }
}