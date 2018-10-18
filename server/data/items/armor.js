import { presetActions } from '../helpers/database';

export default [
  // Capes
  {
    id: 'cape',
    name: 'Cape',
    examine: 'A regular cape.',
    price: 5,
    type: 'armor',
    slot: 'cape',
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
    slot: 'head',
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
    slot: 'shield',
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
    slot: 'shield',
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
    slot: 'shield',
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
    slot: 'shield',
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
  // Leather (set)
  {
    id: 'studded-leather-body',
    name: 'Studded Leather Body',
    examine: 'Leather body made of studs. Seems sturdy.',
    price: 17,
    type: 'armor',
    slot: 'armor',
    attack: {
      stab: 0, slash: 0, crush: 0, range: -10,
    },
    defense: {
      stab: 5, slash: 4, crush: 9, range: 10,
    },
    graphics: {
      tileset: 'armor',
      row: 4,
      column: 7,
    },
    actions: presetActions(['wearable']),
  },
  // Range

  // Magic
  // 1. Robes
  {
    id: 'robe',
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
    id: 'robe',
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
