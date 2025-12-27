import { Fragment } from "runtime/dom";
import { useState } from "runtime/hooks";
import { jsx } from "runtime/jsx";

export default function Counter() {
  const [count, setCount] = useState(0);

  const decrease = () => {
    setCount((prev) => prev - 1);
  };

  const increase = () => {
    setCount((prev) => prev + 1);
  };

  return jsx(
    "div",
    null,
    jsx(Fragment, null, [
      jsx("button", { onClick: decrease }, "decrease"),
      jsx("span", null, count),
      jsx("button", { onClick: increase }, "increase"),
    ])
  );
}
