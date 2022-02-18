const { embed, userDB, exec, ensure, deHunger, deHealth, deThirst, deathNotify, healthNotify, incHealth, incHunger, incThirst, set } = require('../../handler/functions.js');
const Enmap = require('enmap');
const moment = require('moment');

module.exports = {
    name: 'jobcenter',
    category: 'General',
    permLevel: '0',
    aliases: ['job', 'jc'],
    perm: 'User',
    usage: '<view/resign/apply/buy> <job name>',
    description: 'View, resign or apply for a job (\'[prefix]job view all\' to view all available jobs. \'[prefix]job view <job name>\' to see the price of a job)',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        await ensure(msg.author.id);
        const jobs = client.economy.get('jobs');
        const budget = parseInt(userDB(msg.author.id).balance);
        const currentJob = userDB(msg.author.id).job;
        const action = args[0];
        const jobName = args.join(' ').replace(args[0], '').trim().replace(/ /g, '_').toLowerCase();
        if (action == 'view') {
            if (!jobs[jobName]) {
                const jobs2 = Object.keys(jobs);
                const em = new MessageEmbed()
                .setTitle("Jobs")
                .setThumbnail(client.user.displayAvatarURL({format:'png'}))
                .setColor("BLUE")
                .setDescription('**' + '- ' + jobs2.join('\n- ').replace(/_/g, ' ') + '**')
                .setFooter(`Requested by: ${msg.author.username} (${msg.author.id}), '${prefix}job view <job name>' for more info`);
                return msg.channel.send(em).catch(em => em);
            } else {
                const em = new MessageEmbed()
                .setTitle(jobName.replace(/_/g, ' ').toProperCase())
                .setThumbnail(client.user.displayAvatarURL({format:'png'}))
                .setColor("BLUE")
                .addField("Vehicle Req.", jobs[jobName].vehicleReg)
                .addField("Property Req.", jobs[jobName].propertyReg);
                if (jobs[jobName].rebirthLevelReg) em.addField("Rebirth Level Req.", jobs[jobName].rebirthLevelReg);
                em.addField("Payout Min.", `$${jobs[jobName].payout.min.stringify(msg)}`);
                em.addField("Payout Max.", `$${jobs[jobName].payout.max.stringify(msg)}`);
                em.setFooter(`Requested by: ${msg.author.username} (${msg.author.id})`);
                return msg.channel.send(em).catch(em => em);
            }
        } else if (action == 'resign') {
            if (!currentJob) return embed(msg, 'RED', 'You do not have a job to resign from!');
            if (currentJob == 'unemployed') return embed(msg, 'RED', 'You do not have a job to resign from!');
            const curJob = currentJob.replace(/ /g, '_');
            if (!jobs[curJob]) return embed(msg, 'RED', 'Something went wrong, please contact one of the developers!');
            set(msg.author.id, 'unemployed', 'job');
            const em = new MessageEmbed()
            .setTitle("Job Center")
            .setThumbnail(client.user.displayAvatarURL({format:'png'}))
            .setColor("BLUE")
            .setDescription(`You have successfully resigned from your job.`)
            .setFooter(`Requested by: ${msg.author.username} (${msg.author.id})`);
            return msg.channel.send(em).catch(em => em);
        } else if (action == 'apply') {
            if (currentJob != 'unemployed') return embed(msg, 'RED', `You already have a job, please resign from it first using '${prefix}job resign'!`);
            if (!jobs[jobName]) return embed(msg, 'RED', `Please select a valid job to apply for, check out '${prefix}job view' for a list of jobs!`);
            const vehReq = jobs[jobName].vehicleReg;
            const propReq = jobs[jobName].propertyReg;
            const curVeh = userDB(msg.author.id).vehicle;
            const curProp = userDB(msg.author.id).property;
            if (Object.keys(jobs).indexOf(Object.keys(jobs).find(job => jobs[job].vehicleReg == curVeh)) < Object.keys(jobs).indexOf(Object.keys(jobs).find(job => jobs[job].vehicleReg == vehReq))) return embed(msg, 'RED', `You require at least the vehicle: **${jobs[jobName].vehicleReg.toProperCase()}** to apply for this job, buy it by doing \`${prefix}dealer buy ${jobs[jobName].vehicleReg}\`!`);
            if (Object.keys(jobs).indexOf(Object.keys(jobs).find(job => jobs[job].propertyReg == curProp)) < Object.keys(jobs).indexOf(Object.keys(jobs).find(job => jobs[job].propertyReg == propReq))) return embed(msg, 'RED', `You require at least the property: **${jobs[jobName].propertyReg.toProperCase()}** to apply for this job, buy it by doing \`${prefix}restate buy ${jobs[jobName].propertyReg}\`!`);
            if (jobs[jobName].rebirthLevelReg && userDB(msg.author.id).rebirth_level - 1 < jobs[jobName].rebirthLevelReg) return embed(msg, 'RED', `You need at least rebirth level **${jobs[jobName].rebirthLevelReg}** in order to apply for this job, check out **\`${prefix}rebirth\`** for more information!`);
            set(msg.author.id, jobName.replace(/_/g, ' '), 'job');
            const em = new MessageEmbed()
            .setTitle("Job Center")
            .setThumbnail(client.user.displayAvatarURL({format:'png'}))
            .setColor("BLUE")
            .setDescription(`You have successfully applied for **${jobName.replace(/_/g, ' ')}** and got the job, congratulations!`)
            .setFooter(`Requested by: ${msg.author.username} (${msg.author.id})`);
            return msg.channel.send(em).catch(em => em);
        } else if (action == 'buy') {
            if (!jobs[jobName]) return embed(msg, 'RED', `Please select a valid job to purchase the requirements for, check out '${prefix}job view' for a list of jobs!`);
            if (userDB(msg.author.id).property != 'homeless') return embed(msg, 'RED', `You already own a property, please sell it first using '${prefix}restate sell'!`);
            if (userDB(msg.author.id).vehicle != 'none') return embed(msg, 'RED', `You already own a vehicle, please sell it first using '${prefix}dealer sell'!`);
            const vehReq = jobs[jobName].vehicleReg;
            const propReq = jobs[jobName].propertyReg;
            const curVeh = userDB(msg.author.id).vehicle;
            const curProp = userDB(msg.author.id).property;
            const requiredAmount = client.economy.get('vehicles')[vehReq.replace(/ /g, '_')].price + client.economy.get('properties')[propReq.replace(/ /g, '_')].price;
            if (userDB(msg.author.id).balance < requiredAmount) return embed(msg, 'RED', `You need at least **$${requiredAmount.stringify(msg)}** to purchase the requirements for this job!`);
            set(msg.author.id, vehReq, 'vehicle');
            set(msg.author.id, propReq, 'property');
            const newBal = userDB(msg.author.id).balance - requiredAmount;
            set(msg.author.id, newBal, 'balance');
            const em = new MessageEmbed()
            .setTitle("Job Center")
            .setThumbnail(client.user.displayAvatarURL({format:'png'}))
            .setColor("BLUE")
            .setDescription(`You have successfully purchased all the requirements for **${jobName.replace(/_/g, ' ')}** for **$${requiredAmount.stringify(msg)}**. You can now apply for the job by doing **\`${prefix}job apply ${jobName.replace(/_/g, ' ')}\`**!`)
            .setFooter(`Requested by: ${msg.author.username} (${msg.author.id})`);
            return msg.channel.send(em).catch(em => em);
        } else {
            return embed(msg, 'RED', 'Please select one of the following options: view/resign/apply/buy');
        }
    }
}
