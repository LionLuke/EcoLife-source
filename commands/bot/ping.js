module.exports = {
  name: 'ping',
  category: 'Bot',
  permLevel: '0',
  perm: 'User',
  usage: '',
  description: 'Pong',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    const e1 = new MessageEmbed()
      .setTitle('Pinging...')
      .setColor('GREEN')
      .setDescription(`Pinging...`)
      .setFooter(msg.author.username, msg.author.avatarURL())
    const msgSemt = await msg.channel.send(e1);
    const e2 = new MessageEmbed()
      .setTitle(':ping_pong: Pong!')
      .setColor('GREEN')
      .setDescription(`Latency is ${msgSemt.createdTimestamp - msg.createdTimestamp}ms.\nAPI Latency is ${Math.round(client.ws.ping)}ms`)
      .setFooter(msg.author.username, msg.author.avatarURL())
    msgSemt.edit(e2);
  }
}