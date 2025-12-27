import { renderRoot } from "runtime";
import { jsx } from "runtime/jsx";
import App from "src/app";

renderRoot(jsx(App), document.getElementById("root"));
