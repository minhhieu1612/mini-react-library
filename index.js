import { renderRoot } from "lib";
import { jsx } from "lib/jsx";
import App from "src/app";

renderRoot(jsx(App), document.getElementById("root"));

/**
[App-jsx]
  | 
[div-jsx]
  |
  |---[p-jsx]
  |
  |---[Counter-jsx]
  |     |
  |   [div-jsx]
  |     |
  |   [Fragment-jsx]
  |     |
  |     |---[button-jsx]
  |     |
  |     |---[span-jsx]
  |     |
  |     |---[button-jsx]
  |
  |---[InputRefForm-jsx]
        |
      [div-jsx]
        |
        |---[input-jsx]
        |
        |---[button-jsx]

On mount
[Parent] - will have props, tag, and create a new dom node
  |
  |---[Child 1] - will receive props from parent and has its
  |             - own dom node
  |
  |---[Child 2]

On update
[Parent] - rerun the component with state changes
  |      - reuse old dom node
  |
  |---[Child 1] - compare old and new props for update data
  |             - based on update data => update current dom
  |
  |---[Child 2] 
  
On unmount
[Parent] - rerun the component with state changes
  |      - reuse old dom node
  |
  |---[Child 1] - assume this child is deleted, without key prop React still 
  |             - see the children still has a child so it will compare old 
  |             - child 1 with new child 1(old child 2)
  |---[Child 2] - will run willUnmount handler(if has) from Child 2 then 
                - remove the Child 2

  (RN: React Node)
 */
