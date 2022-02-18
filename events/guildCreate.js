const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const Enmap = require('enmap');

module.exports = async (client, guild) => {
  new Enmap({ name: 'guildSettings' }).ensure(guild.id, {prefix: ')'});
  const chan = client.channels.cache.get('716252308861747232');
  const em = new MessageEmbed()
  .setColor("GREEN")
  .setThumbnail(guild.iconURL({ format: 'png', dynamic: true }))
  .setTitle(guild.name)
  .addField("Created At", moment(guild.createdAt).format('LLL'))
  .addField("Member Count", guild.memberCount.toLocaleString())
  .addField("Bot Guilds Count", client.guilds.cache.size.toLocaleString())
  .addField("Status", 'Added');
  return chan.send(em);
}