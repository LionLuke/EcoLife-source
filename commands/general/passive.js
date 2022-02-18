const { embed, userDB, exec, ensure, set } = require('../../handler/functions.js');
const Enmap = require('enmap');
const moment = require('moment');

module.exports = {
    name: 'passive',
    category: 'General',
    permLevel: '0',
    aliases: ['pm'],
    perm: 'User',
    usage: '',
    cooldown: 1800000,
    description: 'Toggle passive mode on or off',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        const previous = parseInt(userDB(msg.author.id).cooldowns.rob);
        let cd = (1800000 - (Date.now() - previous))
        if (previous !== null && previous !== undefined && cd > 0) {
            return embed(msg, 'RED', `Please wait **${moment.duration(cd).format('d [days], h [hours], m [minutes] [and] s [seconds]')}** before enabling passive mode again.`)
        } if ((1800000 - (Date.now() - previous)) <= 0) {
            await ensure(msg.author.id);
            const passiveMode = userDB(msg.author.id).passiveMode;
            if (passiveMode) {
                embed(msg, 'GREEN', 'You toggled passive mode `off`, watch out cause you could be robbed by other players!');
                return set(msg.author.id, false, 'passiveMode');
            }
            if (!passiveMode) {
                embed(msg, 'GREEN', 'You toggled passive mode `on`, you are now safe from being robbed by other players!');
                return set(msg.author.id, true, 'passiveMode');
            }
        }
    }
}