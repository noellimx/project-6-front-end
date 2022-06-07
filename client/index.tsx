import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";

// UI Injection
const rootHTMLElement: HTMLElement = document.createElement("div");
document.body.appendChild(rootHTMLElement);

const PAINT = (htmlEle: HTMLElement, rEle: JSX.Element) => {
  createRoot(htmlEle).render(rEle);
};

PAINT(rootHTMLElement, <div> welcome </div>);
