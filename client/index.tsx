import * as React from "react";
import { createRoot } from "react-dom/client";

import { MAny } from "./utils/my-types";
import SignIn from "./components/Signin";

// UI Injection
const rootHTMLElement: HTMLElement = document.createElement("div");
document.body.appendChild(rootHTMLElement);

const PAINT = (htmlEle: HTMLElement, rEle: MAny) => {
  createRoot(htmlEle).render(rEle);
};

PAINT(
  rootHTMLElement,
  <div>
    {" "}
    <SignIn />{" "}
  </div>
);
