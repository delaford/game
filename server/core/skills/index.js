export default class Skill {
  constructor(playerId) {
    this.playerId = playerId;
  }

  updateExperience() {
    console.log(`Updating experience for ${this.playerId}`);
  }
}
