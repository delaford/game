import world from '@server/core/world';
import Skill from './index';

export default class Smithing extends Skill {
  constructor(playerIndex, ores) {
    super(playerIndex);
    this.player = world.players[playerIndex];
    this.ores = ores;
    this.columnId = 'smithing';
  }
}
