import { jsx } from "lib/jsx";
import InputRefForm from "src/input-ref-form";
import Counter from "./counter";
import ToggleLabel from "./toggle-label"

const App = () => {
  return jsx("div", null, [
    jsx("p", null, "Hello, Mini React!"),
    jsx(Counter),
    jsx(InputRefForm),
    jsx(ToggleLabel)
  ]);
};

export default App;