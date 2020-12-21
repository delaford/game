import { presetActions } from '@server/core/data/helpers/database';

// TODO
// Find out why hovering over furnace grid shows inventyory grid items

export default [
  {
    id: 'bronze-bar',
    name: 'Bronze Bar',
    examine: 'Make bronze items out of this.',
    experience: 7,
    price: 9,
    function: 'smith-bar',
    resources: null,
    actions: presetActions(['furnace', 'resource']),
    graphics: {
      tileset: 'general',
      row: 2,
      column: 5,
    },
    type: 'smith',
  },
  {
    id: 'iron-bar',
    name: 'Iron Bar',
    examine: 'Able to smith and forge stronger items out of iron.',
    experience: 11,
    price: 30,
    function: 'smith-bar',
    resources: null,
    actions: presetActions(['furnace', 'resource']),
    graphics: {
      tileset: 'general',
      row: 2,
      column: 7,
    },
    type: 'smith',
  },
  {
    id: 'steel-bar',
    name: 'Steel Bar',
    examine:
      'Astoundingly expensive and very strong steel. Lots of possibilities.',
    experience: 16,
    price: 150,
    function: 'smith-bar',
    resources: null,
    actions: presetActions(['furnace', 'resource']),
    graphics: {
      tileset: 'general',
      row: 2,
      column: 8,
    },
    type: 'smith',
  },
  {
    id: 'silver-bar',
    name: 'Silver Bar',
    examine: 'Pretty and durable. Might be usable for jewelry and tools?',
    experience: 13,
    price: 100,
    function: 'smith-bar',
    resources: null,
    actions: presetActions(['furnace', 'resource']),
    graphics: {
      tileset: 'general',
      row: 2,
      column: 9,
    },
    type: 'smith',
  },
  {
    id: 'gold-bar',
    name: 'Gold Bar',
    examine:
      'Heavy and shiny. Perhaps can be used for making rings and necklaces.',
    experience: 20,
    price: 2500,
    function: 'smith-bar',
    resources: null,
    actions: presetActions(['furnace', 'resource']),
    graphics: {
      tileset: 'general',
      row: 2,
      column: 10,
    },
    type: 'smith',
  },
  {
    id: 'jatite-bar',
    name: 'Jatite Bar',
    examine: 'Strange new mineral, what can I build with this?',
    experience: 27,
    price: 1000,
    function: 'smith-bar',
    resources: null,
    actions: presetActions(['furnace', 'resource']),
    graphics: {
      tileset: 'general',
      row: 2,
      column: 11,
    },
    type: 'smith',
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
    actions: presetActions(['resource']),
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
    actions: presetActions(['resource']),
  },
];
