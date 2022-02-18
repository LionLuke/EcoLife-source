const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = async (client, guild) => {
  const chan = client.channels.cache.get('726870923000545411');
  const em = new MessageEmbed()
  .setColor("RED")
  .setThumbnail(guild.iconURL({ format: 'png', dynamic: true }))
  .setTitle(guild.name)
  .addField("Owner", `${guild.owner.user.tag} \`(${guild.owner.user.id})\``)
  .addField("Created At", moment(guild.createdAt).format('LLL'))
  .addField("Member Count", guild.memberCount.toLocaleString())
  .addField("Bot Guilds Count", client.guilds.cache.size.toLocaleString())
  .addField("Status", 'Removed');
  return chan.send(em);
}