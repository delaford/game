import { presetActions } from '../helpers/database';
// Jatite

// Pavise (sq shield)
export default [{
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
  stackable: false,
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
  stackable: false,
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
    column: 1,
  },
  actions: presetActions([
    'wearable',
    'pickaxe',
  ]),
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
  stackable: false,
}];

