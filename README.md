![Logo](https://github.com/Navarra/game/raw/master/src/assets/logo.png "Logo")

[![Join the chat at https://gitter.im/Navarra/game](https://badges.gitter.im/Navarra/game.svg)](https://gitter.im/Navarra/game?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Welcome to Navarra. An online, 2D medieval game using JavaScript and HTML5 (Canvas).

<img width="704" alt="Game screenshot" src="https://user-images.githubusercontent.com/616320/34860792-9a2c0ee8-f725-11e7-9e60-91b8610926f2.png">

## Getting Started

### 1. Website

      $ git clone https://github.com/Navarra/website
      $ cp .env.example .env

Create your `MySQL` database and then edit the `.env.example` and fill out the database credentials.

      $ composer install
      $ php artisan jwt:secret
      $ php artisan key:generate
      $ php artisan migrate
      $ php artisan config:cache
      $ yarn install
      $ yarn dev

Your website's CSS should now be compiled and your database should now be created along with its tables successfully created. Also, your secret JWT authentication key was created. Time to make your player! Let's serve up the website:

      $ php artisan serve

Now go to `https://localhost:8000` and register your player account. All set!

### 2. Game

      $ git clone https://github.com/Navarra/game
      $ cd game
      $ yarn install
      $ yarn dev
      $ cp .env.local .env

Now go to `.env` and fill out the `SITE_URL` with the URL of the `website`. And, as well, the database credentials.

Time to start the `Node.js` server -- type: `yarn server`. This starts the server under the `nodemon` module which automatically restarts if any of the server-side code gets changed.

Now you may visit `http://localhost:8080` to login to the game using your newly-created player.

## Contributing

Please check out our [CONTRIBUTING.md](https://github.com/Navarra/game/blob/master/CONTRIBUTING.md) guide on how you can actively participate in the development of this medieval game. It's pretty easy!

## Systems and Engines

Here are the types of things I will be adding as a minimum viable product (alpha). Not too over the top but enough to cover the basics until more is added. Each section links to a project which will contain its sub-tasks within.

- [Player](https://github.com/Navarra/game/projects/1)
  - [x] Walking / pathfinding
  - [x] Context-menu / Actions
  - [X] Health and stats
  - [ ] Inventory
  - [X] Character wear
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
  - [x] Talking
  - [ ] Examine
- [Monsters](https://github.com/Navarra/game/projects/3)
  - [ ] Battle System
  - [ ] Looting
  - [ ] Spawning
- [Networking](https://github.com/Navarra/game/projects/5)
  - [X] Players connect to a game world
  - [X] Monsters/NPCs and items register on the map
  - [ ] Minor networking tweaks / alpha-stage

Once all of these items are checked, Navarra will be stable. (hopefully)

## What's this for?

I've been wanting to make a Medieval-themed game for a while now with a old-school feel. Also, I wanted it to be multiplayer where players can connect and see each other. Maybe you want to train Mining and then maybe later Smithing? Yep. A neat PvE system? Yep.

An open-source environment, I hope, cultivates learning, sharing and developing together the world of Navarra. The lore and history, much of to be written, will drive this game.

I also hope to learn on topics such as collaboration (in an open-source world) where I develop my own DevOps skills wherein project standards are not only made but kept through the power of CI/CD.

Lastly, this game will give me a great reason to try out `D3` and make cool data viz graphs in the `Navarra/website` section. You want to see cool graphs regarding your player? You're gonna get it. Or, help contribute!

## Notice

Navarra contains work from multiple sources not organically made by contributions from Navarra directly.

- [Tileset, monsters, items, players](http://pousse.rapiere.free.fr/tome/tome-tiles.htm) by David E. Gervais. &middot; [CC license](https://creativecommons.org/licenses/by/3.0/)
- [Main screen music](https://opengameart.org/content/enchanted-festival) by [Matthew Pablo](http://www.matthewpablo.com). &middot; [CC license](https://creativecommons.org/licenses/by/3.0/)
- Game font '[PixelMix](https://www.dafont.com/pixelmix.font)' by [Andrew Tyler](http://andrewtyler.net/fonts/), IBM VGA8 by IBM.
- [Heroicons](https://github.com/sschoger/heroicons-ui) by [Steve Schoger](http://www.steveschoger.com/)
