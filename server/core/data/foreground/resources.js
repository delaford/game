import { presetActions } from '../helpers/database';

export default [{
  id: 279,
  name: 'Rocks',
  examine: 'There seems to be no more ore left in this rock.',
  experience: 0,
  function: 'obtain-resource',
  resources: 'There is no ore left to mine on this rock',
  actions: presetActions(['pickaxe']),
  type: 'mine',
}, {
  id: 280,
  name: 'Copper Rocks',
  examine: 'Hard as rock and can prove valuable.',
  experience: 16,
  function: 'obtain-resource',
  resources: 'copper-ore',
  actions: presetActions(['pickaxe']),
  type: 'mine',
}, {
  id: 281,
  name: 'Tin Rocks',
  examine: 'It seems like something silvery.',
  experience: 16,
  function: 'obtain-resource',
  resources: 'tin-ore',
  actions: presetActions(['pickaxe']),
  type: 'mine',
}];
