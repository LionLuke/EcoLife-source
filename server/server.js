module.exports = function(client) {
    const express = require("express");
    const bodyParser = require("body-parser");
    const { userDB, ensure } = require('../handler/functions.js');
    const Enmap = require('enmap');
    const Discord = require('discord.js');
    const config = require('../config.json');
    const app = express();
    const PORT = 3030;
    const fetch = require("node-fetch");


    // Post stats on voidbots.net
    fetch(`https://api.voidbots.net/bot/stats/831223886300315700`, {
    method: "POST",
    headers: { 
      Authorization: config.voidapitoken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({"server_count": client.guilds.cache.size, "shard_count": 0 })
    }).then(response => response.text())
    .then(console.log).catch(console.error);


    app.use(bodyParser.json());

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

    app.post("/dblwebhook", async (req, res) => {
        /*
            Rarity Chart
            -- Math.floor(Math.random() * 101) --
            common: 0 - 0 -- 60 ; 60%
            uncommon: 1 - 60 -- 80 ; 20%
            rare: 2 - 80 -- 90 ; 10%
            epic: 3 - 90 -- 95 ; 5%
            legendary: 4 - 95 -- 99 ; 4%
            mythic: 5 - 99 -- 100 ; 1%
        */
        
        // Find out what type of pet to get.
        const randomNum = Math.floor(Math.random() * 101);
        let rarityCheck;
        randomNum >= 0 && randomNum < 60 ? rarityCheck = 0 : 
        randomNum >= 60 && randomNum < 80 ? rarityCheck = 1 : 
        randomNum >= 80 && randomNum < 90 ? rarityCheck = 2 : 
        randomNum >= 90 && randomNum < 95 ? rarityCheck = 3 : 
        randomNum >= 95 && randomNum <= 99 ? rarityCheck = 4 : 
        randomNum > 99 && randomNum <= 100 ? rarityCheck = 5 : 
        rarityCheck = 0;

        // Filter out pets that do not math type.
        const pets = client.economy.get('pets');
        let filteredPets = [];
        Object.keys(pets).forEach((key) => {
            pets[key].rarity == rarityCheck ? filteredPets.push(pets[key]) : false;
        })

        // Generate a random pet.
        const randomPet = filteredPets[Math.floor(Math.random() * filteredPets.length)];

        if (req.header('Authorization') != config.apitoken) {
            return res.status('401').end();
        }
        // await client.guilds.cache.get('713751729291919383').members.fetch(req.body.user.id);
        client.guilds.cache.get('713751729291919383').channels.cache.get('725781948244557894').send(`<@${req.body.user}> has justed voted for us on top.gg. Thank you for your support! We have given you a **${randomPet.name.toProperCase()}** for your support.`);
        const embed = new Discord.MessageEmbed()
            .setTitle("Thanks for supporting me on top.gg!")
            .setDescription(`Want more of these rewards? Try voting on these other places too!\n\n[botlist.me](https://botlist.me/bots/713087534837530745/vote)\n[discord.boats](https://discord.boats/bot/713087534837530745/vote)\n[voidbots.net](https://voidbots.net/bot/ecolife/vote)\n\n${client.guilds.cache.get('713751729291919383').members.cache.has(req.body.user) ? '' : 'I noticed that you are not currently in my support server, please join to stay updated to my latest changes. [discord.gg/KRCpWfJ](https://discord.gg/KRCpWfJ)'}`)
            .addField("Pet", randomPet.name.toProperCase(), true)
            .setThumbnail("https://top.gg/images/dblnew.png")
            .setColor("BLUE")
        client.users.cache.get(req.body.user) ? client.users.cache.get(req.body.user).send(embed).catch(err => console.log(`No permission to dm user with id ${req.body.user}`)) : console.log(`User with the id ${req.body.user} is not cached`);
        ensure(req.body.user);
        new Enmap({
            name: 'users'
        }).set(req.body.user, {name: randomPet.name, multiplier: randomPet.multiplier, value: randomPet.value}, `items.pets.${randomPet.name}`);
        res.status(200).end()
    });

    app.post("/dboatswebhook", async (req, res) => {
        /*
            Rarity Chart
            -- Math.floor(Math.random() * 101) --
            common: 0 - 0 -- 60 ; 60%
            uncommon: 1 - 60 -- 80 ; 20%
            rare: 2 - 80 -- 90 ; 10%
            epic: 3 - 90 -- 95 ; 5%
            legendary: 4 - 95 -- 99 ; 4%
            mythic: 5 - 99 -- 100 ; 1%
        */
        
        // Find out what type of pet to get.
        const randomNum = Math.floor(Math.random() * 101);
        let rarityCheck;
        randomNum >= 0 && randomNum < 60 ? rarityCheck = 0 : 
        randomNum >= 60 && randomNum < 80 ? rarityCheck = 1 : 
        randomNum >= 80 && randomNum < 90 ? rarityCheck = 2 : 
        randomNum >= 90 && randomNum < 95 ? rarityCheck = 3 : 
        randomNum >= 95 && randomNum <= 99 ? rarityCheck = 4 : 
        randomNum > 99 && randomNum <= 100 ? rarityCheck = 5 : 
        rarityCheck = 0;

        // Filter out pets that do not math type.
        const pets = client.economy.get('pets');
        let filteredPets = [];
        Object.keys(pets).forEach((key) => {
            pets[key].rarity == rarityCheck ? filteredPets.push(pets[key]) : false;
        })

        // Generate a random pet.
        const randomPet = filteredPets[Math.floor(Math.random() * filteredPets.length)];

        if (req.header('Authorization') != config.apitoken) {
            return res.status('401').end();
        }
        // await client.guilds.cache.get('713751729291919383').members.fetch(req.body.user.id);
        client.guilds.cache.get('713751729291919383').channels.cache.get('725781948244557894').send(`<@${req.body.user.id}> has justed voted for us on discord.boats. Thank you for your support! We have given you a **${randomPet.name.toProperCase()}** for your support.`);
        const embed = new Discord.MessageEmbed()
            .setTitle("Thanks for supporting me on discord.boats!")
            .setDescription(`Want more of these rewards? Try voting on these other places too!\n\n[botlist.me](https://botlist.me/bots/713087534837530745/vote)\n[top.gg](https://top.gg/bot/713087534837530745/vote)\n[voidbots.net](https://voidbots.net/bot/ecolife/vote)\n\n${client.guilds.cache.get('713751729291919383').members.cache.has(req.body.user.id) ? '' : 'I noticed that you are not currently in my support server, please join to stay updated to my latest changes. [discord.gg/KRCpWfJ](https://discord.gg/KRCpWfJ)'}`)
            .addField("Pet", randomPet.name.toProperCase(), true)
            .setThumbnail("https://discord.boats/logo.png")
            .setColor("BLUE")
        client.users.cache.get(req.body.user.id) ? client.users.cache.get(req.body.user.id).send(embed).catch(err => console.log(`No permission to dm user with id ${req.body.user}`)) : console.log(`User with the id ${req.body.user.id} is not cached`);
        ensure(req.body.user.id);
        new Enmap({
            name: 'users'
        }).set(req.body.user.id, {name: randomPet.name, multiplier: randomPet.multiplier, value: randomPet.value}, `items.pets.${randomPet.name}`);
        res.status(200).end()
    });

    app.post("/botlistmewebhook", async (req, res) => {
        /*
            Rarity Chart
            -- Math.floor(Math.random() * 101) --
            common: 0 - 0 -- 60 ; 60%
            uncommon: 1 - 60 -- 80 ; 20%
            rare: 2 - 80 -- 90 ; 10%
            epic: 3 - 90 -- 95 ; 5%
            legendary: 4 - 95 -- 99 ; 4%
            mythic: 5 - 99 -- 100 ; 1%
        */
        
        // Find out what type of pet to get.
        const randomNum = Math.floor(Math.random() * 101);
        let rarityCheck;
        randomNum >= 0 && randomNum < 60 ? rarityCheck = 0 : 
        randomNum >= 60 && randomNum < 80 ? rarityCheck = 1 : 
        randomNum >= 80 && randomNum < 90 ? rarityCheck = 2 : 
        randomNum >= 90 && randomNum < 95 ? rarityCheck = 3 : 
        randomNum >= 95 && randomNum <= 99 ? rarityCheck = 4 : 
        randomNum > 99 && randomNum <= 100 ? rarityCheck = 5 : 
        rarityCheck = 0;

        // Filter out pets that do not math type.
        const pets = client.economy.get('pets');
        let filteredPets = [];
        Object.keys(pets).forEach((key) => {
            pets[key].rarity == rarityCheck ? filteredPets.push(pets[key]) : false;
        })

        // Generate a random pet.
        const randomPet = filteredPets[Math.floor(Math.random() * filteredPets.length)];

        if (req.header('Authorization') != config.apitoken) {
            return res.status('401').end();
        }
        // await client.guilds.cache.get('713751729291919383').members.fetch(req.body.user.id);
        client.guilds.cache.get('713751729291919383').channels.cache.get('725781948244557894').send(`<@${req.body.user}> has justed voted for us on botlist.me. Thank you for your support! We have given you a **${randomPet.name.toProperCase()}** for your support.`);
        const embed = new Discord.MessageEmbed()
            .setTitle("Thanks for supporting me on botlist.me!")
            .setDescription(`Want more of these rewards? Try voting on this other place too!\n\n[voidbots.net](https://voidbots.net/bot/831223886300315700/vote)\n\n${client.guilds.cache.get('713751729291919383').members.cache.has(req.body.user) ? '' : 'I noticed that you are not currently in my support server, please join to stay updated to my latest changes. [discord.gg/KRCpWfJ](https://discord.gg/KRCpWfJ)'}`)
            .addField("Pet", randomPet.name.toProperCase(), true)
            .setThumbnail("https://botlist.me/icon.png")
            .setColor("BLUE")
        client.users.cache.get(req.body.user) ? client.users.cache.get(req.body.user).send(embed).catch(err => console.log(`No permission to dm user with id ${req.body.user}`)) : console.log(`User with the id ${req.body.user} is not cached`);
        ensure(req.body.user);
        new Enmap({
            name: 'users'
        }).set(req.body.user, {name: randomPet.name, multiplier: randomPet.multiplier, value: randomPet.value}, `items.pets.${randomPet.name}`);;
        res.status(200).end()
    });

    app.post("/vbotswebhook", async (req, res) => {
        /*
            Rarity Chart
            -- Math.floor(Math.random() * 101) --
            common: 0 - 0 -- 60 ; 60%
            uncommon: 1 - 60 -- 80 ; 20%
            rare: 2 - 80 -- 90 ; 10%
            epic: 3 - 90 -- 95 ; 5%
            legendary: 4 - 95 -- 99 ; 4%
            mythic: 5 - 99 -- 100 ; 1%
        */
        
        // Find out what type of pet to get.
        const randomNum = Math.floor(Math.random() * 101);
        let rarityCheck;
        randomNum >= 0 && randomNum < 60 ? rarityCheck = 0 : 
        randomNum >= 60 && randomNum < 80 ? rarityCheck = 1 : 
        randomNum >= 80 && randomNum < 90 ? rarityCheck = 2 : 
        randomNum >= 90 && randomNum < 95 ? rarityCheck = 3 : 
        randomNum >= 95 && randomNum <= 99 ? rarityCheck = 4 : 
        randomNum > 99 && randomNum <= 100 ? rarityCheck = 5 : 
        rarityCheck = 0;

        // Filter out pets that do not match type.
        const pets = client.economy.get('pets');
        let filteredPets = [];
        Object.keys(pets).forEach((key) => {
            pets[key].rarity == rarityCheck ? filteredPets.push(pets[key]) : false;
        })

        // Generate a random pet.
        const randomPet = filteredPets[Math.floor(Math.random() * filteredPets.length)];

        if (req.header('Authorization') != config.apitoken) {
            return res.status('401').end();
        }
        // await client.guilds.cache.get('713751729291919383').members.fetch(req.body.user.id);
        client.guilds.cache.get('713751729291919383').channels.cache.get('725781948244557894').send(`<@${req.body.user}> has justed voted for us on voidbots.net. Thank you for your support! We have given you a **${randomPet.name.toProperCase()}** for your support.`);
        const embed = new Discord.MessageEmbed()
            .setTitle("Thanks for supporting me on voidbots.net!")
            .setDescription(`Want more of these rewards? Try voting on this other place too!\n\n[botlist.me](https://botlist.me/bots/831223886300315700/vote)\n\n${client.guilds.cache.get('713751729291919383').members.cache.has(req.body.user) ? '' : 'I noticed that you are not currently in my support server, please join to stay updated to my latest changes. [discord.gg/KRCpWfJ](https://discord.gg/KRCpWfJ)'}`)
            .addField("Pet", randomPet.name.toProperCase(), true)
            .setThumbnail("https://discord.mx/oFg5Gszrcl.png")
            .setColor("BLUE")
        client.users.cache.get(req.body.user) ? client.users.cache.get(req.body.user).send(embed).catch(err => console.log(`No permission to dm user with id ${req.body.user}`)) : console.log(`User with the id ${req.body.user} is not cached`);
        ensure(req.body.user);
        new Enmap({
            name: 'users'
        }).set(req.body.user, {name: randomPet.name, multiplier: randomPet.multiplier, value: randomPet.value}, `items.pets.${randomPet.name}`);;
        res.status(200).end()
    });