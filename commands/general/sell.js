const { embed, userDB, exec, ensure, getKeyByValue, hasEnough, set, hasEnoughItems } = require('../../handler/functions.js');
const Enmap = require('enmap');

module.exports = {
    name: 'sell',
    category: 'General',
    permLevel: '0',
    perm: 'User',
    usage: '<itemID> <amount (leave blank for 1)>',
    description: 'Sell an item',
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

        if (itemID == 'goldapple') {
            if (amount > 5) amount = 5;
        }
        
        if (itemID == 'chip') return embed(msg, 'RED', `Please use \`${prefix}exchange\` to sell Casino Chips!`);

        let shopType;
        
        if (Object.keys(objectGeneral).some(item => objectGeneral[item].id == itemID.toLowerCase())) {
        
            shopType = 'general';
        
        } else if (Object.keys(objectFood).some(item => objectFood[item].id == itemID.toLowerCase())) {
        
            shopType = 'food';
        
        } else if (Object.keys(objectDrinks).some(item => objectDrinks[item].id == itemID.toLowerCase())) {
        
            shopType = 'drinks';
        
        } else if (Object.keys(objectStorage).some(item => objectStorage[item].id == itemID.toLowerCase())) {

            shopType = 'storage';
            amount = 1;

        } else {
        
            return embed(msg, 'RED', 'This item does not exist!')
        
        }
        
        if (shopType.toLowerCase() == 'general') {
            
            if (getKeyByValue(objectGeneral, itemID, 'price') == undefined) return embed(msg, 'RED', 'The id provided does not link to a valid item in this category.');
            const item = getKeyByValue(objectGeneral, itemID);
            if (!userDB(msg.author.id).items.general[getKeyByValue(objectGeneral, itemID)]) return embed(msg, 'RED', 'You do not have this item.');
            if (!hasEnoughItems(msg.author.id, 'general', item, amount)) return embed(msg, 'RED', 'You do not have enough of this item.');
            const valueOfItem = getKeyByValue(objectGeneral, itemID, 'price');
            let money = 0;
            money = (money + (valueOfItem * 0.40)) * amount;
            const newBal = parseInt(userDB(msg.author.id).balance) + parseInt(money);
            const newAmount = parseInt(userDB(msg.author.id).items.general[getKeyByValue(objectGeneral, itemID)].amount) - parseInt(amount);
            set(msg.author.id, newAmount, `items.general.${getKeyByValue(objectGeneral, itemID)}.amount`);
            set(msg.author.id, newBal, 'balance');
            return embed(msg, 'GREEN', `You succesfully sold **${amount.stringify(msg)}x** **${getKeyByValue(objectGeneral, itemID, 'name').toProperCase()}** for **$${(parseInt(money)).stringify(msg)}**.`);
        
        } else if (shopType.toLowerCase() == 'food') {
            
            if (getKeyByValue(objectFood, itemID, 'price') == undefined) return embed(msg, 'RED', 'The id provided does not link to a valid item in this category.');
            const item = getKeyByValue(objectFood, itemID);
            if (!userDB(msg.author.id).items.food[getKeyByValue(objectFood, itemID)]) return embed(msg, 'RED', 'You do not have this item.');
            if (!hasEnoughItems(msg.author.id, 'food', item, amount)) return embed(msg, 'RED', 'You do not have enough of this item.');
            const valueOfItem = getKeyByValue(objectFood, itemID, 'price');
            let money = 0;
            money = (money + (valueOfItem * 0.40)) * amount;
            const newBal = parseInt(userDB(msg.author.id).balance) + parseInt(money);
            const newAmount = parseInt(userDB(msg.author.id).items.food[getKeyByValue(objectFood, itemID)].amount) - parseInt(amount);
            set(msg.author.id, newAmount, `items.food.${getKeyByValue(objectFood, itemID)}.amount`);
            set(msg.author.id, newBal, 'balance');
            return embed(msg, 'GREEN', `You succesfully sold **${amount.stringify(msg)}x** **${getKeyByValue(objectFood, itemID, 'name').toProperCase()}** for **$${(parseInt(money)).stringify(msg)}**.`);
        
        } else if (shopType.toLowerCase() == 'drinks') {
            
            if (getKeyByValue(objectDrinks, itemID, 'price') == undefined) return embed(msg, 'RED', 'The id provided does not link to a valid item in this category.');
            const item = getKeyByValue(objectDrinks, itemID);
            if (!userDB(msg.author.id).items.drinks[getKeyByValue(objectDrinks, itemID)]) return embed(msg, 'RED', 'You do not have this item.');
            if (!hasEnoughItems(msg.author.id, 'drinks', item, amount)) return embed(msg, 'RED', 'You do not have enough of this item.');
            const valueOfItem = getKeyByValue(objectDrinks, itemID, 'price');
            let money = 0;
            money = (money + (valueOfItem * 0.40)) * amount;
            const newBal = parseInt(userDB(msg.author.id).balance) + parseInt(money);
            const newAmount = parseInt(userDB(msg.author.id).items.drinks[getKeyByValue(objectDrinks, itemID)].amount) - parseInt(amount);
            set(msg.author.id, newAmount, `items.drinks.${getKeyByValue(objectDrinks, itemID)}.amount`);
            set(msg.author.id, newBal, 'balance');
            return embed(msg, 'GREEN', `You succesfully sold **${amount.stringify(msg)}x** **${getKeyByValue(objectDrinks, itemID, 'name').toProperCase()}** for **$${(parseInt(money)).stringify(msg)}**.`);
        
        } else if (shopType.toLowerCase() == 'storage') {

            if (getKeyByValue(objectStorage, itemID, 'price') == undefined) return embed(msg, 'RED', 'The id provided does not link to a valid item in this category.');
            if (userDB(msg.author.id).items.storage !== itemID) return embed(msg, 'RED', 'You do not have this item.');
            const valueOfItem = getKeyByValue(objectStorage, itemID, 'price');
            let money = 0;
            money = (money + (valueOfItem * 0.40)) * 1;
            const newBal = parseInt(userDB(msg.author.id).balance) + parseInt(money);
            set(msg.author.id, '', `items.storage`);
            set(msg.author.id, newBal, 'balance');
            return embed(msg, 'GREEN', `You succesfully sold **1x** **${getKeyByValue(objectStorage, itemID, 'name').toProperCase()}** for **$${(parseInt(money)).stringify(msg)}**.`);

        } else {

            return embed(msg, 'RED', 'The category you provided does not exist! Categories: general/food/drinks/storage.');
        }
    }
}