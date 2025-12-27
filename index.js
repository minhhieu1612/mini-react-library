import { renderRoot } from "runtime"
import { jsx } from "runtime/jsx.js"
import App from "src/app";

renderRoot(jsx(App), document.getElementById("root"));
