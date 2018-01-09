# Navarra

Welcome to Navarra. A 2D top-down medieval fantasy game using Vue.js, the latest JavaScript and more.

![Game](https://github.com/Navarra/game/raw/master/src/assets/navarra_readme_hero.png "Tilemap")

## Getting Started

      $ git clone https://github.com/Navarra/game
      $ cd game
      $ npm install (or) yarn
      $ npm run dev

Visit http://localhost:8080, or whichever it tells unless you are using port 8080 for something else. You're all set!

## Contributing

Please check out our [CONTRIBUTING.md](https://github.com/Navarra/game/blob/master/CONTRIBUTING.md) guide on how you can actively participate in the development of this medieval game. It's pretty easy!

## Systems and Engines

Here are the types of things I will be adding. Not too over the top but enough to cover the basics until more is added. Each section links to a project which will contain its sub-tasks within.

- [Player](https://github.com/Navarra/game/projects/1)
  - [x] Walking / pathfinding
  - [x] Context-menu / Actions
  - [ ] Health and stats
  - [ ] Inventory
  - [ ] Character wear
- [User Interface](https://github.com/Navarra/game/projects/2)
  - [ ] Inventory
  - [ ] Character wear
  - [ ] Overall look &amp; feel
  - [ ] Basic view of main player stats
- [NPC](https://github.com/Navarra/game/projects/3)
  - [ ] Trading
  - [x] Walking around
  - [ ] Interaction (Talk, Examine, etc.)
- [Monsters](https://github.com/Navarra/game/projects/3)
  - [ ] Battling
  - [ ] Pickups / Loot
  - [ ] Spawning

## What's this for?

The point of having this game on an open-source platform is to have the collaborative effort where people can suggest their ideas, code from pull-requests and overall efforts. Take a look at the issues to get started!

When release beta 1.0.0 drops, players will see the ability to connect (via websockets and Node.js), fighting small monsters, gain loot and perform some small actions in a small, small world. The barebones. Oh, and having the ability to _save their data_.

After release alpha 1.0.0, Navarra will be officially stable where players will be able to collect items in their bank, gain experience points in multiple skills and *not have their data reset*.

**What about after it's officially released?** Navarra will continue to be officially developed and open-source. Depending on the popularity, efforts will be redistributed on how we can prioritize moving forward. There's lots on the backburner such as an administrative panel for admins and player mods, an API, an online site to register/create players (will most likely use Laravel here) and more.

The end-game is, at its core, to make a fun medieval fantasy game with the latest JavaScript harnessing the best of the web such as D3 for graphs, Vue.js and more.

## Notice

Navarra contains work from multiple sources not organically made by contributions from Navarra directly.

- [Tileset, monsters, items, players](http://pousse.rapiere.free.fr/tome/tome-tiles.htm) by David E. Gervais. &middot; [CC license](https://creativecommons.org/licenses/by/3.0/)
- [Main screen music](https://opengameart.org/content/enchanted-festival) by [Matthew Pablo](http://www.matthewpablo.com). &middot; [CC license](https://creativecommons.org/licenses/by/3.0/)
- Game font '[PixelMix](https://www.dafont.com/pixelmix.font)' by [Andrew Tyler](http://andrewtyler.net/fonts/)