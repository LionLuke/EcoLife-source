const { embed } = require('../../handler/functions.js');
const moment = require("moment");
const Enmap = require('enmap');
require("moment-duration-format");

module.exports = {
  name: 'reply',
  category: 'Developer',
  permLevel: '1',
  aliases: ['r'],
  usage: '<suggestion message id> <reply>',
  description: 'Reply to a suggestion',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
    if (!args.join(' ').replace(args[0], '').trim()) return embed(msg, 'RED', 'You need to insert a reply!');
    if (args.join(' ').length > 2000) return embed(msg, 'RED', 'Your reply may not exceed 2000 characters!');
    const sugID = args[0];
    const sChannel = client.channels.cache.get('713751730554404873');
    await sChannel.messages.fetch();
    const suggestion = sChannel.messages.cache.get(sugID);
    if (!suggestion) return embed(msg, 'RED', 'I could not find a suggestion with that ID.')
    if (!suggestion.embeds[0]) return embed(msg, 'RED', 'I could not find a suggestion with that ID.')
    if (!suggestion.embeds[0].footer) return embed(msg, 'RED', 'I could not find a suggestion that has a footer with that ID.')
    const user = client.users.cache.get(suggestion.embeds[0].footer.text);
    const em = new MessageEmbed()
      .setTitle(`${msg.author.username}'s Reply`)
      .setColor("BLUE")
      .setThumbnail(msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
      .addField("Suggestion", suggestion.embeds[0].description)
      .setDescription(args.join(' ').replace(args[0], '').trim());
      await sChannel.send(em);
      await msg.delete();
      const emb = new MessageEmbed()
      .setColor("GREEN")
      .setTitle("Someone has reponded to a suggestion you made");
      if (user.id && !client.guilds.cache.get('713751729291919383').member(user.id)) emb.setDescription("I noticed that you are not currently in my support server, please join by [clicking this](https://discord.gg/fG48t36).");
      await user.send(`https://discordapp.com/channels/713751729291919383/713751730554404873/${suggestion.id}`, emb).catch(err => err);
      return embed(msg, 'GREEN', 'Your reply has been sent.');
  }
}