/**
 * Welcome to where the world of Delaford lives.
 *
 * All mutable items go here such as players on the map,
 * items dropped on the map, the NPCs active and so on.
 */

module.exports = {
  socket: {},
  map: {
    foreground: [],
    background: [],
  },
  npcs: [],
  items: [],
  respawns: {
    items: [],
    monsters: [],
    resources: [],
  },
  monsters: [],
  players: [],
  clients: [],
};
