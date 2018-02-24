![Logo](https://github.com/Navarra/game/raw/master/src/assets/logo.png "Logo")

Welcome to Navarra. A 2D top-down medieval fantasy game using Vue.js, the latest JavaScript and more.

<img width="704" alt="Game screenshot" src="https://user-images.githubusercontent.com/616320/34860792-9a2c0ee8-f725-11e7-9e60-91b8610926f2.png">

## Getting Started

### Website

      $ git clone https://github.com/Navarra/website

Create your `MySQL` database and then edit the `.env.example` and fill out the database credentials.

      $ composer install
      $ php artisan migrate

Your database should now be created and its table successfully setup. Time to make a player.

      $ php artisan serve

Now go to `https://localhost:8000` and register your player account. All set!

### Game

      $ git clone https://github.com/Navarra/game
      $ cd game
      $ yarn install
      $ yarn dev

Time to start the `Node.js` server: `yarn server`.

Now you may visit http://localhost:8080 to login to the game using your newly-created player.

## Contributing

Please check out our [CONTRIBUTING.md](https://github.com/Navarra/game/blob/master/CONTRIBUTING.md) guide on how you can actively participate in the development of this medieval game. It's pretty easy!

## Systems and Engines

Here are the types of things I will be adding as a minimum viable product (alpha). Not too over the top but enough to cover the basics until more is added. Each section links to a project which will contain its sub-tasks within.

- [Player](https://github.com/Navarra/game/projects/1)
  - [x] Walking / pathfinding
  - [x] Context-menu / Actions
  - [ ] Health and stats
  - [ ] Inventory
  - [ ] Character wear
  - [ ] Your first quest
- [User Interface](https://github.com/Navarra/game/projects/2)
  - [x] Inventory tab
  - [ ] Quests tab
  - [x] Chatbox (for players and actions)
  - [ ] Character wear tab
  - [x] Overall look &amp; feel
  - [x] Basic view of main player stats
- [NPC](https://github.com/Navarra/game/projects/3)
  - [ ] Trading
  - [x] Walking around
  - [x] Interaction (Talk, Examine, etc.)
- [Monsters](https://github.com/Navarra/game/projects/3)
  - [ ] Battle System
  - [ ] Looting
  - [ ] Spawning
- [Networking](https://github.com/Navarra/game/projects/5)
  - [ ] Players connect to a game world
  - [ ] Monsters/NPCs and items register on the map
  - [ ] Player-vs-player interaction (Trade and talk)

Once all of these items are checked, Navarra will be stable.

## What's this for?

The point of having this game on an open-source platform is to have the collaborative effort where people can suggest their ideas, code from pull-requests and overall efforts. Take a look at the issues to get started!

When release beta 1.0.0 drops, players will see the ability to connect (via websockets and Node.js), fighting small monsters, gain loot and perform some small actions in a small, small world. The barebones. Oh, and having the ability to _save their data_.

After release alpha 1.0.0, Navarra will be officially stable where players will be able to collect items in their bank, gain experience points in multiple skills and *not have their data reset possibly*. (we'll see.)

**What about after it's officially released?** Navarra will continue to be officially developed and open-source. Depending on the popularity, efforts will be redistributed on how we can prioritize moving forward. There's lots on the backburner such as an administrative panel for admins and player mods, an API, an online site to register/create players (will most likely use Laravel here) and more. Those will be split up into different repositories with their own respective focus.

The end-game is, at its core, to make a fun medieval fantasy game with the latest JavaScript harnessing the best of the web such as D3 for graphs, Vue.js, CSS Grids, and more. And make sure everyone is having fun while doing it.

## Notice

Navarra contains work from multiple sources not organically made by contributions from Navarra directly.

- [Tileset, monsters, items, players](http://pousse.rapiere.free.fr/tome/tome-tiles.htm) by David E. Gervais. &middot; [CC license](https://creativecommons.org/licenses/by/3.0/)
- [Main screen music](https://opengameart.org/content/enchanted-festival) by [Matthew Pablo](http://www.matthewpablo.com). &middot; [CC license](https://creativecommons.org/licenses/by/3.0/)
- Game font '[PixelMix](https://www.dafont.com/pixelmix.font)' by [Andrew Tyler](http://andrewtyler.net/fonts/), IBM VGA8 by IBM.
- [Heroicons](https://github.com/sschoger/heroicons-ui) by [Steve Schoger](http://www.steveschoger.com/)
