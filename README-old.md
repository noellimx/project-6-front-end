# Golila

https://golila.herokuapp.com/

## Game play

Join a room, choose your team and wait for game to start.
Owner of room starts the game. Match the sequence of cryptochains by keypress.

### Scoring

Each matching cryptochain will give you 1 point per coin.
Game runs for 70 + 5 seconds and bonus points for winning team!

![alt text](readme/keys.png)

# Development Notes

## This is a mono repo.

### Without hot reloading

`./full-stack-local-server-local-db.sh` Run without hot reloading.

### With hot reloading

Run two processes.
`./dev.sh` Initialize database and run with server hot reloading.
`npm run client-dev` Run client hot reloading.

## Server

Please note no production build.

### Database

using PostgreSQL with Sequelize

`./database/config/config.js` refer config for database settings \
`./database/ERD/[hash].png` ERD Snapshots with filename as migration hash

[lucidchart](https://lucid.app/lucidchart/ace1cdac-b17b-49e0-a04f-3f69d17f598c/edit?invitationId=inv_9788bdc8-aa64-4d17-8180-88289227ac33)

#### Engine

Go to custom scripts if existing database is used (update to latest migration only).

- `./dev.sh` Ensure psql local or remote service has been started. Recreates an empty database, migrate and seed data.

Custom scripts:

- Initialize database schemas using Sequelize migrations.
  `npm run db:migrate` migrate \
- `npm run seed` This is a reseed operation. Use models for seeding instead of sequelize-cli.

#### Adding migrations

`npm run gen:migrate [name]` generate new migration file where name is appended to the file name. NOTE: change .js to .cjs

### Network / Controller

`npm run server-dev` run hot.

### Client

`npm run client-dev-build` build client hot.

# Deployment (Heroku)

Deployment method via Git.

https://git.heroku.com/golila.git

heroku addons must have postgres.

## Notes

2022 APR 8: See `start` npm script for deployment steps. heroku will run `npm run start` on dyno restart. \
Heroku Postgres does not allow dropping of database. Before clean migration, reset the add-on instead (#1246).

# To Do

## Glitch

[ ] First keydown after game start does not emit to server.
[ ] On heroku, start game spawns crytochain immediately instead of waiting for 5 seconds.

## Feat

[x] remove package CleanWebpackPlugin \
[x] check if Sequelize accept heroku psql connection string \

[x] how to host on heroku???? \
[x] not all users in room receive game-start event \
[ ] need to tear down previous room events on client side.

[x] Game: submit chain (See #1244, #1245)

- tally with gameplay.chain
- first tally will register score, one row per chain (chain, round , team, score)

[x] Game #1244: set timer

- [Moment Game End] timer runs out is triggered and game will be locked on first successful submission after gameplay end time.

- Server: On game ends, notify client game ends

[x] Game #1245: Scoring

- Create table scoring
- Client: On notify game ends, ask whats the tally

[x] Scoring: _Only players staying until the end can claim money_

- transaction should occur at [Moment Game End]. See Game #1244
- payout for each player is total of the team.

[x] User Display: Credit System (navbar + emit)

[x] Board.dormantPlane tear down if game is not active

[x] CSS

- Spawn time
- general arrangement

[x] Registration Page

[x] DEPLOYMENT

[ ] Optimise settle game statistics by storing information and call database

[ ] Production Database #1246: Resetting, migration and seeding.

[ ] Expiry for user id tokens.

[ ] Organise webpack config. (Unify commonalities)

### SPRINT VIEWS

[x] show room name instead of room id in the active room page \
[x] show room name instead of room id in the participating room \
[x] joinable rooms as nice cards \
[x] participating room staging : 1- tabular room, 2- hovering colors \
[x] participating room playing : 1- spawning time flash, 2- coins img, 3 someone hit flash \
[x] participating room end of round : tally \
[x] ERD update \
[ ] Organise npm dependencies \
[ ] Organise npm scripts \
[x] clear fields on registration request submission \
[x] bonus points for winning team \

### Ponderings

- How to ensure an event attaches a callback once?
- What are the asynchronous strategies for filters and loops? When do I need to use them?
- What is inject:true in HtmlWebpackPlugin Config?
- How to improve latency, 1) reducing the network traffic and 2) reducing database calls?
- Since the game is to match answer to question and question has to be exposed to the client, how to secure it?
