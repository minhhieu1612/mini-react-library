import { useState } from "lib/hooks";
import { jsx } from "lib/jsx";

export default function ToggleLabel() {
  const [show, setShow] = useState(false);

  const toggle = () => setShow((prev) => !prev);

  return jsx("div", null, [
    jsx("button", { onClick: toggle }, "toggle"),
    show ? jsx("span", null, "Suprise!") : "",
  ]);
}
