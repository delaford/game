import UI from 'shared/ui';
import world from '@server/core/world';

class MapUtils {
  /**
   * Calculate whether the grid is walkable through various methods
   *
   * @param {array} tiles The tiles we are marking
   * @param {object} player The player for which we are working with
   * @param {integer} onTile On what tile did wil lthey walk from
   * @param {integer} row On what row are they on?
   * @param {integer} column On what column are they on?
   * @return {integer}
   */
  static gridWalkable(tiles, player, onTile, row = 0, column = 0) {
    // What's going on here? FG & BG collision
    let walkableTile = 0;

    // Get walkable status of both foreground and background tiles
    const walkable = {
      fg: UI.tileWalkable(tiles.foreground, 'foreground'),
      bg: UI.tileWalkable(tiles.background),
    };

    // Is the foreground not walkable?
    if (!walkable.fg) {
      walkableTile = 1; // Nope
    }

    // Is the foreground AND background walkable?
    if (walkable.fg && walkable.bg) {
      walkableTile = 0; // Yep.
    }

    // Is the foreground NOT walkable BUT the background is?
    if (!walkable.fg && walkable.bg) {
      walkableTile = 1;
    }

    // Is the foreground walkable BUT the background is not?
    if (walkable.fg && !walkable.bg) {
      // Is there no foreground tile?
      if ((world.map.foreground[onTile] - 1) === -1) {
        walkableTile = 1;
      } else {
        // If there is, then it is (because the BG is not walkable).
        walkableTile = 0;
      }
    }

    // If the action requires us to be on the "edge" of a tile
    // (eg: resource gathering, action tile, door push, etc.)
    // then let us temporarily make it 'walkable' so the pathfinding does its job
    // and then we will simply snip of the last step of the path so we are right next ot it.
    if (player.action && player.action.nearby === 'edge' && player.action.coordinates.x === row && player.action.coordinates.y === column) {
      walkableTile = 0;
    }

    return walkableTile;
  }
}

export default MapUtils;
