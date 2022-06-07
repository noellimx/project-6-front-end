import express from "express";
import cookieParser from "cookie-parser";
import bindRoutes from "./network/http.js";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import bindEvents from "./network/socketio/socketio.js";
import initDatabase, { Database } from "./database/index.js";

import { dbConfig, systemConfig } from "./config/index.js";
import connectSequelize from "./database/connection/index.js";

const { ENVIRONMENT } = systemConfig;

const sequelize = connectSequelize(ENVIRONMENT, dbConfig);

const db = initDatabase(sequelize);

await db.wipe();
await db.seed();

const SERVER_LISTENING_PORT = process.env.PORT || 3004;
const app = express(); // framework
const server = http.createServer(app); // communications
const io = new Server(server); // upgrade / mounting

bindEvents(io, db);
bindRoutes(app);

app.use(cors({ origin: "*" }));
app.use(express.static("dist"));
app.use(cookieParser());

server.listen(SERVER_LISTENING_PORT, () => {
  console.log(`Server listening ${SERVER_LISTENING_PORT}`);
});
