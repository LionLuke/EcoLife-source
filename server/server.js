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
        client.guilds.cache.get('713751729291919383').channels.cache.get('725781948244557894').send(`<@${req.body.user}> has justed voted for us on top.gg. Thank you for your support! We have given you a **${randomPet.name.toProperCase()}** for your support.`);
        const embed = new Discord.MessageEmbed()
            .setTitle("Thanks for supporting me on top.gg!")
            .setDescription(`Want more of these rewards? Try voting on these other places too!\n\n[botlist.me](https://botlist.me/bots/<your bot id here>/vote)\n[discord.boats](https://discord.boats/bot/<your bot id here>/vote)\n[voidbots.net](https://voidbots.net/bot/<your bot id here>/vote)\n\n${client.guilds.cache.get('713751729291919383').members.cache.has(req.body.user) ? '' : 'I noticed that you are not currently in my support server, please join to stay updated to my latest changes. [discord.gg/KRCpWfJ](https://discord.gg/KRCpWfJ)'}`)
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
