module.exports = [
  {
    id: 1,
    name: 'Baynard',
    examine: 'Local town bum. Phew!',
    graphic: {
      row: 0,
      column: 0,
    },
    actions: [
      'examine',
    ],
    spawn: {
      x: 15,
      y: 111,
      range: 3,
    },
  },
  {
    id: 2,
    name: 'Shop keeper',
    examine: 'Sells and buys items in exchange for coins.',
    graphic: {
      row: 0,
      column: 1,
    },
    actions: [
      'trade',
      'examine',
    ],
    spawn: {
      x: 12,
      y: 116,
      range: 2,
    },
  },
  {
    id: 3,
    name: 'Ludovicus',
    examine: 'Woodhurst\'s cheerful town shopkeeper.',
    graphic: {
      row: 0,
      column: 2,
    },
    actions: [
      'examine',
      'trade',
    ],
    spawn: {
      x: 29,
      y: 109,
      range: 4,
    },
  },
  {
    id: 4,
    name: 'Bank gnome',
    examine: 'Helps with your finances and assets, I believe.',
    graphic: {
      row: 0,
      column: 3,
    },
    actions: [
      'examine',
      'bank',
    ],
    spawn: {
      x: 17,
      y: 105,
      range: 2,
    },
  },
];
