const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'partners',
  category: 'Bot',
  permLevel: '0',
  perm: 'User',
  aliases: [],
  usage: '',
  description: 'Shows all partners of the bot',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    const em = new MessageEmbed()
      .setTitle("Partners")
      .setColor("BLUE")
      .setThumbnail(client.user.displayAvatarURL({format:'png'}))
      .addField("**Sniped! [bot]**", "[Invite The Bot](https://discord.com/oauth2/authorize?client_id=736917584439410688&scope=bot&permissions=8)")
      .addField("**Aerex [bot]**", "[Invite The Bot](https://discordapp.com/oauth2/authorize?client_id=563186108712878090&permissions=1812327519&scope=bot)")
      .addField("**ReCreate [bot]**", "[Invite The Bot](https://top.gg/bot/634561188822384656)")
      .addField("**Strider [bot]**", "[Invite The Bot](https://discord.com/oauth2/authorize?client_id=765088908773818378&permissions=2147479543&scope=bot)")
      .addField("**JavaScript Universe [server]**", "[Join The Server](https://discord.gg/ttkuy3rGjG)")
      .addField("**Divider Advertise [server]**", "[Join The Server](https://discord.gg/tDks8dDk9J)")
      msg.channel.send(em);
  }
}