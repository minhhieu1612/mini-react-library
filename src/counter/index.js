import { ReactFragment } from "lib/dom";
import { useCallback, useState } from "lib/hooks";
import { jsx } from "lib/jsx";
import styles from "./index.module.css";

export default function Counter() {
  const [count, setCount] = useState(0);

  const decrease = useCallback(() => {
    setCount((prev) => prev - 1);
  }, []);

  const increase = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return jsx(
    "div",
    { className: styles.container },
    jsx(ReactFragment, null, [
      jsx("button", { onClick: decrease }, "decrease"),
      jsx("span", { className: styles.text }, count),
      jsx("button", { onClick: increase }, "increase"),
    ]),
  );
}
