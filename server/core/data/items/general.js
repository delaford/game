import { presetActions } from '../helpers/database';

export default [
  // Coins
  {
    id: 'coins',
    name: 'Coins',
    examine: 'Precious money.',
    price: false,
    type: 'currency',
    stackable: true,
    graphics: {
      tileset: 'general',
      row: 0,
      column: 0,
      levels: [1, 10, 100, 1000],
    },
  },
  // Ores
  {
    id: 'copper-ore',
    name: 'Copper Ore',
    examine: 'With the right ores, I can smelt this.',
    price: 9,
    type: 'ore',
    graphics: {
      tileset: 'general',
      row: 1,
      column: 5,
    },
    actions: presetActions([
      'resource',
    ]),
  },
  {
    id: 'tin-ore',
    name: 'Tin Ore',
    examine: 'Tin and something else... make Bronze, I think.',
    price: 10,
    type: 'ore',
    graphics: {
      tileset: 'general',
      row: 1,
      column: 6,
    },
    actions: presetActions([
      'resource',
    ]),
  },
];
