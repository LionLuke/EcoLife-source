const { embed, userDB, exec, ensure, deHunger, deHealth, deThirst, deathNotify, healthNotify, incHealth, incHunger, incThirst, set } = require('../../handler/functions.js');
const Enmap = require('enmap');
const moment = require('moment');

module.exports = {
    name: 'give',
    category: 'General',
    permLevel: '0',
    aliases: ['g', 'pay', 'hand'],
    perm: 'User',
    usage: '<user> <amount>',
    cooldown: 600000,
    description: 'Give a person some money, max $15,000/10 mins',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        const give = client.economy.get('give');
        const previous = parseInt(userDB(msg.author.id).cooldowns.give) || 0;
        let cd = (parseInt(give.cooldown) - (Date.now() - previous))
        if (previous !== null && previous !== undefined && cd > 0) {
            return embed(msg, 'RED', `Please wait another **${moment.duration(cd).format('d [days], h [hours], m [minutes] [and] s [seconds]')}** before giving away money again.`)
        } if ((parseInt(give.cooldown) - (Date.now() - previous)) <= 0) {
            let user = msg.mentions.members.first() || msg.guild.member(args[0]);
            let amount = args[1];
            if (amount) amount = String(amount).intify();
            if (!user) return embed(msg, 'RED', 'Please insert a member mention or ID!');
            user = user.user;
            if (user.id == msg.author.id) return embed(msg, 'RED', 'You may not hand money to yourself!');
            if (user.bot) return embed(msg, 'RED', 'You may not hand money to bots!');
            await ensure(user.id);
            if (!amount) return embed(msg, 'RED', 'Please insert the amount of money you want to give to this person!');
            if (!/^[0-9]+$/.test(amount)) return embed(msg, 'RED', 'Your amount input may only include numbers!');
            if (parseInt(amount) > 30000) return embed(msg, 'RED', 'You may only hand out $30,000 at once!');
            const myBal = parseInt(userDB(msg.author.id).balance);
            const yourBal = parseInt(userDB(user.id).balance);
            if (myBal < parseInt(amount)) return embed(msg, 'RED', 'You cannot hand out what you don\'t have!');
            const myNewBal = parseInt(userDB(msg.author.id).balance) - parseInt(amount);
            const yourNewBal = parseInt(userDB(user.id).balance) + parseInt(amount);
            set(msg.author.id, myNewBal, 'balance');
            set(user.id, yourNewBal, 'balance');
            const em = new MessageEmbed()
            .setColor("BLUE")
            .setTitle("Give")
            .setThumbnail(client.user.displayAvatarURL({ format: 'png' }))
            .setDescription(`You handed **${user.username}** \`$${parseInt(amount).stringify(msg)}\` of your own hard earned money, how nice of you!`)
            .addField("Your New Balance", '$' + parseInt(userDB(msg.author.id).balance).stringify(msg))
            .addField(`${user.username}'s New Balance`, '$' + parseInt(userDB(user.id).balance).stringify(msg));
            msg.channel.send(em);
            return set(msg.author.id, Date.now(), 'cooldowns.give'); 
        }
    }
}