import bus from '../utilities/bus';
import UI from '../utilities/ui';

class Actions {
  constructor(data) {
    this.player = data.player;
    this.board = data.board;

    bus.$on('ITEM:DO', Actions.do);
  }

  /**
   * Execute the certain action by checking (if allowed)
   *
   * @param {object} data Information of tile, Action class and items
   */
  static do(data) {
    const item = data.item;
    const { player, board } = data.actions;
    const clickedTile = data.tile;

    switch (item) {
      // eslint-disable-next-line no-case-declarations
      case 'Walk here':
        // eslint-disable-next-line
        const tile = UI.getTileOverMouse(board, player.x, player.y, clickedTile.x, clickedTile.y);
        const tileWalkable = UI.tileWalkable(tile);

        if (tileWalkable) {
          const coordinates = { x: clickedTile.x, y: clickedTile.y };
          bus.$emit('PLAYER:MOVE', coordinates);
        }
        break;
      default:
      case 'Cancel':
        break;
    }
  }

  /**
   * Build the context-menu list items
   */
  static build() {
    return new Promise((resolve) => {
      let list = 0;
      const allActions = Actions.list();
      const actionableItems = [];

      do {
        const action = allActions[list];
        const result = Actions.check(action);
        if (result) {
          actionableItems.push(action);
        }
        list += 1;
      } while (list < allActions.length);

      resolve(actionableItems);
    });
  }

  /**
   * Check to see if the list item is needed in list
   *
   * @param {string} action The item being checked
   * @returns {boolean}
   */
  static check(action) {
    switch (action) {
      case 'Walk here':
        // Walk here (1 of 2) actions always enabled
        return true;
      default:
      case 'Cancel':
        // Cancel (2 of 2) actions always enabled
        return true;
    }
  }

  /**
   * The list of actionable items
   *
   * @returns {array}
   */
  static list() {
    return [
      'Walk here',
      'Cancel',
    ];
  }
}

export default Actions;
