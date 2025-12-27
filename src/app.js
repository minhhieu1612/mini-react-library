import { jsx } from "runtime/jsx.js";
// import Counter from "src/counter";
import InputRefForm from "src/input-ref-form";

const App = () => {
  return jsx("div", null, [
    jsx("p", null, "Hello, Mini React!"),
    jsx(Counter),
    jsx(InputRefForm),
  ]);
};

export default App;
