import { jsx } from "lib/jsx";
import InputRefForm from "src/input-ref-form";
import Counter from "./counter";
import FractalTree from "./fractal-tree";

const App = () => {
  return jsx("div", null, [
    jsx("h1", null, "Hello, Mini React!"),
    jsx(Counter),
    jsx(InputRefForm),
    jsx(FractalTree),
  ]);
};

export default App;
