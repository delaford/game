<p align="center">
  <img src="https://github.com/Delaford/game/raw/master/src/assets/github/logo.png"/>
</p>

<p align="center">
  <strong>Welcome to Delaford. An online, 2D medieval game using JavaScript and HTML5.</strong>

  <img width="704" alt="Game screenshot" src="https://cdn.rawgit.com/delaford/game/20980644/src/assets/github/readme_hero.png">
</p>

## Getting Started

First, fork the repository. Then, go into your favorite terminal.

    git clone git@github.com:YOUR_USERNAME/game.git
    cd game
    npm install
    npm run serve

> `npm run serve` will start the development server and watch for changes on the client-side code inside the `src` folder and otherwise elsewhere applicable.

Now, while still inside `game`, you can start the Node.js server by typing `npm run ndb` and then starting the `dev_server` script on the left-hand side.

Or, alternatively, if you want to skip `ndb`, just do `node server.js` from the root and you should be go to go.

> `ndb` is Google Chrome's Node Debugging tool which allows node programs to be easily debugged and see all its context and variables. Highly recommended for a much easier time.

Now you may visit `http://localhost:8080` to login and start developing!

## Contributing

Please check out our [CONTRIBUTING.md](https://github.com/Delaford/game/blob/master/.github/CONTRIBUTING.md) guide on how you can actively participate in the development of this medieval game. It's pretty easy and fun!

## Systems and Engines

Here are the types of things I will be adding as a minimum viable product (alpha). Not too over the top but enough to cover the basics until more is added. Each section links to a project which will contain its sub-tasks within.

### What does a checkmark mean?

When an item is checkmarked, it means the basic foundation is in place. Sometimes, however, it is not fully complete. For example, Inventory is checkmarked but the inventory currently only supports weapons. You cna help fix that.

- [Player](https://github.com/Delaford/game/projects/1)
  - [x] Walking / pathfinding
  - [ ] Context-menu / Actions*
  - [ ] Health and stats
  - [ ] Inventory*
  - [ ] Character wear*
  - [ ] Your first quest
- [User Interface](https://github.com/Delaford/game/projects/2)
  - [x] Inventory tab
  - [ ] Quests tab
  - [x] Chatbox (for players and actions)
  - [x] Character wear tab
  - [x] Overall look &amp; feel
- [NPC](https://github.com/Delaford/game/projects/3)
  - [ ] Trading
  - [x] Walking around
  - [x] Talking
  - [ ] Examine
- [Monsters](https://github.com/Delaford/game/projects/3)
  - [ ] Battle System
  - [ ] Looting
  - [ ] Spawning
- [Networking](https://github.com/Delaford/game/projects/5)
  - [X] Player connect to server
  - [X] Non-playable characters
  - [ ] Monsters
  - [X] Items
  - [ ] Minor networking tweaks / alpha-stage

> Items marked with an asterisk (*) are started but have not been finalized or finished.

Once all of these items are checked, Delaford will be stable without breaking changes.

## Debugging

Learning how to debug in this game is critical in order to interact with the Node.js server and to the client. Your primary source should be the [ndb](https://github.com/GoogleChromeLabs/ndb) tool from Google. It is an improved debugging experience witch __drastically__ improved client-side debugging.

Read more at [DEBUGGING.md](debugging.md).

## Notice

Delaford contains work from multiple sources not organically made by contributions from Delaford directly.

- [Tileset, monsters, items, players](http://pousse.rapiere.free.fr/tome/tome-tiles.htm) by David E. Gervais. &middot; [CC license](https://creativecommons.org/licenses/by/3.0/)
- [Main screen music](https://opengameart.org/content/enchanted-festival) by [Matthew Pablo](http://www.matthewpablo.com). &middot; [CC license](https://creativecommons.org/licenses/by/3.0/)
- Game font '[PixelMix](https://www.dafont.com/pixelmix.font)' by [Andrew Tyler](http://andrewtyler.net/fonts/), IBM VGA8 by IBM.
- [Heroicons](https://github.com/sschoger/heroicons-ui) by [Steve Schoger](http://www.steveschoger.com/)
