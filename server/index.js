import express from "express";
import cookieParser from "cookie-parser";
import http from "http";
import cors from "cors";

import fs from "fs"
import https from "https"
import bindRoute from "./network/http.js";

const SERVER_LISTENING_PORT = process.env.PORT || 3004;
const app = express(); // framework

app.use(cors({ origin: "*" }));
app.use(express.static("dist"));
app.use(cookieParser());

bindRoute(app);

const keyPath = "/Users/kaichungyeo/customkeystore/production/server.key"
const certPath = "/Users/kaichungyeo/customkeystore/production/server.cert"
const privateKey  = fs.readFileSync(keyPath, 'utf8');
const certificate = fs.readFileSync(certPath, 'utf8');


const server = https.createServer({key: privateKey, cert: certificate}, app); // communications


server.listen(SERVER_LISTENING_PORT, () => {
  console.log(`Server listening ${SERVER_LISTENING_PORT}`);
});
