//  Template, and also configuration for server.
//  Refer to typings for remarks
import { Config } from "./utils/my-types";

const config: Config = {
  env: "production",
  wsserver: "fruitt.art:8080/ws",
  httpsserver: "fruitt.art:8443",
};

export default config;
