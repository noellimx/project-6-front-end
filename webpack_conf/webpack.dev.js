import HtmlWebpackPlugin from "html-webpack-plugin";
import { merge } from "webpack-merge";

import common from "./webpack.common.js";

import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export default merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  watch: true,
  plugins: [
    new HtmlWebpackPlugin({
      cache: false,
      filename: "main.html",
      template: path.resolve(__dirname, "..", "client", "main.html"),
    }),
  ],
});
