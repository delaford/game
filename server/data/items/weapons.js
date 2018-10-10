const path = require('path');

const fileName = path.basename(__filename, '.js');

const database = require('../helpers/database');

module.exports = [{
  id: 'bronze-sword',
  name: 'Bronze Sword',
  examine: 'A sword made of Bronze.',
  price: 15,
  type: 'weapon',
  slot: 'right_hand',
  wearable: 'sword',
  stats: {
    attack: 3,
    defense: 1,
  },
  graphics: {
    tileset: database.loadTileset(fileName),
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
{
  id: 'bronze-axe',
  name: 'Bronze Axe',
  examine: 'An axe made for chopping.',
  price: 11,
  type: 'weapon',
  slot: 'right_hand',
  wearable: 'sword',
  stats: {
    attack: 4,
    defense: 2,
  },
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
    'unequip',
  ],
  functions: [
    'chop',
  ],
  stackable: false,
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
    attack: 2,
    defense: 0,
  },
  graphics: {
    tileset: 'weapons',
    row: 0,
    column: 2,
  },
  actions: [
    'take',
    'examine',
    'drop',
    'equip',
    'unequip',
  ],
  functions: [
    //
  ],
  stackable: false,
},
{
  id: 'bronze-pickaxe',
  name: 'Bronze Pickaxe',
  examine: 'A versatile pickaxe for mining.',
  price: 13,
  type: 'weapon',
  slot: 'right_hand',
  wearable: 'sword',
  stats: {
    attack: 4,
    defense: 4,
  },
  graphics: {
    tileset: 'weapons',
    row: 0,
    column: 3,
  },
  actions: [
    'take',
    'examine',
    'drop',
    'equip',
    'unequip',
  ],
  functions: [
    //
  ],
  stackable: false,
}];

