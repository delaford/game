import { presetActions } from '../helpers/database';

export default [{
  id: 280,
  name: 'Copper Rock',
  examine: 'Some copper ore might be here...',
  experience: 14,
  function: 'obtain-resource',
  resources: ['copper-ore'],
  actions: presetActions(['pickaxe']),
}];
