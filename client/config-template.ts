//  Template, and also configuration for server.
//  Refer to typings for remarks
import { Config } from "./types/my-types";

const config: Config = {
  env: "production",
  wsserver: "fruitt.art:8443/ws",
  httpsserver: "fruitt.art:8443",
};

export default config;
