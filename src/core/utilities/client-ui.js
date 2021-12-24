import store from '../../store';

class ClientUI {
  /**
   * Update the client action with latest mouseover
   *
   * @param {object} incoming The data regarding the mouseover event
   */
  static displayFirstAction(incoming) {
    const { count } = incoming.data.data;
    if (count === -1) return;
    let { label } = incoming.data.data.firstItem;
    if (count > 0) label += ` / ${count} other options`;
    store.dispatch('setAction', {
      object: incoming.data.data.firstItem,
      label,
    });
  }
}

export default ClientUI;
