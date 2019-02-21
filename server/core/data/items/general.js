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
      quantityLevel: [1, 2, 3, 4, 5, 25, 100, 250, 1000, 10000],
    },
    actions: presetActions([
      'resource',
    ]),
    untradeable: false,
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
      row: 3,
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
      row: 3,
      column: 6,
    },
    actions: presetActions([
      'resource',
    ]),
  },
];
