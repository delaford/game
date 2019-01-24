export default class Skill {
  constructor(playerIndex) {
    this.playerIndex = playerIndex;
  }

  updateExperience() {
    console.log(`Updating experience for ${this.playerIndex}`);
  }
}
