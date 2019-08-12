import store from '../../state';

class ClientUI {
  /**
   * Update the client action with latest mouseover
   *
   * @param {object} incoming The data regarding the mouseover event
   */
  static displayFirstAction(incoming) {
    const { count } = incoming.data.data;
    let { label } = incoming.data.data.firstItem;
    if (count > 0) label += ` / ${count} other options`;
    store.commit('set_action', {
      object: incoming.data.data.firstItem,
      label,
    });
  }
}

export default ClientUI;
