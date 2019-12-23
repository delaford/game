import { presetActions } from '@server/core/data/helpers/database';

export default [
  // Capes
  {
    id: 'cape',
    name: 'Cape',
    examine: 'A regular cape.',
    price: 5,
    type: 'armor',
    slot: 'back',
    stats: {
      attack: {
        stab: 1, slash: 1, crush: 1, range: 1,
      },
      defense: {
        stab: 3, slash: 3, crush: 3, range: 3,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 0,
      column: 0,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'cape-of-accuracy',
    name: 'Cape of Accuracy',
    examine: 'A cape embued with powers of being able to be more accurate in combat.',
    price: 19,
    type: 'armor',
    slot: 'back',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: 0,
      },
      defense: {
        stab: 0, slash: 0, crush: 0, range: 3,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 1,
      column: 0,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'cape-of-algea',
    name: 'Cape of Algea',
    examine: 'Cape gives you the uncanny ability to do more damage per hit.',
    price: 25,
    type: 'armor',
    slot: 'back',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: 0,
      },
      defense: {
        stab: 0, slash: 0, crush: 0, range: 0,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 2,
      column: 0,
    },
    actions: presetActions(['wearable']),
  },
  // Bronze (set)
  {
    id: 'bronze-med-helm',
    name: 'Bronze Med Helm',
    examine: 'Small covering that protects your head made of Bronze.',
    price: 12,
    type: 'armor',
    slot: 'head',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: -2,
      },
      defense: {
        stab: 3, slash: 4, crush: 2, range: 4,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 1,
      column: 0,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'bronze-boots',
    name: 'Bronze Boots',
    examine: 'Seems to be good at covering your toes and blending into the dirt.',
    price: 14,
    type: 'armor',
    slot: 'feet',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: -2,
      },
      defense: {
        stab: 1, slash: 2, crush: 3, range: 5,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 2,
      column: 0,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'bronze-gloves',
    name: 'Bronze Gloves',
    examine: 'Protects your hands from projectiles and combat. Seems weak, though.',
    price: 40,
    type: 'armor',
    slot: 'gloves',
    stats: {
      attack: {
        stab: 2, slash: 2, crush: 2, range: 2,
      },
      defense: {
        stab: 2, slash: 2, crush: 2, range: 2,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 3,
      column: 0,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'bronze-chainmail',
    name: 'Bronze Chainmail',
    examine: 'Small metal rings formed to a mesh made of Bronze.',
    price: 12,
    type: 'armor',
    slot: 'armor',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: 0,
      },
      defense: {
        stab: 7, slash: 11, crush: 13, range: 2,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 4,
      column: 0,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'bronze-pavise',
    name: 'Bronze Pavise',
    examine: 'Small yet rectangle shield helped to cover your body..',
    price: 21,
    type: 'armor',
    slot: 'left_hand',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: 0,
      },
      defense: {
        stab: 5, slash: 6, crush: 4, range: 8,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 5,
      column: 0,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'bronze-shield',
    name: 'Bronze Shield',
    examine: 'Reliable shield for all-around combat made of Bronze.',
    price: 41,
    type: 'armor',
    slot: 'left_hand',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: 0,
      },
      defense: {
        stab: 3, slash: 5, crush: 10, range: 6,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 6,
      column: 0,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'bronze-armor',
    name: 'Bronze Armor',
    examine: 'A nice, hard chestplate..',
    price: 96,
    type: 'armor',
    slot: 'armor',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: -10,
      },
      defense: {
        stab: 15, slash: 14, crush: 9, range: 25,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 7,
      column: 0,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'bronze-helm',
    name: 'Bronze Helm',
    examine: 'A bronze helmet with proper protection.',
    price: 30,
    type: 'armor',
    slot: 'left_hand',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: 0,
      },
      defense: {
        stab: 4, slash: 5, crush: 3, range: 4,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 8,
      column: 0,
    },
    actions: presetActions(['wearable']),
  },
  // Iron (set)
  {
    id: 'iron-med-helm',
    name: 'Iron Med Helm',
    examine: 'Small covering that protects your head made of Iron.',
    price: 142,
    type: 'armor',
    slot: 'head',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: -2,
      },
      defense: {
        stab: 13, slash: 14, crush: 12, range: 14,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 1,
      column: 1,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'iron-boots',
    name: 'Iron Boots',
    examine: 'Seems to be good at covering your toes and blending into the dirt.',
    price: 144,
    type: 'armor',
    slot: 'feet',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: -2,
      },
      defense: {
        stab: 11, slash: 12, crush: 13, range: 15,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 2,
      column: 1,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'iron-gloves',
    name: 'Iron Gloves',
    examine: 'Protects your hands from projectiles and combat. Seems weak, though.',
    price: 140,
    type: 'armor',
    slot: 'gloves',
    stats: {
      attack: {
        stab: 2, slash: 2, crush: 2, range: 2,
      },
      defense: {
        stab: 12, slash: 12, crush: 12, range: 12,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 3,
      column: 1,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'iron-chainmail',
    name: 'Iron Chainmail',
    examine: 'Small metal rings formed to a mesh made of Iron.',
    price: 142,
    type: 'armor',
    slot: 'armor',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: 0,
      },
      defense: {
        stab: 17, slash: 21, crush: 23, range: 12,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 4,
      column: 1,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'iron-pavise',
    name: 'Iron Pavise',
    examine: 'Small yet rectangle shield helped to cover your body..',
    price: 141,
    type: 'armor',
    slot: 'left_hand',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: 0,
      },
      defense: {
        stab: 15, slash: 16, crush: 14, range: 18,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 5,
      column: 1,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'iron-shield',
    name: 'Iron Shield',
    examine: 'Reliable shield for all-around combat made of Iron.',
    price: 141,
    type: 'armor',
    slot: 'left_hand',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: 0,
      },
      defense: {
        stab: 13, slash: 15, crush: 20, range: 16,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 6,
      column: 1,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'iron-armor',
    name: 'Iron Armor',
    examine: 'A nice, hard chestplate..',
    price: 126,
    type: 'armor',
    slot: 'armor',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: -10,
      },
      defense: {
        stab: 25, slash: 24, crush: 19, range: 35,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 7,
      column: 1,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'iron-helm',
    name: 'Iron Helm',
    examine: 'A bronze helmet with proper protection.',
    price: 130,
    type: 'armor',
    slot: 'left_hand',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: 0,
      },
      defense: {
        stab: 14, slash: 15, crush: 13, range: 14,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 8,
      column: 1,
    },
    actions: presetActions(['wearable']),
  },
  // Leather (set)
  {
    id: 'leather-cowl',
    name: 'Leather Cowl',
    examine: 'Keeps your noggin warm and a bit stiff..',
    price: 14,
    type: 'armor',
    slot: 'head',
    attack: {
      stab: 0, slash: 0, crush: 0, range: 2,
    },
    defense: {
      stab: 2, slash: 3, crush: 4, range: 3,
    },
    graphics: {
      tileset: 'armor',
      row: 1,
      column: 7,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'leather-boots',
    name: 'Leather Boots',
    examine: 'Your feet are warm when you put these on. Not bad.',
    price: 14,
    type: 'armor',
    slot: 'feet',
    attack: {
      stab: 0, slash: 0, crush: 0, range: 1,
    },
    defense: {
      stab: 0, slash: 2, crush: 1, range: 2,
    },
    graphics: {
      tileset: 'armor',
      row: 2,
      column: 7,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'leather-gloves',
    name: 'Leather Gloves',
    examine: 'Warm gloves for your hands in the winter or anywhere really.',
    price: 5,
    type: 'armor',
    slot: 'gloves',
    attack: {
      stab: 0, slash: 0, crush: 0, range: 1,
    },
    defense: {
      stab: 0, slash: 1, crush: 3, range: 1,
    },
    graphics: {
      tileset: 'armor',
      row: 3,
      column: 7,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'leather-body',
    name: 'Leather Body',
    examine: 'Leather body made for combat.',
    price: 17,
    type: 'armor',
    slot: 'armor',
    attack: {
      stab: 0, slash: 0, crush: 0, range: 2,
    },
    defense: {
      stab: 8, slash: 9, crush: 10, range: 10,
    },
    graphics: {
      tileset: 'armor',
      row: 4,
      column: 7,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'hard-leather-cowl',
    name: 'Hard Leather Cowl',
    examine: 'Your head seems more covered with harder leather to boot.',
    price: 35,
    type: 'armor',
    slot: 'head',
    attack: {
      stab: 0, slash: 0, crush: 0, range: 2,
    },
    defense: {
      stab: 12, slash: 13, crush: 14, range: 13,
    },
    graphics: {
      tileset: 'armor',
      row: 1,
      column: 8,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'hard-leather-boots',
    name: 'Hard Leather Boots',
    examine: 'Made for rougher-wear combat and agile movements.',
    price: 34,
    type: 'armor',
    slot: 'feet',
    attack: {
      stab: 0, slash: 0, crush: 0, range: 1,
    },
    defense: {
      stab: 10, slash: 12, crush: 11, range: 12,
    },
    graphics: {
      tileset: 'armor',
      row: 2,
      column: 8,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'hard-leather-gloves',
    name: 'Hard Leather Gloves',
    examine: 'Used by rangers alike who wage war upon their enemies.',
    price: 25,
    type: 'armor',
    slot: 'gloves',
    attack: {
      stab: 0, slash: 0, crush: 0, range: 1,
    },
    defense: {
      stab: 10, slash: 11, crush: 13, range: 11,
    },
    graphics: {
      tileset: 'armor',
      row: 3,
      column: 8,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'hard-leather-body',
    name: 'Hard Leather Body',
    examine: 'Seems like it could block almost anywhere. Very stiff and hard.',
    price: 37,
    type: 'armor',
    slot: 'armor',
    attack: {
      stab: 0, slash: 0, crush: 0, range: 2,
    },
    defense: {
      stab: 18, slash: 19, crush: 20, range: 23,
    },
    graphics: {
      tileset: 'armor',
      row: 4,
      column: 8,
    },
    actions: presetActions(['wearable']),
  },
  // Range
  {
    id: 'ranger-hat',
    name: 'Ranger Hat',
    examine: 'Used by the toughest of rangers.',
    price: 125,
    type: 'armor',
    slot: 'head',
    attack: {
      stab: 0, slash: 0, crush: 0, range: 2,
    },
    defense: {
      stab: 32, slash: 40, crush: 44, range: 43,
    },
    graphics: {
      tileset: 'armor',
      row: 1,
      column: 13,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'ranger-boots',
    name: 'Ranger Boots',
    examine: 'These boots are made for killing with bows.',
    price: 134,
    type: 'armor',
    slot: 'feet',
    attack: {
      stab: 0, slash: 0, crush: 0, range: 1,
    },
    defense: {
      stab: 30, slash: 32, crush: 31, range: 32,
    },
    graphics: {
      tileset: 'armor',
      row: 2,
      column: 13,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'ranger-gloves',
    name: 'Ranger Gloves',
    examine: 'Worn by archers and rangers whose accuracy kills without fail.',
    price: 125,
    type: 'armor',
    slot: 'gloves',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: 1,
      },
      defense: {
        stab: 30, slash: 31, crush: 33, range: 31,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 3,
      column: 13,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'ranger-body',
    name: 'Ranger Body',
    examine: 'This was said to be worn by the legendary Robin Hood.',
    price: 137,
    type: 'armor',
    slot: 'armor',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: 2,
      },
      defense: {
        stab: 38, slash: 39, crush: 30, range: 43,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 4,
      column: 13,
    },
    actions: presetActions(['wearable']),
  },
  // Training
  {
    id: 'wooden-shield',
    name: 'Wooden Shield',
    examine: 'A starter shield made of wood.',
    price: 8,
    type: 'armor',
    slot: 'left_hand',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: 2,
      },
      defense: {
        stab: 4, slash: 5, crush: 3, range: 4,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 11,
      column: 0,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'training-shield',
    name: 'Training Shield',
    examine: 'Good shield to use once you have ground footing',
    price: 13,
    type: 'armor',
    slot: 'armor',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: 2,
      },
      defense: {
        stab: 7, slash: 9, crush: 7, range: 6,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 11,
      column: 1,
    },
    actions: presetActions(['wearable']),
  },
  // Magic
  // 1. Robes
  {
    id: 'robe-of-fire',
    name: 'Robe of Fire',
    examine: 'A robe that imbues the Fire diety.',
    price: 35000,
    type: 'armor',
    slot: 'armor',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: -10,
      },
      defense: {
        stab: 20, slash: 15, crush: 29, range: 10,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 15,
      column: 0,
    },
    actions: presetActions(['wearable']),
  },
  // 2. Hats
  {
    id: 'heiyah-hat',
    name: 'Heiyah\'s Hat',
    examine: 'The hat worn by Heiyah when he roamed the lands.',
    price: 45000,
    type: 'armor',
    slot: 'armor',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: 0,
      },
      defense: {
        stab: 20, slash: 15, crush: 29, range: 10,
      },
    },
    graphics: {
      tileset: 'armor',
      row: 15,
      column: 0,
    },
    actions: presetActions(['wearable']),
  },
];
