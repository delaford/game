module.exports = [
  {
    id: 0,
    name: 'Bronze Sword',
    examine: 'A sword made of Bronze.',
    price: 15,
    type: 'weapon',
    slot: 'right_hand',
    wearable: 'sword',
    attack: 3,
    graphics: {
      tileset: 'weapons',
      row: 0,
      column: 0,
    },
    actions: [
      'take',
      'examine',
      'drop',
      'equip',
    ],
    stackable: false,
  },
  {
    id: 1,
    name: 'Bronze Axe',
    examine: 'An axe made for chopping.',
    price: 11,
    type: 'weapon',
    slot: 'right_hand',
    wearable: 'sword',
    attack: 4,
    graphics: {
      tileset: 'weapons',
      row: 0,
      column: 1,
    },
    actions: [
      'take',
      'examine',
      'drop',
      'equip',
    ],
    functions: [
      'chop',
    ],
    stackable: false,
  },
];
