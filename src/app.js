import { jsx } from "lib/jsx";
import InputRefForm from "src/input-ref-form";
import Counter from "./counter";
import ToggleLabel from "./toggle-label";
import FractalTree from "./fractal-tree";

const App = () => {
  return jsx("div", null, [
    jsx("p", null, "Hello, Mini React!"),
    jsx(Counter),
    jsx(InputRefForm),
    jsx(ToggleLabel),
    jsx(FractalTree),
  ]);
};

export default App;
