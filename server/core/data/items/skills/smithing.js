import { presetActions } from '@server/core/data/helpers/database';

// TODO
// Find out why hovering over furnace grid shows inventyory grid items

export default [
  {
    id: 'bronze-bar',
    name: 'Bronze Bar',
    examine: 'Make bronze items out of this.',
    experience: null,
    function: 'smith-bar',
    resources: null,
    actions: presetActions(['smith-bars']),
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
    experience: null,
    function: 'smith-bar',
    resources: null,
    actions: presetActions(['smith-bars']),
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
    examine: 'Astoundingly expensive and very strong steel. Lots of possibilities.',
    experience: null,
    function: 'smith-bar',
    resources: null,
    actions: presetActions(['smith-bars']),
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
    experience: null,
    function: 'smith-bar',
    resources: null,
    actions: presetActions(['smith-bars']),
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
    examine: 'Heavy and shiny. Perhaps can be used for making rings and necklaces.',
    experience: null,
    function: 'smith-bar',
    resources: null,
    actions: presetActions(['smith-bars']),
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
    experience: null,
    function: 'smith-bar',
    resources: null,
    actions: presetActions(['smelt-bars']),
    graphics: {
      tileset: 'general',
      row: 2,
      column: 11,
    },
    type: 'smith',
  },
];
