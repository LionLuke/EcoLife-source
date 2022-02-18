const { embed, userDB, exec, ensure, set } = require('../../handler/functions.js');
const Enmap = require('enmap');
const moment = require('moment');
const ms = require('parse-ms');

module.exports = {
    name: 'daily',
    category: 'General',
    permLevel: '0',
    perm: 'User',
    usage: '',
    cooldown: 86400000,
    description: 'Collect your daily reward',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        const previous = parseInt(userDB(msg.author.id).cooldowns.daily);
        let cd = (86400000 - (Date.now() - previous))
        if (previous !== null && previous !== undefined && cd > 0) {
            return embed(msg, 'RED', `Please wait **${moment.duration(cd).format('d [days], h [hours], m [minutes] [and] s [seconds]')}** more before being payed by the government again.`)
        } if ((86400000 - (Date.now() - previous)) <= 0) {
            let mult = 0;
            if (Object.keys(userDB(msg.author.id).items.pets).length > 0) {
                Object.keys(userDB(msg.author.id).items.pets).forEach((key) => {
                    mult = mult + userDB(msg.author.id).items.pets[key].multiplier;
                })
            }
            if (userDB(msg.author.id).multiplier !== 0) mult = mult + userDB(msg.author.id).multiplier;
            const payout = Math.floor(1000) + Math.floor(1000 * mult);
            const newBal = parseInt(userDB(msg.author.id).balance) + payout;
            const em = new MessageEmbed()
                .setColor('BLUE')
                .setTitle("Daily")
                .setThumbnail(client.user.displayAvatarURL({
                    format: 'png',
                    dynamic: true
                }))
                .setDescription(`You got your daily payment from the government. +$${payout.stringify(msg)}`);
            msg.channel.send(em);
            set(msg.author.id, newBal, 'balance');
            return set(msg.author.id, Date.now(), 'cooldowns.daily'); 
        }
    }
}