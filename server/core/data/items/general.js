import { presetActions } from '@server/core/data/helpers/database';

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
    prohibited: true,
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
  // Logs
  {
    id: 'logs',
    name: 'Logs',
    examine: 'I can burn these.',
    price: 5,
    type: 'log',
    graphics: {
      tileset: 'general',
      row: 4,
      column: 5,
    },
    actions: presetActions([
      'resource',
    ]),
  },
  // Other
  {
    id: 'hammer',
    name: 'Hammer',
    examine: 'I can meld bars with the right hits into weaponry and armory.',
    price: 12,
    type: 'blunt',
    graphics: {
      tileset: 'general',
      row: 2,
      column: 0,
    },
    actions: presetActions([
      'resource',
      'smith',
    ]),
  },
  {
    id: 'knife',
    name: 'Knife',
    examine: 'Sharp and edgy. Just like my teenage self...',
    price: 5,
    type: 'sharp',
    graphics: {
      tileset: 'general',
      row: 2,
      column: 1,
    },
    actions: presetActions([
      'resource',
    ]),
  },
  {
    id: 'lantern',
    name: 'Lantern',
    examine: 'A lot more useful when lit.',
    price: 20,
    type: 'light',
    graphics: {
      tileset: 'general',
      row: 3,
      column: 0,
    },
    actions: presetActions([
      'resource',
    ]),
  },
];
