export default {
  /**
   * A player receives NPC movements
   */
  'npc:movement': (data, context) => {
    context.npcMovement(data.data);
  },
};
