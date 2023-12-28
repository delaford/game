<p align="center">
  <img src="https://github.com/Delaford/game/raw/master/src/assets/github/logo.png"/>
</p>

<div align="center">
<a href="https://discord.gg/nkZnHvD"><img src="https://camo.githubusercontent.com/b12a95e20b7ca35f918c0ab5103fe56b6f44c067/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f636861742d6f6e253230646973636f72642d3732383964612e737667" alt="Discord" /></a>
  
  **July 2022 update**: beta demo available at https://beta.delaford.com/
  
  Let me know your interest on the [GitHub discussions thread](https://github.com/delaford/game/discussions/152)!
</div>

<p align="center">
  <strong>Welcome to Delaford. An online, 2D medieval game using JavaScript and HTML5.</strong>

  <img width="704" alt="Game screenshot" src="https://github.com/delaford/game/blob/master/src/assets/github/readme_hero.png">
</p>

## Getting Started

First, fork the repository. Then, go into your favorite terminal.

    git clone git@github.com:YOUR_USERNAME/game.git
    cd game
    npm install
    npm run serve

> `npm run serve` will start the development server and watch for changes on the client-side code inside the `src` folder and otherwise elsewhere applicable.

Now, while still inside the `game` folder, open another terminal session in that same location. Type and run `npm run dev:node`. This will start the Node.js game server.

> If you want to debug, type `npm run ndb`. `ndb` is Google Chrome's Node Debugging tool which allows Node.js programs to be easily debugged and see all its context and variables. Highly recommended for a much easier time.

Now you may visit `http://localhost:8080` to login and start developing!

For a better time, make sure to join the [Discord channel](https://discord.gg/nkZnHvD) to talk to other developers for help and exclusive dicussions!

> Please be aware of a [possible scam in regards to Delaford](https://github.com/delaford/game#possible-scam-notice) that promises money for testing or similar action.

## Contributing

Please check out our [CONTRIBUTING.md](https://github.com/Delaford/game/blob/master/.github/CONTRIBUTING.md) guide on how you can actively participate in the development of this medieval game. It's pretty easy and fun!

## Systems and Engines

Here are the types of things I will be adding as a minimum viable product (alpha). Not too over the top but enough to cover the basics until more is added. Each section links to a project which will contain its sub-tasks within.

### What does a checkmark mean?

When an item is checkmarked, it means the basic foundation is in place but not necessarily complete. For example, Inventory is checkmarked but it currently only supports weapons. You can help fix that.

- [Player](https://github.com/Delaford/game/projects/1)
  - [x] Walking / pathfinding
  - [x] Context-menu / Actions
  - [ ] Health and stats
  - [x] Inventory
  - [x] Character wear
  - [ ] Your first quest
- [User Interface](https://github.com/Delaford/game/projects/2)
  - [x] Inventory tab
  - [ ] Quests tab
  - [x] Chatbox (for players and actions)
  - [x] Character wear tab
  - [x] Overall look &amp; feel
- [NPC](https://github.com/Delaford/game/projects/3)
  - [x] Trading (Shops)
  - [ ] Dialog Interaction
  - [x] Walking around
  - [x] Banking
- [Monsters](https://github.com/Delaford/game/projects/3)
  - [ ] Battle System
  - [ ] Looting
  - [ ] Spawning
- [Networking](https://github.com/Delaford/game/projects/5)
  - [x] Players see each other
  - [x] Non-playable characters
  - [ ] Monsters
  - [ ] Player trading
  - [x] Items
- World
  - [x] Respawn system
  - [ ] Player versus Player
  - [ ] Resource skills
    - [x] Mining
    - [ ] Smithing (Almost finished)
    - [ ] Fishing
    - [ ] Cooking

Once all of these items are checked, Delaford will be stable without breaking changes. But for the time being, please jump in and help add some of these features -- if you'd like!

## Debugging

Learning how to debug in this game is critical in order to interact with the Node.js server and to the client. Your primary source should be the [ndb](https://github.com/GoogleChromeLabs/ndb) tool from Google. It is an improved debugging experience which **drastically** improved client-side debugging.

Read more at [DEBUGGING.md](debugging.md).

## Notice

Delaford contains work from multiple sources not organically made by contributions from Delaford directly.

- [Tileset, monsters, items, players](http://pousse.rapiere.free.fr/tome/tome-tiles.htm) by David E. Gervais. &middot; [CC license](https://creativecommons.org/licenses/by/3.0/)
- [Main screen music](https://opengameart.org/content/enchanted-festival) by [Matthew Pablo](http://www.matthewpablo.com). &middot; [CC license](https://creativecommons.org/licenses/by/3.0/)
- Game font '[PixelMix](https://www.dafont.com/pixelmix.font)' by [Andrew Tyler](http://andrewtyler.net/fonts/)
- Chat font '[IBM VGA 8](https://int10h.org/oldschool-pc-fonts/fontlist/)' by [IBM](https://www.ibm.com).
- [Heroicons](https://github.com/sschoger/heroicons-ui) by [Steve Schoger](http://www.steveschoger.com/)

## Website Status

**Website is not currently up.** The number of users did not justify the monthly charge.

## Possible Scam Notice

Delaford contributors nor anyone associated with Delaford will never contact you in regards testing or instructing you to downloading anything in regards to the development of the game for the reward of payment or digital currency such as cryptocurrency.

We have had verifiable reports of users pretending to be owners of Delaford promising money if they download a folder with the repository's contents inside. Please be aware.
