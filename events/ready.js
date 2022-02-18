const { MessageEmbed } = require('discord.js');
const Enmap = require('enmap');
const { userDB, set, dblc, dblcSet, dbSet } = require('../handler/functions.js');
const config = require('../config.json');
const axios = require('axios');

module.exports = async client => {
  // Log that the bot is online.
  console.log(`${client.user.tag}, ready in ${client.guilds.cache.size.toLocaleString()} guilds.`, "ready");
  client.appInfo = await client.fetchApplication();

  // Ensure all guild settings.
  client.guilds.cache.forEach((g) => {
    new Enmap({ name: 'guildSettings' }).ensure(g.id, {prefix: ')'});
  })

  // Fetch all users in database.
  client.database.users.forEach(async (u) => {
    await client.users.fetch(u.id);
  })

  // Connect to server.js
  require("../server/server.js")(client);

  // Set activity
  client.user.setActivity('Eco Life#0776 help', {type: 'PLAYING'}).catch(error => console.log(error));

  // Set up client.economy.
  client.economy.set('lottery', {cooldown: '172800000'})
  client.economy.set('work', {cooldown: '200000', payout: {min: '100', max: '1000'}, stories: ['You worked as volunteer fireman.', 'You fixed a road.', 'While "working" at your job, you didn\'t do much useful. You found money on the ground.', 'While working at the beach as ice cream seller, you rescued a guy from choking on a ice cream cone.', 'You worked a full 8 hour shift as police officer.', 'You fell asleep on the couch... You found money in the couch when you woke up.', 'Error 404: Developer ran out of ideas for stories, just take your money.', 'While working at a local bank, it got robbed. You hit the robber in the back of the head with a pen and saved the day.']})
  client.economy.set('crime', {cooldown: '500000', payout: {min: '10', max: '300'}, storiesWon: ['You stole a rich guy\'s car and sold it at a chop shop.', 'You went across doors pretending to earn money for charity.', 'You robbed a museum and stole a T-Rex which you then sold to John Hammond.', 'We don\'t talk about this one. You earned some money.', 'You took the dashboard display from a Tesla, you sold it back to Tesla pretending you found it left on the street.', 'You stole all wheels from a Mercedes, you sold them at a local scrap yard.'], storiesLost: ['While robbing a bank you misteriously got hit in the back of the head with a pen. Weird.', 'You tried to rob a house at night, you opened the window; climbed inside and... The lights turned on. You accidentially broke into a police station..', 'When trying to rob a store 2 cops were standing at the donut stand..', 'You tried to pickpocket an old lady, but she hit you in the head with her umbrella instead. You woke up in jail.', 'You tried to steal a Tesla, but the sentry mode caught you. The car alarmed the cops and before you managed to start the car the cops surounded you..', 'Error 404: Developer ran out of stories again. He got mad and decided to take some of your money.']})
  client.economy.set('slots', {cooldown: '30000'})
  client.economy.set('blackjack', {cooldown: '2000'})
  client.economy.set('give', {cooldown: '600000'})
  client.economy.set('beg', {cooldown: '900000', payout: {min: '1', max: '100'}, stories: ['A person biking on the streets threw some money at you while yelling something.', 'A suspicious looking person handed you some cash.', 'After begging for an entire day and getting nothing, you found some money left on the street.', 'Some person gave you money and told you not to show it to the cops.. weird..']})
  client.economy.set('items',
  {general:
    {casino_chips:
      {name: 'casino chips',
      price: '1',
      id: 'chip',
      weight: 0, // You can only own (unless you won them) 40k at once anyways.
      description: 'Use these chips to play games in the casino'
    },
    lottery_ticket:
      {name: 'lottery ticket',
      price: '1000',
      id: 'ticket',
      weight: 0.01,
      description: 'Buy this to enter the lottery.'
    },
    clover:
      {name: 'clover',
      price: '100000',
      id: 'clover',
      weight: 0.01,
      description: 'Use this to gain some extra luck on the slots.'
    }},
  food:
    {hamburger:
      {name: 'hamburger',
      price: '500',
      id: 'hamburger',
      weight: 0.5,
      food_regain: '90',
      fatInc: 20,
      description: 'Man.. this.. this is.. this is good.'
    },
    sandwich:
      {name: 'sandwich',
      price: '400',
      id: 'sandwich',
      weight: 0.25,
      food_regain: '80',
      fatInc: 5,
      description: 'Perfect meal against hunger.'
    },
    salad:
      {name: 'salad',
      price: '200',
      id: 'salad',
      weight: 0.1,
      food_regain: '40',
      fatDe: 60,
      description: 'Gotta say, these rabbits know about good food.'
    },
    egg:
      {name: 'egg',
      price: '100',
      id: 'egg',
      weight: 0.09,
      food_regain: '5',
      description: 'So light you might not even feel it.'
    },
    brocoli:
      {name: 'brocoli',
      price: '250',
      id: 'brocoli',
      weight: 0.6,
      food_regain: '50',
      fatDe: 50,
      description: 'Green food perfect for killing your hunger.'
    },
    french_fries:
      {name: 'french fries',
      price: '150',
      id: 'fries',
      weight: 0.3,
      food_regain: '20',
      fatInc: 15,
      description: 'The perfect snack for some small hunger.'
    },
    golden_apple:
      {name: 'golden apple',
      price: '10000000',
      id: 'goldapple',
      weight: 10,
      food_regain: '100',
      fatDe: 100,
      description: 'Refills all bars (health, food, thirst). Tastes kinda weird, and I doubt that gold is good for your teeth..'
    }},
  drinks:
    {water:
      {name: 'water',
      price: '350',
      id: 'water',
      weight: 0.5,
      thirst_regain: '50',
      fatDe: 25,
      description: 'No taste, but good for killing that thirst.'
    },
    coca_cola:
      {name: 'coca cola',
      price: '400',
      id: 'cola',
      weight: 0.5,
      thirst_regain: '60',
      fatInc: 40,
      description: 'Unhealthy like nothing else, but whatever.'
    },
    pepsi:
      {name: 'pepsi',
      price: '600',
      id: 'pepsi',
      weight: 0.5,
      thirst_regain: '40',
      fatInc: 60,
      description: 'Basically premium cola with the benefit of cholesterol.'
    },
    milk:
      {name: 'milk',
      price: '750',
      id: 'milk',
      weight: 1.5,
      thirst_regain: '100',
      fatInc: 10,
      description: 'Thank the cows.'
    },
    fanta:
      {name: 'fanta',
      price: '550',
      id: 'fanta',
      weight: 0.5,
      thirst_regain: '50',
      fatInc: 30,
      description: 'With how much sugar this contains I dont think it\'s good against thirst..'
    },
    orange_juice:
      {name: 'orange juice',
      price: '700',
      id: 'juice',
      weight: 0.5,
      thirst_regain: '90',
      fatDe: 45,
      description: 'Tastes good? Check, Healthy? Check, Hotel? Trivago.'
    }}, hunting: {}, fishing: {}, mining: {}, storage: {
      backpack: {
        name: 'backpack',
        price: '5000',
        id: 'backpack',
        weight: 10
      },
      chest: {
        name: 'chest',
        price: '10000',
        id: 'chest',
        weight: 30
      },
      closet: {
        name: 'closet',
        price: '55000',
        id: 'closet',
        weight: 60
      },
      box_truck: {
        name: 'box truck',
        price: '250000',
        id: 'truck',
        weight: 120
      },
      secret_bunker: {
        name: 'secret bunker',
        price: '1000000',
        id: 'bunker',
        weight: 200
      },
      shipping_container: {
        name: 'shipping container',
        price: '3500000',
        id: 'container',
        weight: 500
      },
      armory: {
        name: 'armory',
        price: '5000000',
        id: 'armory',
        weight: 1000
      },
      evil_layer: {
        name: 'evil layer',
        price: '10000000',
        id: 'layer',
        weight: 2000
      },
      ship_engine_room: {
        name: 'ship engine room',
        price: '25000000',
        id: 'engineroom',
        weight: 5000
      },
      dry_dock: {
        name: 'dry dock',
        price: '50000000',
        id: 'dock',
        weight: 10000
      },
      hell: {
        name: 'hell',
        price: '1000000000',
        id: 'hell',
        weight: 50000
      }
    }})
  // Jobs + Requirements
  client.economy.set('jobs', {
    garbage_man: {vehicleReg: 'rusty old car', propertyReg: 'motel room', payout: {min: 250, max: 1000},
    stories: ['You threw some garbage into the garbage truck', 'While throwing garbage into the garbage truck on of the bags teared and the garbage came all over you', 'While tying your shoes the garbage truck drove away without you, you had to run after it with a bag of garbage in your hand', 'You threw garbage over the garbage truck driver for driving away without you', 'You were allowed to drive the garbage truck for once, you crashed it']},

  taxi: {vehicleReg: 'sedan', propertyReg: 'flat', payout: {min: 1000, max: 3000},
  stories: ['While driving the taxi you saw two people beating eachother up, you enjoyed the show', 'You drove a grumpy old man from the airport to the city, you flipped him off when he got out of the taxi', 'You drove a young drunk couple in the middle of the night, lets just say it got real in the back', 'While driving taxi all your tires decided to drive off without you', 'You were stuck in a traffic jam all day']},

  delivery: {vehicleReg: 'mini van', propertyReg: 'small house', payout: {min: 3000, max: 6000},
  stories: ['While trying to deliver a package to a big house, you were greeted by a big and angry dog', 'You delivered all packages in time, you stopped for coffee. Your delivery van got stolen at the coffee place, you had to walk back to the office', 'You delivered all packages again, you learned from your mistakes and did not stop for coffee this time', 'Your delivery van broke down, you left it there and went back to the office and just told them it got stolen again', 'While walking to a house with a big package you tripped and dropped the package, you acted like nothing happened and delivered the package anyways']},

  chef_cook: {vehicleReg: 'suv', propertyReg: 'big house', payout: {min: 6000, max: 10000},
  stories: ['While cooking a modern recipe for a rich family, the kitchen caught fire', 'You had to cook for some chubby chef with white hair and an English accent, he wasnt very nice to you', 'You had to cook for the president, all you were thinking was "if I mess up, I die". The president liked your recipe', 'The restaurant was very crowded, you almost got a heart attack from the amount of things you had to do at once', 'Once upon a time there was a... Oh wait wrong story']},

  actor: {vehicleReg: 'sports car', propertyReg: 'hillside villa', payout: {min: 10000, max: 15000},
  stories: ['You filmed an episode of some show about the devil', 'While acting you had to jump of a building.. Did I forget to mention you are afraid of heights?', 'You had to put on some weird mask with snakes as hair on the set today', 'You kept saying the line "Im the fastest man alive" on set today, you found it strange, but didnt ask questions', 'You met Melon Busk on the set of some superhero movie today']},

  minister: {vehicleReg: 'limousine', propertyReg: 'big hillside villa', payout: {min: 15000, max: 70000},
  stories: ['You acted important today', 'You filled in some paper work because the president got lazy', 'You held a speech about equal rights and the importance of them today', 'You drove around in your limousine and went for a coffee at moonbucks', 'You fell asleep in the office']},

  world_star: {vehicleReg: 'hyper car', propertyReg: 'mansion', payout: {min: 70000, max: 100000},
  stories: ['You went to holywood and met some fans', 'You spent a lot of money on useless gadgets', 'You had a concert for 150,000 people', 'You slept through the entire day after having a concert all night', 'You had some other famous friends over, you got really drunk']},

  coo_of_car_manufacturer: {vehicleReg: 'helicopter', propertyReg: 'big house on private island', payout: {min: 100000, max: 250000},
  stories: ['You yelled at some people for damaging one of the robot arms in the factory', 'You went to a dealership to see how sales are going, you were happy with what you saw', 'You flew around in your helicopter with a few friends', 'You made a test drive in a new prototype hyper car', 'You talked about the possibility of electric hyper cars with Melon Busk']}, ceo_of_car_manufacturer: {vehicleReg: 'super jet', propertyReg: 'private yacht', payout: {min: 25000, max: 250000}, stories: ['You made up a new hyper car model together with your coo and Melon Busk', 'You gave a party for 100 people on your private yacht', 'You gave away some of your money to poor people on the street', 'You showed the new electric hyper car to the world, the video got a billion views on MyStraw', 'Once upon a time.. Wait wrong story again.. Sorry']},

  ceo_of_ecozon: {vehicleReg: 'super yacht', propertyReg: 'private super yacht', payout: {min: 250000, max: 350000},
  stories: ['You enjoyed your vacation to the moon', 'You layed back in a chair on your private super yacht', 'You looked at the stonks', 'You gave away some money to homeless people and told them you used to be homeless as well, and that as long as they didnt give up. They could be as rich as you', 'You bought a jetpack to mess around with']},

  owner_of_lux: {vehicleReg: 'limited edition classic sports car', propertyReg: 'lux', payout: {min: 350000, max: 550000},
  stories: ['You scared someone away with your true face', 'You got maze to cut your wings off', 'You yelled at dad for giving you your wings back again', 'You annoyed the detective', 'You bribed a cop']},

  mayor_of_starcity: {vehicleReg: 'armoured motorcycle', propertyReg: 'bunker', payout: {min: 550000, max: 1000000}, rebirthLevelReg: 1,
  stories: ['"You have failed this city"', 'You got accused of being the green arrow and had to pull some strings', 'You defeated some very strong people that were under control of a substance', 'You fell in love with a criminal', 'You beat up some Russians', 'You shot some arrows into some fast guy\'s back', 'You saved the universe by sacrificing yourself']},

  some_rich_bat: {vehicleReg: 'batmobile', propertyReg: 'secure mansion', payout: {min: 1000000, max: 2500000}, rebirthLevelReg: 2,
  stories: ['You threw a sharp object at some funny guy', 'You used a grappling hook to get onto a building', 'You drove your batmobile through the city of Arkham', 'You locked some funny guy up in jail', 'You sensed a giant light in the sky with a bat in it', 'You saved some poor lady from robbers, but it turned out to be a trap. The lady was a criminal.', '"I\'m Batman"']}})

  client.economy.set('vehicles', {
    rusty_old_car: {price: 200, reliability: 20, mechanicPrice: 50},
    sedan: {price: 2000, reliability: 50, mechanicPrice: 125},
    mini_van: {price: 4000, reliability: 60, mechanicPrice: 300},
    suv: {price: 8000, reliability: 70, mechanicPrice: 600},
    sports_car: {price: 16000, reliability: 80, mechanicPrice: 1500},
    limousine: {price: 35000, reliability: 90, mechanicPrice: 4500},
    hyper_car: {price: 55000, reliability: 95, mechanicPrice: 6500},
    helicopter: {price: 120000, reliability: 95, mechanicPrice: 15000},
    super_jet: {price: 200000, reliability: 95, mechanicPrice: 30000},
    super_yacht: {price: 850000, reliability: 95, mechanicPrice: 150000},
    limited_edition_classic_sports_car: {price: 1700000, reliability: 90, mechanicPrice: 180000},
    armoured_motorcycle: {price: 6000000, reliability: 80, mechanicPrice: 300000},
    batmobile: {price: 10000000, reliability: 95, mechanicPrice: 650000}})

  client.economy.set('properties', {
    motel_room: {price: 500},
    flat: {price: 4000},
    small_house: {price: 8000},
    big_house: {price: 16000},
    hillside_villa: {price: 32000},
    big_hillside_villa: {price: 70000},
    mansion: {price: 110000},
    big_house_on_private_island: {price: 240000},
    private_yacht: {price: 400000},
    private_super_yacht: {price: 1700000},
    lux: {price: 3400000},
    bunker: {price: 10000000},
    secure_mansion: {price: 15000000}})

  // Pets - Multipliers
  client.economy.set('pets', {
    kitty: {name: 'kitty', rarity: 0, multiplier: 0.2, value: 100},
    bunny: {name: 'bunny', rarity: 1, multiplier: 0.5, value: 250},
    piggy: {name: 'piggy', rarity: 2, multiplier: 1, value: 500},
    hamster: {name: 'hamster', rarity: 3, multiplier: 1.5, value: 1000},
    mouse: {name: 'mouse', rarity: 4, multiplier: 2, value: 1500},
    doggy: {name: 'doggy', rarity: 2, multiplier: 2, value: 1500},
    dragon: {name: 'dragon', rarity: 5, multiplier: 5, value: 5000}})

  /*
      Rarity Chart
      -- Math.floor(Math.random() * 100) --
      common: 0 - 0 -- 60 ; 60%
      uncommon: 1 - 60 -- 80 ; 20%
      rare: 2 - 80 -- 90 ; 10%
      epic: 3 - 90 -- 95 ; 5%
      legendary: 4 - 95 -- 99 ; 4%
      mythic: 5 - 99 -- 100 ; 1%
  */
 /* axios.post('https://api.botlist.me/api/v1/bots/713087534837530745/stats', {
  server_count: client.guilds.cache.size,
 }, {
   headers: {
  "authorization": 'Ae-9uId94C1n31zfwDxVFz8aeD7r63',
  "content-type": 'application/json',
},
}).then((res) => {
   res.data.error ? console.log(res.data.error) : console.log('Stats was updated on Botlist.me!');
 }).catch(e => {
   console.log(e);
 })

 axios.post('https://api.voidbots.net/bot/stats/713087534837530745', {
  server_count: client.guilds.cache.size,
 }, {
   headers: {
  "authorization": 'VOID_x7n9Qz9yKNsVwdy69fyJQujrAIMWNkgqIqhU462yXklCl8ad',
  "content-type": 'application/json',
},
}).then((res) => {
   res.data.error ? console.log(res.data.error) : console.log('Stats was updated on voidbots!');
 }).catch(e => {
   console.log(e);
 })

 axios.post('https://discord.boats/api/bot/713087534837530745', {
  server_count: client.guilds.cache.size,
 }, {
   headers: {
  "authorization": '5fCJMxkpstlSlwStpq3bLAvmuEeRMqQn3MZYMWSx3CXuITvSH9aDPMuPOUumiOmwLZ4wNm3VeBTRulV4y8UTJwKPSPMy6CRsSBd987GsC16p2EiY0Ju2xFCPKzAHMz1Izkm34kQvXQD1cmLR4eW9mtED1iI',
  "content-type": 'application/json',
},
}).then((res) => {
   res.data.error ? console.log(res.data.error) : console.log('Stats was updated on discord.boats!');
 }).catch(e => {
   console.log(e);
 })
 */
};
