import { presetActions } from '../helpers/database';

export default [{
  id: 280,
  name: 'Rocks',
  examine: 'Some kind of ore might be here...',
  experience: 14,
  function: 'obtain-resource',
  resources: ['copper-ore'],
  actions: presetActions(['pickaxe']),
}];
