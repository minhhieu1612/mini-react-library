import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  const [count, setCount] = useState(0);
  const decrease = () => setCount((prev) => prev - 1);
  const increase = () => setCount((prev) => prev + 1);

  useEffect(() => {
    console.log("count: %s", count);
  }, [count]);

  return (
    <div>
      <button onClick={decrease}>decrease</button>
      <span>{count}</span>
      <button onClick={increase}>increase</button>
    </div>
  );
};

const root = createRoot(document.getElementById("root"));

root.render(<App />);
