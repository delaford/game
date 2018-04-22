<p align="center">
  <img src="https://github.com/Navarra/game/raw/master/src/assets/logo.png"/>
</p>

<p align="center">
  <a href="https://gitter.im/Navarra/game"><img src="https://badges.gitter.im/Navarra/game.svg" alt="gitter.im"></a>
  <a href="https://circleci.com/gh/Navarra/game/tree/master"><img src="https://circleci.com/gh/Navarra/game/tree/master.svg?style=svg" alt="circleci"></a>
</p>

<p align="center">
  <strong>Welcome to Navarra. An online, 2D medieval game using JavaScript and HTML5.</strong>

  <img width="704" alt="Game screenshot" src="https://user-images.githubusercontent.com/616320/34860792-9a2c0ee8-f725-11e7-9e60-91b8610926f2.png">
</p>

## Getting Started

> You can view a video-tutorial of this getting started guide [located here](https://www.youtube.com/watch?v=5a69TEEJ-oY).

### 1. Website

First, using your terminal or Sequel Pro or PHPMyAdmin (or whatever), create your `MySQL` database.

Secondly, in your terminal, make a new directory called `navarra` and type the following:

      $ git clone https://github.com/Navarra/website
      $ cp .env.example .env

Then, let's edit the `.env` file we just created from our last command (`cp`) and put in the database credentials.

Now, let's make the website. In your terminal, at `/navarra/website/`, type:

      $ composer install
      $ php artisan jwt:secret
      $ php artisan key:generate
      $ php artisan migrate
      $ php artisan config:cache
      $ yarn install
      $ yarn dev

Your website's CSS should now be compiled and your database's tables should now be created. Also, your secret JWT authentication key was created along with the Laravel application key.

Time to make your player! Let's serve up the website:

      $ php artisan serve

Now go to `https://localhost:8000` and register your player account. You are all set!

### 2. Game

Go to `/navarra` and now type the following, in your terminal:

      $ git clone https://github.com/Navarra/game
      $ cd game
      $ yarn install
      $ yarn dev
      $ cp .env.local .env

You should now have two folders under `navarra`:

    navarra/
    ├── game/
    └── website/

Now go to `.env` and fill out the `SITE_URL` with the URL of the website you setup previously. Then make sure to fill the database credentials as well inside `.env`.

Time to start the `Node.js` server -- type: `yarn server`. This starts the server under the `pm2` module which keeps track of logs, monitor and more.

> You can use `nodemon` instead of `pm2` to restart the server automatically on code changes by doing `yarn dev_server`

Now you may visit `http://localhost:8080` to login to the game using your newly-created player.

## Contributing

Please check out our [CONTRIBUTING.md](https://github.com/Navarra/game/blob/master/CONTRIBUTING.md) guide on how you can actively participate in the development of this medieval game. It's pretty easy!

## Systems and Engines

Here are the types of things I will be adding as a minimum viable product (alpha). Not too over the top but enough to cover the basics until more is added. Each section links to a project which will contain its sub-tasks within.

### What does a checkmark mean?

When an item is checkmarked, it means the basic foundation is in place. Sometimes, however, it is not fully complete. For example, Inventory is checkmarked but the inventory currently only supports weapons. You cna help fix that.

- [Player](https://github.com/Navarra/game/projects/1)
  - [x] Walking / pathfinding
  - [x] Context-menu / Actions
  - [X] Health and stats
  - [x] Inventory
  - [X] Character wear
  - [ ] Your first quest
- [User Interface](https://github.com/Navarra/game/projects/2)
  - [x] Inventory tab
  - [ ] Quests tab
  - [x] Chatbox (for players and actions)
  - [x] Character wear tab
  - [x] Overall look &amp; feel
  - [x] Basic view of main player stats
- [NPC](https://github.com/Navarra/game/projects/3)
  - [ ] Trading
  - [x] Walking around
  - [x] Talking
  - [X] Examine
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
