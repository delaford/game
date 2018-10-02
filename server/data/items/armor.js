module.exports = [{
  id: 'bronze-chainmail',
  name: 'Bronze Chainmail',
  examine: 'Small metal rings formed to a mesh made of Bronze..',
  price: 20,
  type: 'armor',
  slot: 'armor',
  wearable: 'armor',
  stats: {
    attack: 3,
    defense: 4,
  },
  graphics: {
    tileset: 'armor',
    row: 0,
    column: 0,
  },
  actions: [
    'take',
    'examine',
    'drop',
    'equip',
    'unequip',
  ],
  stackable: false,
},
];
