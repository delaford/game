import { map } from '../config';

class UI {
  /**
   * Calculates the current mouse position in pixels from the canvas
   *
   * @param {*} event The event dispatched when a mouseover fires
   * @return {object} The x,y coordinates of the mouse on the canvas viewport
   */
  static getMousePos(event) {
    const rect = event.currentTarget.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  /**
   * Gets the current tile ID where the mouse is currently hovering over on the canvas
   *
   * @param {array} board The elements of the board
   * @param {integer} playerX The current x-axis of the player
   * @param {integer} playerY The current y-axis of the player
   * @param {integer} mouseX The current x-axis of the mouse on the viewport
   * @param {integer} mouseY The current y-axis of the mouse on the viewport
   */
  static getTileOverMouse(board, playerX, playerY, mouseX, mouseY) {
    return board[(((mouseY + (playerY - 5)) * map.size.x) + mouseX) + (playerX - 7)] - 1;
  }

  /**
   * Checks to see if the tile can be walked through or not
   *
   * @param {integer} tile The ID of the tile
   * @returns {boolean}
   */
  static tileWalkable(tile) {
    return map.tileset.blocked.indexOf(tile) === -1;
  }

  /**
   * Find which way for the player to move next for pathfinding
   *
   * @param {object} steps The steps of the current and next in the iteration
   * @returns {boolean}
   */
  static getMovementDirection(steps) {
    const currentX = steps.current.x;
    const currentY = steps.current.y;
    const nextX = steps.next.x;
    const nextY = steps.next.y;
    let direction = null;

    if (nextX === currentX && nextY < currentY) direction = 'up';
    if (nextX === currentX && nextY > currentY) direction = 'down';
    if (nextX > currentX && nextY === currentY) direction = 'right';
    if (nextX < currentX && nextY === currentY) direction = 'left';

    return direction;
  }

  /**
   * Calculate the x,y position on the viewport when clicked on canvas
   *
   * @param {event} event The mouse-click on the game viewport
   * @returns {object}
   */
  static getViewportCoordinaes(event) {
    const { tile } = map.tileset;

    const coordinates = {
      x: Math.floor(this.getMousePos(event).x / tile.width),
      y: Math.floor(this.getMousePos(event).y / tile.height),
    };

    return coordinates;
  }
}

export default UI;
