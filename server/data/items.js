module.exports = [
  {
    id: 0,
    name: 'Bronze Sword',
    examine: 'A sword made of strong Bronze.',
    price: 15,
    type: 'weapon',
    wearable: 'sword',
    attack: 3,
    column: 0,
    graphics: {
      tileset: 'weapons',
      row: 0,
      column: 0,
    },
    tileset: 'weapons',
    actions: [
      'take',
      'examine',
    ],
    stackable: false,
  },
];
