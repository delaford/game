const actions = [
  {
    name: 'Take',
    onElement: ['gameMap'],
    target: ['item'],
  },
  {
    name: 'Examine',
    onElement: ['gameMap', 'inventorySlot'],
    target: 'anything',
  },
  {
    name: 'Drop',
    onElement: ['inventorySlot'],
    target: ['item'],
  },
];

export default actions;
