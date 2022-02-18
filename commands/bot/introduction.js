const { embed, userDB, exec, ensure, getKeyByValue } = require('../../handler/functions.js');
const Enmap = require('enmap');
const moment = require('moment');
const paginationEmbed = require('discord.js-pagination');

module.exports = {
    name: 'introduction',
    category: 'General',
    permLevel: '0',
    perm: 'User',
    aliases: ['intro', 'guide', 'howto', 'helpme'],
    usage: '',
    description: 'Just read and flip the pages, feel free to come back in the future if you need some help!',
    run: async (client, msg, args, prefix, command, Discord, MessageEmbed) => {
        const intro = {
            intro: `First of all welcome to Eco Life, we (the developers) want to thank you, yes you! 
            Thank you for choosing Eco Life to spent your time with. Now I don't want to waste your 
            time with reading, this introduction has a few pages with useful information to get started and grow big in the bot.
            Good luck!`,
            earn_money_for_beginners: `Earning money may seem a bit annoying when getting started with Eco Life, tho we are here to 
            tell you it actually is quite easy. Since at first you will not have a job yet nor a way to get one, there is other ways to 
            earn money. You should try \`${prefix}daily\`. You can use this command every 24 hours to earn a quick $1,000. 
            Once you have done this you can start going to the casino. A tutorial on the casino can be found after a few pages from here.`,
            get_a_job: `To get a job you must meet certain requirements to please your employer, you must have a vehicle to get from point A to B, 
            you must also have a place to live that fits the job description. I mean you don't want to drive a car that's about to fall apart when you're 
            the CEO of a successful company, do you? Well good news, there are 2 very important commands here: \`${prefix}restate\` and \`${prefix}dealer\`. Both 
            of these commands work exactly the same. If you run them with the input \`view\` they will show all available vehicles/properties, and to 
            make your life a little easier they are (from top to bottom) filtered from worst to best. So for the first job (garbage man), you will need 
            both of the first objects from the dealer and restate. If you run \`${prefix}dealer view rusty old car\` you will get all info on this, this works 
            the same for all vehicles and properties. To buy a vehicle/property you simply do \`${prefix}dealer buy rusty old car\`. Once again this works 
            the same for all vehicles and properties. So now that you have the requirements for let's say garbage man, you can do \`${prefix}job apply garbage man\`. 
            Congrats, you just got a job! (sorry for the wall of text on this page)`,
            stay_alive: `We all like to survive, it's in our blood. It's what makes you human, and that is no difference in this bot. You might have noticed 
            that this bot has a health, hunger and thirst system. Most commands (some are left out) decrease your hunger and thirst by 5 when used. Once either your 
            thirst or hunger is at 0; your health will start dropping by 5 (every time you use a command). Once your health drops to 0, you die and you will loose quite 
            a bit of money. So how do I stay alive you may be wondering? Well It's actually quite easy, you will have to eat and drink. Have you ever looked at the \`${prefix}shop\`? 
            No? Hm, alright well... You should, the shop has a bunch of delicious food and drinks, and even some weird items. Look through the shop and when you see something 
            you like, buy it. Aight good luck with that! ... Haha got you there, alright so how do you buy food or drinks? Easy, let's say you want to buy a pepsi, just run 
            \`${prefix}buy pepsi\`. This works the same for food and other items. Now to drink the most wonderful drink on the planet. \`${prefix}use pepsi\`. See that was easy! 
            See you on the next page 😉`,
            dont_do_crime: `Not even gonna get into this too much. Unless you don't care to lose money \`${prefix}crime\` is NOT worth it.`,
            casino: `The casino is a wonderful place of joy and hurt, some people come in poor and leave with a truck full of money and some people leave with nothing but anger 
            and blame it on the casino and call it scuffed. Whatever. So the casino has 3 games at the moment: blackjack, slots and the lottery. The lottery is something you will have to 
            figure out on your own. The slots are quite easy, with a minimum input of $100 and a maximum input of $10,000 it's the perfect way to lose money, cause let's be honest. No one ever 
            wins these... Or do they? Over to blackjack; blackjack isn't just gambling, it's also a game of knowledge is power or in this case money. When you run \`${prefix}blackjack\` 
            the bot will help you on how to use this game. Read [this](https://wikipedia.org/wiki/Blackjack) to learn more about the base of blackjack.`,
            doctor: `The doctor is important for when you have lost some health due to forgetting to eat/drink. Simply run \`${prefix}doctor\` to use it and the rest is 
            self explanatory`,
            get_to_the_top: `Now with all of this information I'm sure you will make it on your own, if not just join the support server and ask for some help. 
            Get to the top of the leaderboard and earn that crown!`
        }
        const em1 = new MessageEmbed()
        .setTitle("Intro")
        .setColor("BLUE")
        .setDescription(intro.intro);
        const em2 = new MessageEmbed()
        .setTitle("Earn Money For Beginners")
        .setColor("BLUE")
        .setDescription(intro.earn_money_for_beginners);
        const em3 = new MessageEmbed()
        .setTitle("Get A Job")
        .setColor("BLUE")
        .setDescription(intro.get_a_job);
        const em4 = new MessageEmbed()
        .setTitle("Stay Alive")
        .setColor("BLUE")
        .setDescription(intro.stay_alive);
        const em5 = new MessageEmbed()
        .setTitle("Dont Do Crime")
        .setColor("BLUE")
        .setDescription(intro.dont_do_crime);
        const em6 = new MessageEmbed()
        .setTitle("Casino")
        .setColor("BLUE")
        .setDescription(intro.casino);
        const em7 = new MessageEmbed()
        .setTitle("Doctor")
        .setColor("BLUE")
        .setDescription(intro.doctor);
        const em8 = new MessageEmbed()
        .setTitle("Get To The Top")
        .setColor("BLUE")
        .setDescription(intro.get_to_the_top);
        const pages = [
            em1,
            em2,
            em3,
            em4,
            em5,
            em6,
            em7,
            em8
        ];
        const emojiList = [
            '⬅️',
            '➡️'
        ];
        return paginationEmbed(msg, pages, emojiList, 240000);
    }
}