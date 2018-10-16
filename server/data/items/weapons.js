import { presetActions } from '../helpers/database';
// Jatite

// Pavise (sq shield)
export default [
  // Bronze weaponry
  {
    id: 'bronze-sword',
    name: 'Bronze Sword',
    examine: 'A sword made of Bronze.',
    price: 15,
    type: 'weapon',
    slot: 'right_hand',
    wearable: 'sword',
    stats: {
      attack: {
        stab: 4, slash: 3, crush: -2, range: 0,
      },
      defense: {
        stab: 0, slash: 2, crush: 1, range: 0,
      },
    },
    graphics: {
      tileset: 'weapons',
      row: 0,
      column: 0,
    },
    actions: presetActions([
      'wearable',
    ]),
  },
  {
    id: 'bronze-axe',
    name: 'Bronze Axe',
    examine: 'An axe made for chopping.',
    price: 9,
    type: 'weapon',
    slot: 'right_hand',
    wearable: 'sword',
    stats: {
      attack: {
        stab: -2, slash: 4, crush: 2, range: 0,
      },
      defense: {
        stab: 0, slash: 1, crush: 0, range: 0,
      },
    },
    graphics: {
      tileset: 'weapons',
      row: 0,
      column: 1,
    },
    actions: presetActions([
      'wearable',
      'axe',
    ]),
  },
  {
    id: 'bronze-pickaxe',
    name: 'Bronze Pickaxe',
    examine: 'A versatile pickaxe for mining.',
    price: 5,
    type: 'weapon',
    slot: 'right_hand',
    wearable: 'sword',
    stats: {
      attack: {
        stab: 4, slash: -2, crush: 2, range: 0,
      },
      defense: {
        stab: 0, slash: 1, crush: 0, range: 0,
      },
    },
    graphics: {
      tileset: 'weapons',
      row: 0,
      column: 2,
    },
    actions: presetActions([
      'wearable',
      'pickaxe',
    ]),
  },
  {
    id: 'bronze-dagger',
    name: 'Bronze Dagger',
    examine: 'An short and sturdy dagger.',
    price: 9,
    type: 'weapon',
    slot: 'right_hand',
    wearable: 'sword',
    stats: {
      attack: {
        stab: 4, slash: 2, crush: 4, range: 0,
      },
      defense: {
        stab: 0, slash: 1, crush: 0, range: 1,
      },
    },
    graphics: {
      tileset: 'weapons',
      row: 0,
      column: 3,
    },
    actions: presetActions([
      'wearable',
    ]),
  },
  {
    id: 'bronze-mace',
    name: 'Bronze Mace',
    examine: 'This mace is pointy to the touch.',
    price: 10,
    type: 'weapon',
    slot: 'right_hand',
    wearable: 'sword',
    stats: {
      attack: {
        stab: 1, slash: -2, crush: 6, range: 0,
      },
      defense: {
        stab: 0, slash: 1, crush: 0, range: 1,
      },
    },
    graphics: {
      tileset: 'weapons',
      row: 0,
      column: 4,
    },
    actions: presetActions([
      'wearable',
    ]),
  },
  {
    id: 'bronze-battleaxe',
    name: 'Bronze Battleaxe',
    examine: 'An axe made for war.',
    price: 31,
    type: 'weapon',
    slot: 'right_hand',
    wearable: 'sword',
    stats: {
      attack: {
        stab: -2, slash: 6, crush: 3, range: 0,
      },
      defense: {
        stab: 0, slash: 1, crush: 0, range: 1,
      },
    },
    graphics: {
      tileset: 'weapons',
      row: 0,
      column: 5,
    },
    actions: presetActions([
      'wearable',
    ]),
  },
  {
    id: 'bronze-halberd',
    name: 'Bronze Halberd',
    examine: 'It is a halberd made of bronze alloy metal. Ta-dah. Long and sharp.',
    price: 41,
    type: 'weapon',
    slot: 'right_hand',
    wearable: 'sword',
    stats: {
      attack: {
        stab: 7, slash: 10, crush: 0, range: 0,
      },
      defense: {
        stab: -1, slash: 1, crush: 2, range: 0,
      },
    },
    graphics: {
      tileset: 'weapons',
      row: 0,
      column: 6,
    },
    actions: presetActions([
      'wearable',
    ]),
    twoHanded: true,
  },
  {
    id: 'bronze-warhammer',
    name: 'Bronze Warhammer',
    examine: 'A hammer made with bronze for its head.',
    price: 34,
    type: 'weapon',
    slot: 'right_hand',
    wearable: 'sword',
    stats: {
      attack: {
        stab: 0, slash: -2, crush: 11, range: 0,
      },
      defense: {
        stab: 0, slash: 1, crush: 1, range: 0,
      },
    },
    graphics: {
      tileset: 'weapons',
      row: 0,
      column: 7,
    },
    actions: presetActions([
      'wearable',
    ]),
    twoHanded: true,
  },
  {
    id: 'bronze-spear',
    name: 'Bronze Spear',
    examine: 'It is a spear tipped with bronze.',
    price: 15,
    type: 'weapon',
    slot: 'right_hand',
    wearable: 'sword',
    stats: {
      attack: {
        stab: 11, slash: 5, crush: 0, range: 0,
      },
      defense: {
        stab: 0, slash: 1, crush: 0, range: 0,
      },
    },
    graphics: {
      tileset: 'weapons',
      row: 0,
      column: 8,
    },
    actions: presetActions([
      'wearable',
    ]),
    twoHanded: true,
  },
  // Iron weaponry
  {
    id: 'iron-sword',
    name: 'Iron Sword',
    examine: 'What a sharp pointy stick. Sturdy.',
    price: 54,
    type: 'weapon',
    slot: 'right_hand',
    wearable: 'sword',
    stats: {
      attack: {
        stab: 6, slash: 4, crush: -2, range: 0,
      },
      defense: {
        stab: 0, slash: 3, crush: 2, range: 0,
      },
    },
    graphics: {
      tileset: 'weapons',
      row: 1,
      column: 0,
    },
    actions: presetActions([
      'wearable',
    ]),
  },
  {
    id: 'iron-axe',
    name: 'Iron Axe',
    examine: 'An axe made for lumberjacks.',
    price: 33,
    type: 'weapon',
    slot: 'right_hand',
    wearable: 'sword',
    stats: {
      attack: {
        stab: -2, slash: 5, crush: 3, range: 0,
      },
      defense: {
        stab: 0, slash: 1, crush: 0, range: 0,
      },
    },
    graphics: {
      tileset: 'weapons',
      row: 0,
      column: 1,
    },
    actions: presetActions([
      'wearable',
      'axe',
    ]),
  },
  {
    id: 'iron-pickaxe',
    name: 'Iron Pickaxe',
    examine: 'A pickaxe made to do a miner\'s job.',
    price: 120,
    type: 'weapon',
    slot: 'right_hand',
    wearable: 'sword',
    stats: {
      attack: {
        stab: 5, slash: -2, crush: 2, range: 0,
      },
      defense: {
        stab: 0, slash: 1, crush: 2, range: 0,
      },
    },
    graphics: {
      tileset: 'weapons',
      row: 1,
      column: 2,
    },
    actions: presetActions([
      'wearable',
      'pickaxe',
    ]),
  },
  {
    id: 'iron-dagger',
    name: 'Iron Dagger',
    examine: 'Deadly. Short. Concealable.',
    price: 35,
    type: 'weapon',
    slot: 'right_hand',
    wearable: 'sword',
    stats: {
      attack: {
        stab: 5, slash: 3, crush: -4, range: 0,
      },
      defense: {
        stab: 0, slash: 0, crush: 0, range: 3,
      },
    },
    graphics: {
      tileset: 'weapons',
      row: 1,
      column: 3,
    },
    actions: presetActions([
      'wearable',
    ]),
  },
  {
    id: 'iron-mace',
    name: 'Iron Mace',
    examine: 'This is mace made out of Iron.',
    price: 31,
    type: 'weapon',
    slot: 'right_hand',
    wearable: 'sword',
    stats: {
      attack: {
        stab: 4, slash: -2, crush: 9, range: 0,
      },
      defense: {
        stab: 0, slash: 0, crush: 0, range: 1,
      },
    },
    graphics: {
      tileset: 'weapons',
      row: 1,
      column: 4,
    },
    actions: presetActions([
      'wearable',
    ]),
  },
  {
    id: 'iron-battleaxe',
    name: 'Iron Battleaxe',
    examine: 'This a battleaxe forged from iron metal alloys.',
    price: 30,
    type: 'weapon',
    slot: 'right_hand',
    wearable: 'sword',
    stats: {
      attack: {
        stab: -2, slash: 8, crush: 5, range: 0,
      },
      defense: {
        stab: 0, slash: 1, crush: 0, range: 2,
      },
    },
    graphics: {
      tileset: 'weapons',
      row: 1,
      column: 5,
    },
    actions: presetActions([
      'wearable',
    ]),
  },
  {
    id: 'iron-halberd',
    name: 'Iron Halberd',
    examine: 'It is a halberd intertwined with metal alloys of Iron.',
    price: 56,
    type: 'weapon',
    slot: 'right_hand',
    wearable: 'sword',
    stats: {
      attack: {
        stab: 9, slash: 12, crush: 0, range: 0,
      },
      defense: {
        stab: -1, slash: 1, crush: 2, range: 0,
      },
    },
    graphics: {
      tileset: 'weapons',
      row: 1,
      column: 6,
    },
    actions: presetActions([
      'wearable',
    ]),
    twoHanded: true,
  },
  {
    id: 'iron-warhammer',
    name: 'Iron Warhammer',
    examine: 'A hammer sprinkled with some Iron.',
    price: 34,
    type: 'weapon',
    slot: 'right_hand',
    wearable: 'sword',
    stats: {
      attack: {
        stab: 0, slash: -2, crush: 11, range: 0,
      },
      defense: {
        stab: 0, slash: 1, crush: 1, range: 0,
      },
    },
    graphics: {
      tileset: 'weapons',
      row: 0,
      column: 7,
    },
    actions: presetActions([
      'wearable',
    ]),
    twoHanded: true,
  },
  {
    id: 'iron-spear',
    name: 'Iron Spear',
    examine: 'Spear with Iron-made metals. Simple.',
    price: 54,
    type: 'weapon',
    slot: 'right_hand',
    wearable: 'sword',
    stats: {
      attack: {
        stab: 12, slash: 8, crush: 0, range: 0,
      },
      defense: {
        stab: 0, slash: 2, crush: 0, range: 0,
      },
    },
    graphics: {
      tileset: 'weapons',
      row: 1,
      column: 8,
    },
    actions: presetActions([
      'wearable',
    ]),
    twoHanded: true,
  },
];

