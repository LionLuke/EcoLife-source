const Enmap = require('enmap');
const { MessageEmbed } = require('discord.js');

module.exports = {
    embed: function(msg, color, description) {
        const em = new MessageEmbed()
          .setColor(color)
          .setDescription(description);
        return msg.channel.send(em).catch(err => client.debugg ? console.error : false);
    },
    setPrefix: function(guildID, input, path) {
        return new Enmap({ name: `guildSettings` }).set(guildID, input, path);
    },
    getPrefix: function(guildID) {
        return new Enmap({ name: `guildSettings` }).get(guildID).prefix;
    },
    userDB: function(userID) {
        return new Enmap({ name: 'users' }).get(userID);
        // return users.findById(userID);
    },
    dbSet: function(id, value, path) {
        return new Enmap({ name: 'users' }).set(id, value, path);
        /*const user = users.findById(id);
        user[path]  //things like body.hunger and etc wont work with this tho :/ */
    },
    dblc: function() {
        return new Enmap({ name: 'lotC' }).get('default');
    },
    dblcSet: function() {
        return new Enmap({ name: 'lotC' }).set('default', Date.now())
    },
    set: function(userID, value, path) {
        if (userID == undefined) throw new ReferenceError("userID is undefined");
        if (value == undefined) throw new ReferenceError("value is undefined");
        if (path == undefined) throw new ReferenceError("path is undefined");
        return new Enmap({ name: 'users' }).set(userID, value, path);
    },
    delete: function(userID, path) {
        if (!userID) throw new ReferenceError("userID is undefined");
        if (!path) throw new ReferenceError("path is undefined");
        return new Enmap({ name: 'users' }).delete(userID, path);
    },
    deleteUser: function(userID) {
        if (!userID) throw new ReferenceError("userID is undefined");
        return new Enmap({ name: 'users' }).delete(userID);
    },
    reset: function(userID) {
        if (!userID) throw new ReferenceError("userID is undefined");
        return new Enmap({ name: 'users' }).delete(userID);
        // return users.findByIdAndDelete(userID);
    },
    exec: function(command) {
        try{
            require('child_process').exec(command);
            return require('shelljs').execSync(command).toString();
        } catch (error) {
            return error
        }
    },
    ensure: function(ID) {
        return new Enmap({ name: 'users' }).ensure(ID, {
            balance: 0,
            maxWeight: 40,
            id: ID,
            cooldowns: {work: '0', crime: '0', daily: '0', slots: '0', doctor: '0', rob: '0', beg: '0'},
            blackjack: {status: 'not_in_game', bet: 0, cards: [], cardsHouse: []},
            body: {health: '100', hunger: '100', thirst: '100', fat: '0'},
            job: 'unemployed',
            vehicle: 'none',
            property: 'homeless',
            robbed: {status: false, by: ''}, // status = boolean, by = user ID.
            passiveMode: false,
            items: {general: {}, food: {}, drinks: {}, pets: {}},
            hunting: {}, // Soon.
            mining: {}, // Soon.
            fishing: {}, // Soon.
            lottery: {ticket: '0'} // Ticket will be '1' if bought.
            });
    },
    totalStorage: function(object, ID) {
        const { getKeyByValue } = require('./functions.js');
        const user = new Enmap({ name: 'users' }).get(ID);
        if (!user.items.storage) return 0;
        return getKeyByValue(object, user.items.storage, 'weight')
    },
    exceedsWeight: function(object, ID, itemToAdd, amount, itemType) {
        const { totalStorage } = require('./functions.js');
        const user = new Enmap({ name: 'users' }).get(ID);
        const maxWeight = user.maxWeight + totalStorage(object.storage, ID);
        let currentWeight = 0;
        const items = object;
        // Weight of food
        Object.keys(user.items.food).filter(k => user.items.food[k].amount > 0).forEach((k) => {
            currentWeight = (currentWeight) + (items.food[k].weight * user.items.food[k].amount)
        });
        // Weight of general
        Object.keys(user.items.general).filter(k => user.items.general[k].amount > 0).forEach((k) => {
            currentWeight = (currentWeight) + (items.general[k].weight * user.items.general[k].amount)
        });
        // Weight of drinks
        Object.keys(user.items.drinks).filter(k => user.items.drinks[k].amount > 0).forEach((k) => {
            currentWeight = (currentWeight) + (items.drinks[k].weight * user.items.drinks[k].amount)
        });
        currentWeight = (currentWeight) + (items[itemType][itemToAdd].weight * amount);
        currentWeight = currentWeight.toFixed(2);
        if (currentWeight > maxWeight) return true // Exceeds max weight
        return false // Does not exceed max weight 
    },
    currentWeight: function(object, ID) {
        const user = new Enmap({ name: 'users' }).get(ID);
        let currentWeight = 0;
        const items = object;
        // Weight of food
        Object.keys(user.items.food).filter(k => user.items.food[k].amount > 0).forEach((k) => {
            currentWeight = (currentWeight) + (items.food[k].weight * user.items.food[k].amount)
        });
        // Weight of general
        Object.keys(user.items.general).filter(k => user.items.general[k].amount > 0).forEach((k) => {
            currentWeight = (currentWeight) + (items.general[k].weight * user.items.general[k].amount)
        });
        // Weight of drinks
        Object.keys(user.items.drinks).filter(k => user.items.drinks[k].amount > 0).forEach((k) => {
            currentWeight = (currentWeight) + (items.drinks[k].weight * user.items.drinks[k].amount)
        });
        currentWeight = currentWeight.toFixed(2);
        return currentWeight
    },
    deHealth: function(id, number) {
        const db = new Enmap({ name: 'users' });
        //const db = users.findById(id);
        let num = parseInt(db.get(id).body.health);
        //let num = parseInt(db.body.health);
        num = num - number;
        if (num < 0) num = 0;
        db.set(id, num, 'body.health');
        /*db.body.health = num;;
        db.save();*/
        let dead = false;
        if (num == 0) dead = true;
        return dead; // If this returns true, reset user.
    },
    deHunger: function(id, number) {
        const db = new Enmap({ name: 'users' });
        //const db = users.findById(id);
        let num = parseInt(db.get(id).body.hunger);
        //let num = parseInt(db.body.hunger);
        num = num - number;
        if (num < 0) num = 0;
        db.set(id, num, 'body.hunger');
        /*db.body.hunger = num;;
        db.save();*/
        let deHealth = false;
        if (num == 0) deHealth = true;
        return deHealth; // If this returns true, decrease health by 10.
    },
    deThirst: function(id, number) {
        const db = new Enmap({ name: 'users' });
        let num = parseInt(db.get(id).body.thirst);
        num = num - number;
        if (num < 0) num = 0;
        db.set(id, num, 'body.thirst');
        let deHealth = false;
        if (num == 0) deHealth = true;
        return deHealth; // If this returns true, decrease health by 10.
    },
    deFat: function(id, number) {
        const db = new Enmap({ name: 'users' });
        let num = parseInt(db.get(id).body.fat);
        num = num - number;
        if (num < 0) num = 0;
        return db.set(id, num, 'body.fat');
    },
    incHealth: function(id, number, boolean) {
        const db = new Enmap({ name: 'users' });
        if (boolean == true) return db.set(id, 100, 'body.health');
        let num = parseInt(db.get(id).body.health);
        num = num + number;
        if (num > 100) num = 100;
        return db.set(id, num, 'body.health');
    },
    incHunger: function(id, number, boolean) {
        const db = new Enmap({ name: 'users' });
        if (boolean == true) return db.set(id, 100, 'body.hunger');
        let num = parseInt(db.get(id).body.hunger);
        num = num + number;
        if (num > 100) num = 100;
        return db.set(id, num, 'body.hunger');
    },
    incThirst: function(id, number, boolean) {
        const db = new Enmap({ name: 'users' });
        if (boolean == true) return db.set(id, 100, 'body.thirst');
        let num = parseInt(db.get(id).body.thirst);
        num = num + number;
        if (num > 100) num = 100;
        return db.set(id, num, 'body.thirst');
    },
    incFat: function(id, number) {
        const db = new Enmap({ name: 'users' });
        let num = parseInt(db.get(id).body.fat);
        num = num + number;
        if (num > 100) num = 100;
        db.set(id, num, 'body.fat');
        let deHealth = false;
        if (num == 100) deHealth = true;
        return deHealth; // If this returns true, decrease health by 10.
    },
    getKeyByValue: function(object, value, value2) { 
        const key = Object.keys(object).find(key => object[key].id == value);
        if (!value2) return key;
        return object[key][value2];
    },
    hasEnough: function(id, amount) {
        const db = new Enmap({ name: 'users' });
        let hasEnough = false;
        if (parseInt(db.get(id).balance) >= parseInt(amount)) hasEnough = true;
        return hasEnough;
    },
    hasEnoughItems: function(id, type, item, amount) {
        const db = new Enmap({ name: 'users' });
        let hasEnough = false;
        if (parseInt(db.get(id).items[type][item].amount) >= parseInt(amount)) hasEnough = true;
        return hasEnough;
    },
    healthNotify: function(msg, id) {
        const { userDB, embed } = require('./functions.js')
        if (userDB(id).body.health == 50) {
            return embed(msg, "ORANGE", `⚠️ **${msg.guild.member(id).user.username}** please be aware that your health is low go to the doctor soon to avoid dying, if you die you will loose **95%** of your balance and your vehicle, property and job.`);
        } else if (userDB(id).body.health == 20) {
            return embed(msg, "RED", `❗ **${msg.guild.member(id).user.username}** your health is extremely low, please visit the doctor before doing anything else again, if you die you will loose **95%** of your balance and your vehicle, property and job!`);
        } else {
            return;
        }
    },
    deathNotify: function(msg, id) {
        const { userDB, embed } = require('./functions.js')
        return embed(msg, "BLACK", `☠️ **${msg.guild.member(id).user.username}** you died, you lost **95%** of your balance and your vehicle, property and job.`);
    }
};
