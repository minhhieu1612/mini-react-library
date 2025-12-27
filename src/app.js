import { jsx } from "runtime/jsx";
import InputRefForm from "src/input-ref-form";
import Counter from "./counter";

const App = () => {
  return jsx("div", null, [
    jsx("p", null, "Hello, Mini React!"),
    jsx(Counter),
    jsx(InputRefForm),
  ]);
};

export default App;
