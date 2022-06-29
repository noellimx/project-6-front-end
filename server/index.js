import express from "express";
import cookieParser from "cookie-parser";
import http from "http";
import cors from "cors";

import fs from "fs";
import https from "https";
import bindRoute from "./network/http.js";

import config from "./config.js";

const accessControlOrgin = "https://localhost:8080"; // Development always local

const homePath = process.env[config.path_var.home];
console.log(homePath);

const SERVER_LISTENING_PORT = process.env.PORT || 3004;
const app = express(); // framework

function corsMiddleWare() {
  return function (request, res, next) {
    res.setHeader("Access-Control-Allow-Origin", accessControlOrgin);

    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    next();
  };
}

app.use(cors());
app.use(express.static("dist"));
app.use(cookieParser());
app.use(corsMiddleWare());
bindRoute(app);

const keyFilePath = `${homePath}/customkeystore/production/server.key`;
const certFilePath = `${homePath}/customkeystore/production/server.cert`;

const privateKey = fs.readFileSync(keyFilePath, "utf8");
const certificate = fs.readFileSync(certFilePath, "utf8");

const server = https.createServer({ key: privateKey, cert: certificate }, app); // communications

server.listen(SERVER_LISTENING_PORT, () => {
  console.log(`Server listening ${SERVER_LISTENING_PORT}`);
});
