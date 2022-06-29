import * as React from "react";

import { createRoot } from "react-dom/client";

import { MAny } from "./types/my-types";

import App from "./components/App";

interface DisplayChart {
  chart: string;
}
// const [chart, setChart] = React.useState<DisplayChart>({chart: 'apple'});

// UI Injection
const rootHTMLElement: HTMLElement = document.createElement("div");
document.body.appendChild(rootHTMLElement);

const PAINT = (htmlEle: HTMLElement, rEle: MAny) => {
  createRoot(htmlEle).render(rEle);
};

PAINT(
  rootHTMLElement,
  <div>
    <App />
  </div>
);
