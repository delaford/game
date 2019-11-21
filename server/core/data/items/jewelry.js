import { presetActions } from '@server/core/data/helpers/database';

export default [
  // Amulets
  {
    id: 'garnet-amulet',
    name: 'Garnet Amulet',
    examine: 'An amulet with a garnet gemstone.',
    price: 1250,
    type: 'armor',
    slot: 'necklace',
    stats: {
      attack: {
        stab: 23, slash: 22, crush: 13, range: 1,
      },
      defense: {
        stab: 24, slash: 25, crush: 13, range: 4,
      },
    },
    graphics: {
      tileset: 'jewelry',
      row: 0,
      column: 0,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'tanzanite-amulet',
    name: 'Tanzanite Amulet',
    examine: 'An amulet forged with a tanzanite gem.',
    price: 1950,
    type: 'armor',
    slot: 'necklace',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 33, range: 1,
      },
      defense: {
        stab: 31, slash: 32, crush: 31, range: 24,
      },
    },
    graphics: {
      tileset: 'jewelry',
      row: 0,
      column: 1,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'hematite-amulet',
    name: 'Hematite Amulet',
    examine: 'This strange amulet imbues some kind of luck...',
    price: 25000,
    type: 'armor',
    slot: 'necklace',
    stats: {
      attack: {
        stab: 20, slash: 20, crush: 23, range: 1,
      },
      defense: {
        stab: 30, slash: 28, crush: 22, range: 14,
      },
    },
    graphics: {
      tileset: 'jewelry',
      row: 0,
      column: 2,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'peridot-amulet',
    name: 'Peridot Amulet',
    examine: 'This amulet once bore the tradition in archery.',
    price: 20000,
    type: 'armor',
    slot: 'necklace',
    stats: {
      attack: {
        stab: 0, slash: 0, crush: 0, range: 32,
      },
      defense: {
        stab: 0, slash: 0, crush: 0, range: 31,
      },
    },
    graphics: {
      tileset: 'jewelry',
      row: 0,
      column: 3,
    },
    actions: presetActions(['wearable']),
  },
  // Rings
  {
    id: 'ring',
    name: 'Ring',
    examine: 'Standard brass ring.',
    price: 5,
    type: 'armor',
    slot: 'ring',
    stats: {
      attack: {
        stab: 1, slash: 1, crush: 1, range: 1,
      },
      defense: {
        stab: 1, slash: 0, crush: 1, range: 1,
      },
    },
    graphics: {
      tileset: 'jewelry',
      row: 5,
      column: 0,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'gold-ring',
    name: 'Gold Ring',
    examine: 'Shiny gold ring. Fetches a pretty dollar, I hear.',
    price: 20,
    type: 'armor',
    slot: 'ring',
    stats: {
      attack: {
        stab: 3, slash: 3, crush: 3, range: 3,
      },
      defense: {
        stab: 3, slash: 3, crush: 3, range: 3,
      },
    },
    graphics: {
      tileset: 'jewelry',
      row: 5,
      column: 1,
    },
    actions: presetActions(['wearable']),
  },
  {
    id: 'tanzanite-ring',
    name: 'Tanzanite Ring',
    examine: 'This shiny, blue ring yields a certin aurora of accuracy.',
    price: 2000,
    type: 'armor',
    slot: 'ring',
    stats: {
      attack: {
        stab: 5, slash: 5, crush: 5, range: 5,
      },
      defense: {
        stab: 5, slash: 5, crush: 5, range: 5,
      },
    },
    graphics: {
      tileset: 'jewelry',
      row: 5,
      column: 2,
    },
    actions: presetActions(['wearable']),
  },
];
