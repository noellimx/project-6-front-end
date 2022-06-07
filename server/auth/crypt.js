import { systemConfig } from "../config/index.js";

import crypto from "crypto";

import jwt from "jsonwebtoken";

const { DB_PASSWORD_HASH } = systemConfig;

const JWT_SECRET = crypto.randomBytes(256).toString("base64");

const hashPassword = (plain) =>
  crypto.createHmac("sha256", DB_PASSWORD_HASH).update(plain).digest("hex");

const KEY_USER_DOOR = "d6F3Efeq";
const ALGO_USER_DOOR = "aes-256-cbc";
const IV_USER_DOOR = "692e44dbbea073fc1a8d1c37ea68dffa";

const getUserDoor = (algo, key, _) => {
  // TODO use IV
  const cipher = () => crypto.createCipher(algo, key);
  const decipher = () => crypto.createDecipher(algo, key);

  return {
    conceal: (username) => {
      username = `${username}`;
      const c = cipher();
      c.update(username, "utf-8", "hex");
      return c.final("hex");
    },
    reveal: (concealed) => {
      concealed = `${concealed}`;
      const d = decipher();
      d.update(concealed, "hex", "utf-8");
      return d.final("utf-8");
    },
  };
};

const newAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET);
};

/**
 *
 * @returns {[boolean,string]} return verification status and subject if verified
 */
const verifyToken = (accessToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(accessToken, JWT_SECRET, (err, decoded) => {
      if (err) {
        resolve([false, null]);
      } else {
        resolve([true, decoded.sub]);
      }
    });
  });
};

const UserDoor = getUserDoor(ALGO_USER_DOOR, KEY_USER_DOOR, IV_USER_DOOR);
export { hashPassword, newAccessToken, verifyToken };
