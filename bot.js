const { Discord: Discord, Client, Collection, MessageEmbed, Message, Intents } = require('discord.js');
const config = require('./config');
const { userDB, set } = require('./handler/functions.js');
const Enmap = require('enmap');
const fs = require('fs');

// Start of Discord Bot
const client = new Client({ ws: { intents: Intents.NON_PRIVILEGED } });
client.commands = new Collection();
client.economy = new Collection();
client.items = new Collection();
client.events = new Collection();
client.aliases = new Collection();
client.config = config;

// Command Handler
['commandHandler'].forEach(handler => {
  require(`./handler/${handler}`)(client);
});

// Event Handler
fs.readdir('./events', (err, files) => {
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split('.')[0];
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

// Error Handler
process.on('unhandledRejection', error => {
  // console.error(error.path);
  if (error.method == 'post') client.channels.cache.get(error.path.split('/')[2]).send("Please enable the permission `Embed Links` if you want me to function properly!")
});

// Warn Handler
client.on("warn", function(info){
  console.log(`warn: ${info}`);
});

// Client Settings
client.debugg = false;
client.afk = new Map();
client.antiSpam = new Map();
client.queues = new Map();
client.database = {};
client.database.users = new Enmap({ name: 'users' });
client.database.guilds = new Enmap({ name: 'guildSettings' });
client.database.lottery = new Enmap({ name: 'jackpot' }).get('global');
client.database.blacklist =new Enmap({ name: 'blacklist' });


// toProperCase()
String.prototype.toProperCase = function () {
  return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

Number.prototype.stringify = function (msg) {
  var newValue = this;
  if (this >= 1000) {
    if (userDB(msg.author.id) && userDB(msg.author.id).config && userDB(msg.author.id).config.numberDisplay && userDB(msg.author.id).config.numberDisplay === 'commas') return newValue.toLocaleString();
      var suffixes = ["", "k", "m", "b", "t", "q"];
      var suffixNum = Math.floor( (""+this).length/3 );
      var shortValue = '';
      for (var precision = 2; precision >= 1; precision--) {
          shortValue = parseFloat( (suffixNum != 0 ? (this / Math.pow(1000,suffixNum) ) : this).toPrecision(precision));
      }
      if (shortValue < 1) { 
        shortValue = shortValue * 1000;
        suffixNum = suffixNum - 1;
      }
      if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
      newValue = shortValue+suffixes[suffixNum];
  }
  return newValue;
}

String.prototype.intify = function () {
    let val = this;
    multiplier = val.substr(-1).toLowerCase();
    let toReturn;
    switch (multiplier) {
      case 'k':
        toReturn = parseFloat(val) * 1000;
      break

      case 'm':
        toReturn = parseFloat(val) * 1000000;
      break

      case 'b':
        toReturn = parseFloat(val) * 1000000000;
      break

      case 't':
        toReturn = parseFloat(val) * 1000000000000;
      break

      case 'q':
        toReturn = parseFloat(val) * 1000000000000000;
      break
    }
    if (!toReturn) return this;
    return toReturn;
}

client.login(config.token);