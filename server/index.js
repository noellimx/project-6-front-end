import express from "express";
import cookieParser from "cookie-parser";
import http from "http";
import cors from "cors";

import bindRoute from "./network/http.js";

const SERVER_LISTENING_PORT = process.env.PORT || 3004;
const app = express(); // framework

app.use(cors({ origin: "*" }));
app.use(express.static("dist"));
app.use(cookieParser());

bindRoute(app);

const server = http.createServer(app); // communications

server.listen(SERVER_LISTENING_PORT, () => {
  console.log(`Server listening ${SERVER_LISTENING_PORT}`);
});
