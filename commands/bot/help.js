const config = require('../../config.json');
const moment = require('moment');

module.exports = {
  name: 'help',
  category: 'Bot',
  description: 'The help menu',
  usage: '<category/command>',
  aliases: ['h'],
  permLevel: '0',
  run: async (client, msg, args, prefix, command, Discord, MessageEmbed, userLevel) => {

    // Variables.
    let input = args[0];
    let developer = config.developer.includes(msg.author.id) ? true : false;
    const commands = client.commands;
    if (input) client.commands.filter(com => com.aliases).find(com => com.aliases.includes(input.toLowerCase())) ? input = client.commands.find(com => com.aliases.includes(input.toLowerCase())).name : null; 
    let categories;
    developer ? categories = [...new Set(commands.map(com => com.category.toLowerCase()))] : categories = [...new Set(commands.filter(com => com.category !== 'Developer').map(com => com.category.toLowerCase()))];

    // Logic.
    let skip = !input ? true : null, Command, category;
    if (!skip) { 
      input = input.toLowerCase().trim(); 
      categories.includes(input) ? category = true : commands.has(input) ? Command = true : skip = true;
    }

    // Code.
    if (Command) {
      const commandInfo = commands.get(input);
      const emCom = new MessageEmbed()
      .setTitle(`Help ➣ ${commandInfo.name.toProperCase()}`)
      .setColor("BLUE")
      .setFooter(msg.author.username, msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
      .addField(`➣ Description`, `**\`${commandInfo.description}\`**`)
      .addField(`➣ Usage`, `**\`${prefix}${commandInfo.name.toLowerCase()} ${commandInfo.usage}\`**`);
      if (commandInfo.cooldown) emCom.addField(`➣ Cooldown`, `**\`${moment.duration(commandInfo.cooldown).format('H [hrs][,] m [mins] [and] s [secs]')}\`**`);
      if (commandInfo.aliases && commandInfo.aliases.length !== 0) emCom.addField(`➣ Aliases`, `**\`${commandInfo.aliases.join(', ')}\`**`);
      return msg.channel.send(emCom);
    } else if (category) {
      const emCat = new MessageEmbed()
      .setTitle(`Help ➣ ${input.toProperCase()}`)
      .setColor("BLUE")
      .setFooter(msg.author.username, msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
      .setDescription(client.commands.filter(com => com.category.toLowerCase() === input).map(com => `**\`${prefix}${com.name}\`** - ${com.description}`));
      return msg.channel.send(emCat)
    } else if (skip) {
      const emHelp = new MessageEmbed()
      .setTitle(`Help`)
      .setColor("BLUE")
      .setFooter(msg.author.username, msg.author.displayAvatarURL({ format: 'png', dynamic: true }))
      .setDescription(`Run this command again and enter either the name of a command or the name of an available category to get more information.\nExample:**\`${prefix}help general\`**`)
      .addField(`➣ Available Categories`, categories.map(cat => cat.toProperCase()).join('\n'), true)
      .addField(`➣ Useful Links`, `[Support Server](https://discord.gg/fG48t36)\n[Invite Link](https://discordapp.com/oauth2/authorize?client_id=713087534837530745&scope=bot)`, true);
      return msg.channel.send(emHelp);
    }
  }
}

/* Keep these:
/ ➣
/ `${"[Support Server](https://discord.gg/fG48t36)"}\n${"[Invite Link](https://discordapp.com/oauth2/authorize?client_id=713087534837530745&scope=bot)"}`
/
/
/
*/