const { embed, userDB, exec, ensure, set } = require('../../handler/functions.js');
const Enmap = require('enmap');
const moment = require('moment');

module.exports = {
    name: 'rob',
    category: 'General',
    permLevel: '0',
    aliases: ['steal'],
    perm: 'User',
    usage: '<@mention/ID>',
    cooldown: 1800000,
    description: 'Steal money from someone',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        const previous = parseInt(userDB(msg.author.id).cooldowns.rob);
        let cd = (1800000 - (Date.now() - previous))
        if (previous !== null && previous !== undefined && cd > 0) {
            return embed(msg, 'RED', `Please wait **${moment.duration(cd).format('d [days], h [hours], m [minutes] [and] s [seconds]')}** before stealing money from someone again.`)
        } if ((1800000 - (Date.now() - previous)) <= 0) {
            const user = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]);
            if (!user) return embed(msg, 'RED', 'You need to insert someone to steal money from!')
            if (user.user.bot) return embed(msg, 'RED', 'You can\'t steal money from bots!');
            await ensure(user.id);
            await ensure(msg.author.id);
            const passiveMode = userDB(user.id).passiveMode;
            const passiveMode2 = userDB(msg.author.id).passiveMode;
            if (passiveMode) return embed(msg, 'RED', 'The user you are trying to steal money from has passive mode enabled, you may not steal money from them at the moment.');
            if (passiveMode2) return embed(msg, 'RED', 'You have passive mode enabled, disable this to be able to steal money from other players again.');
            const myBal = parseInt(userDB(msg.author.id).balance);
            const otherBal = parseInt(userDB(user.id).balance);
            if (myBal < 500) return embed(msg, 'RED', 'You need to have at least $500 to be able to steal money from other people!');
            let outcome = 'success';
            const randomNum = Math.ceil(Math.random() * 100) + 1;
            const randomStealNum = Math.ceil(Math.random() * 1000) + 1;
            const randomFineNum = Math.ceil(Math.random() * 500) + 1;
            if (myBal > otherBal) outcome = 'karma';
            if (otherBal <= 0) outcome = 'karma';
            if (msg.author.id == user.id) outcome = 'drunk';
            if (randomNum <= 10) outcome = 'fail';
            if (outcome == 'success') {
                const em = new MessageEmbed()
                .setColor("BLUE")
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
                .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true }))
                .setDescription(`You successfully stole **$${randomStealNum.stringify(msg)}** from **${user.user.username}**.`)
                .addField("Your New Balance", `$${(myBal + randomStealNum).stringify(msg)}`)
                .addField(`${user.user.username}'s New Balance`, `$${(otherBal - randomStealNum).stringify(msg)}`);
                msg.channel.send(em);
                set(msg.author.id, (myBal + randomStealNum), 'balance');
                set(user.id, (otherBal - randomStealNum), 'balance');
            } else if (outcome == 'karma') {
                const em = new MessageEmbed()
                .setColor("BLUE")
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
                .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true }))
                .setDescription(`It's not nice of you to try to steal from someone that has less money than yourself!\nNow give **${user.user.username}** some of your money instead. \nYou gave **$${randomStealNum.stringify(msg)}**, how nice of you!`)
                .addField("Your New Balance", `$${(myBal - randomStealNum).stringify(msg)}`)
                .addField(`${user.user.username}'s New Balance`, `$${(otherBal + randomStealNum).stringify(msg)}`);
                msg.channel.send(em);
                set(msg.author.id, (myBal - randomStealNum), 'balance');
                set(user.id, (otherBal + randomStealNum), 'balance');
            } else if (outcome == 'fail') {
                const em = new MessageEmbed()
                .setColor("BLUE")
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
                .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true }))
                .setDescription(`A cop caught you trying to steal money from **${user.user.username}**!\nHe fined you for **$${randomFineNum.stringify(msg)}**`)
                .addField("Your New Balance", `$${(myBal - randomFineNum).stringify(msg)}`);
                msg.channel.send(em);
                set(msg.author.id, (myBal - randomFineNum), 'balance');
            } else if (outcome == 'drunk') {
                const em = new MessageEmbed()
                .setColor("BLUE")
                .setAuthor(msg.author.username, msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
                .setThumbnail(client.user.displayAvatarURL({ format: 'png', dynamic: true }))
                .setDescription(`You were drunk from partying all night and tried to rob money from yourself, you somehow lost it as well... You lost **$${randomFineNum.stringify(msg)}**`)
                .addField("Your New Balance", `$${(myBal - randomFineNum).stringify(msg)}`);
                msg.channel.send(em);
                set(msg.author.id, (myBal - randomFineNum), 'balance');
            }
            return set(msg.author.id, Date.now(), 'cooldowns.rob');
        }
    }
}