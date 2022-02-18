const { embed, userDB, exec, ensure, incHealth, set } = require('../../handler/functions.js');
const Enmap = require('enmap');
const moment = require('moment');
const ms = require('parse-ms');

module.exports = {
    name: 'doctor',
    category: 'General',
    permLevel: '0',
    perm: 'User',
    usage: '<cheap($500/+20H)/regular($1,000/+50H)/expensive($2,000/+80H)>',
    cooldown: 3600000,
    description: 'Go to the doctor and get treated',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        const previous = parseInt(userDB(msg.author.id).cooldowns.doctor);
        let cd = (3600000 - (Date.now() - previous))
        if (previous !== null && previous !== undefined && cd > 0) {
            return embed(msg, 'RED', `Please wait **${moment.duration(cd).format('d [days], h [hours], m [minutes] [and] s [seconds]')}** before going to the doctor again, the doctor is treating other patients now.`)
        } if ((3600000 - (Date.now() - previous)) <= 0) {
        const type = args[0];
        if (!type) return embed(msg, 'RED', 'Please specify a doctor to go to. Doctors: cheap/regular/expensive.');
            if (type.toLowerCase() == 'cheap') {
                if (parseInt(userDB(msg.author.id).balance) < 500) return embed(msg, 'RED', 'You are unable to pay for this doctor.');
                const newBal = parseInt(userDB(msg.author.id).balance) - 500;
                incHealth(msg.author.id, 20, false);
                set(msg.author.id, newBal, 'balance');
                set(msg.author.id, Date.now(), 'cooldowns.doctor');
                return embed(msg, 'GREEN', `You succesfully went to the **${type.toProperCase()}** doctor for **$500**. You have regained **20** health.`);
            } else if (type.toLowerCase() == 'regular') {
                if (parseInt(userDB(msg.author.id).balance) < 1000) return embed(msg, 'RED', 'You are unable to pay for this doctor.');
                const newBal = parseInt(userDB(msg.author.id).balance) - 1000;
                incHealth(msg.author.id, 50, false);
                set(msg.author.id, newBal, 'balance');
                set(msg.author.id, Date.now(), 'cooldowns.doctor');
                return embed(msg, 'GREEN', `You succesfully went to the **${type.toProperCase()}** doctor for **$1,000**. You have regained **50** health.`);
            } else if (type.toLowerCase() == 'expensive') {
                if (parseInt(userDB(msg.author.id).balance) < 2000) return embed(msg, 'RED', 'You are unable to pay for this doctor.');
                const newBal = parseInt(userDB(msg.author.id).balance) - 2000;
                incHealth(msg.author.id, 80, false);
                set(msg.author.id, newBal, 'balance');
                set(msg.author.id, Date.now(), 'cooldowns.doctor');
                return embed(msg, 'GREEN', `You succesfully went to the **${type.toProperCase()}** doctor for **$2,000**. You have regained **80** health.`);
            } else {
                return embed(msg, 'RED', 'Please specify a doctor to go to. Doctors: cheap/regular/expensive.');
            }
        }
    }
}