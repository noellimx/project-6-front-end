import { resolve } from "path";

export default (app) => {
  app.get("/", (_, res) => res.sendFile(resolve("dist", "main.html")));
};
