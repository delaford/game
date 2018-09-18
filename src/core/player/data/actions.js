const actionList = [
  {
    name: 'Walk here',
    context: ['gameMap'],
    allow: true,
    nearby: false,
    weight: 1,
  },
  {
    name: 'Take',
    context: ['gameMap'],
    allow: ['item'],
    nearby: 'exact',
    weight: 2,
    queueable: true,
  },
  {
    name: 'Examine',
    context: ['gameMap', 'inventorySlot'],
    allow: ['npc', 'item'],
    nearby: false,
    weight: 5,
  },
  {
    name: 'Drop',
    context: ['inventorySlot'],
    allow: ['item'],
    nearby: false,
    weight: 99,
  },
  {
    name: 'Equip',
    context: ['inventorySlot'],
    allow: ['item'],
    nearby: false,
    weight: 1,
  },
  {
    name: 'Unequip',
    context: ['swordEquipped'],
    allow: ['item'],
    nearby: false,
    weight: 1,
  },
];

export default actionList;
