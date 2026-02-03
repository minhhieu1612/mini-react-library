import { useRef } from "lib/hooks";
import { jsx } from "lib/jsx";

export default function InputRefForm() {
  const inputRef = useRef(null);
  const printRefValue = () => {
    console.log(/** @type {HTMLInputElement} */ (inputRef.current).value);
  };

  return jsx("div", null, [
    jsx("input", { type: "text", ref: inputRef, value: 3, name: "try" }),
    jsx("button", { onClick: printRefValue }, "write log"),
  ]);
}
