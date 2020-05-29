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
