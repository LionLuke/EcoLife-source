const { embed, userDB, exec, ensure, getKeyByValue, hasEnough, set, hasEnoughItems, exceedsWeight } = require('../../handler/functions.js');
const Enmap = require('enmap');

module.exports = {
    name: 'gift',
    category: 'General',
    permLevel: '0',
    perm: 'User',
    usage: '<UserID/@mention> <itemID> <amount (leave blank for 1)>',
    description: 'Gift an item to another player',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        const objectGeneral = client.economy.get('items').general;
        const objectFood = client.economy.get('items').food;
        const objectDrinks = client.economy.get('items').drinks;
        let amount = args[2];
        if (!amount) amount = 1;
        if (amount) amount = String(amount).intify();
        if (!/^[0-9]+$/.test(amount)) return embed(msg, 'RED', `The amount may only include numbers!`);
        amount = parseInt(amount);
        let itemID = args[1];
        if (!itemID) return embed(msg, 'RED', 'You need to specify an item ID!');
        itemID = args[1].toLowerCase();

        let user = msg.mentions.members.first() || msg.guild.member(args[0]);
        if (!user) return embed(msg, 'RED', 'Please insert a member mention or ID!');
        user = user.user;
        if (user.id == msg.author.id) return embed(msg, 'RED', 'You may not gift items to yourself!');
        if (user.bot) return embed(msg, 'RED', 'You may not gift items to bots!');
        await ensure(user.id);

        if (itemID == 'goldapple') return embed(msg, 'RED', `You may not gift the golden apple as it is worth way too much money!`);
        if (itemID == 'chip') return embed(msg, 'RED', `You may not gift Casino Chips, use \`${prefix}give\` to hand out money!`);

        let shopType;
        
        if (Object.keys(objectGeneral).some(item => objectGeneral[item].id == itemID.toLowerCase())) {
        
            shopType = 'general';
        
        } else if (Object.keys(objectFood).some(item => objectFood[item].id == itemID.toLowerCase())) {
        
            shopType = 'food';
        
        } else if (Object.keys(objectDrinks).some(item => objectDrinks[item].id == itemID.toLowerCase())) {
        
            shopType = 'drinks';
        
        } else {
        
            return embed(msg, 'RED', 'This item does not exist!')
        
        }
        
        if (shopType.toLowerCase() == 'general') {
            
            if (getKeyByValue(objectGeneral, itemID, 'price') == undefined) return embed(msg, 'RED', 'The id provided does not link to a valid item in this category.');
            const item = getKeyByValue(objectGeneral, itemID);
            if (!userDB(msg.author.id).items.general[getKeyByValue(objectGeneral, itemID)]) return embed(msg, 'RED', 'You do not have this item.');
            if (!hasEnoughItems(msg.author.id, 'general', item, amount)) return embed(msg, 'RED', 'You do not have enough of this item.');
            if (exceedsWeight(client.economy.get('items'), user.id, getKeyByValue(objectGeneral, itemID), amount, 'general')) return embed(msg, 'RED', `By gifting ${amount == 1 ? 'this item' : 'these items'} you will exceed the weight limit of this person!`)
            const valueOfItem = getKeyByValue(objectGeneral, itemID, 'price');
            let money = 0;
            money = (money + (valueOfItem * 0.40)) * amount;
            const newAmountUser = parseInt(userDB(user.id).items.general[getKeyByValue(objectGeneral, itemID)]) ? parseInt(userDB(user.id).items.general[getKeyByValue(objectGeneral, itemID)].amount) + parseInt(amount) : parseInt(amount);
            const newAmount = parseInt(userDB(msg.author.id).items.general[getKeyByValue(objectGeneral, itemID)].amount) - parseInt(amount);
            set(msg.author.id, newAmount, `items.general.${getKeyByValue(objectGeneral, itemID)}.amount`);
            set(user.id, {name: getKeyByValue(objectGeneral, itemID, 'name'), id: getKeyByValue(objectGeneral, itemID, 'id'), amount: newAmountUser}, `items.general.${getKeyByValue(objectGeneral, itemID)}`);
            return embed(msg, 'GREEN', `You succesfully gifted **${amount.stringify(msg)}x** **${getKeyByValue(objectGeneral, itemID, 'name').toProperCase()}** to **${user.username}**.`);
        
        } else if (shopType.toLowerCase() == 'food') {
            
            if (getKeyByValue(objectFood, itemID, 'price') == undefined) return embed(msg, 'RED', 'The id provided does not link to a valid item in this category.');
            const item = getKeyByValue(objectFood, itemID);
            if (!userDB(msg.author.id).items.food[getKeyByValue(objectFood, itemID)]) return embed(msg, 'RED', 'You do not have this item.');
            if (!hasEnoughItems(msg.author.id, 'food', item, amount)) return embed(msg, 'RED', 'You do not have enough of this item.');
            if (exceedsWeight(client.economy.get('items'), user.id, getKeyByValue(objectFood, itemID), amount, 'food')) return embed(msg, 'RED', `By gifting ${amount == 1 ? 'this item' : 'these items'} you will exceed the weight limit of this person!`)
            const valueOfItem = getKeyByValue(objectFood, itemID, 'price');
            let money = 0;
            money = (money + (valueOfItem * 0.40)) * amount;
            const newAmountUser = parseInt(userDB(user.id).items.general[getKeyByValue(objectFood, itemID)]) ? parseInt(userDB(user.id).items.general[getKeyByValue(objectFood, itemID)].amount) + parseInt(amount) : parseInt(amount);
            const newAmount = parseInt(userDB(msg.author.id).items.food[getKeyByValue(objectFood, itemID)].amount) - parseInt(amount);
            set(msg.author.id, newAmount, `items.food.${getKeyByValue(objectFood, itemID)}.amount`);
            set(user.id, {name: getKeyByValue(objectFood, itemID, 'name'), id: getKeyByValue(objectFood, itemID, 'id'), amount: newAmountUser}, `items.food.${getKeyByValue(objectFood, itemID)}`);
            return embed(msg, 'GREEN', `You succesfully gifted **${amount.stringify(msg)}x** **${getKeyByValue(objectFood, itemID, 'name').toProperCase()}** to **${user.username}**.`);
        
        } else if (shopType.toLowerCase() == 'drinks') {
            
            if (getKeyByValue(objectDrinks, itemID, 'price') == undefined) return embed(msg, 'RED', 'The id provided does not link to a valid item in this category.');
            const item = getKeyByValue(objectDrinks, itemID);
            if (!userDB(msg.author.id).items.drinks[getKeyByValue(objectDrinks, itemID)]) return embed(msg, 'RED', 'You do not have this item.');
            if (!hasEnoughItems(msg.author.id, 'drinks', item, amount)) return embed(msg, 'RED', 'You do not have enough of this item.');
            if (exceedsWeight(client.economy.get('items'), user.id, getKeyByValue(objectDrinks, itemID), amount, 'drinks')) return embed(msg, 'RED', `By gifting ${amount == 1 ? 'this item' : 'these items'} you will exceed the weight limit of this person!`)
            const valueOfItem = getKeyByValue(objectDrinks, itemID, 'price');
            let money = 0;
            money = (money + (valueOfItem * 0.40)) * amount;
            const newAmountUser = parseInt(userDB(user.id).items.general[getKeyByValue(objectDrinks, itemID)]) ? parseInt(userDB(user.id).items.general[getKeyByValue(objectDrinks, itemID)].amount) + parseInt(amount) : parseInt(amount);
            const newAmount = parseInt(userDB(msg.author.id).items.drinks[getKeyByValue(objectDrinks, itemID)].amount) - parseInt(amount);
            set(msg.author.id, newAmount, `items.drinks.${getKeyByValue(objectDrinks, itemID)}.amount`);
            set(user.id, {name: getKeyByValue(objectDrinks, itemID, 'name'), id: getKeyByValue(objectDrinks, itemID, 'id'), amount: newAmountUser}, `items.drinks.${getKeyByValue(objectDrinks, itemID)}`);
            return embed(msg, 'GREEN', `You succesfully gifted **${amount.stringify(msg)}x** **${getKeyByValue(objectDrinks, itemID, 'name').toProperCase()}** to **${user.username}**.`);
        
        } else {
            return embed(msg, 'RED', 'The category you provided does not exist! Categories: general/food/drinks.');
        }
    }
}