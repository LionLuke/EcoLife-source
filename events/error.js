const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = async (client, err) => {
  console.error(`[${moment().format("DD/MM/YYYY HH:mm:ss")}]: An error event was sent by Discord.js: \n ${JSON.stringify(err)}`);
}