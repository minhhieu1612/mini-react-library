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
  |   (
  |   if we set state here, we are having an update, the update will
  |   be made on the alternate tree then aggregate changes and submit
  |   them on current tree eventually, alternate will hold following
  |   properties:
  |   + html node(div, span,...): new or modified dom prop changes(
  |   className, width, style,...)
  |   + react node: at present, no need to do something special
  |   )
  |---[Counter-jsx](current)           |---[Counter-jsx](alternate)
  |     |                              |     |
  |   [div-jsx]                        |   [div-jsx]
  |     |                              |     |
  |   [Fragment-jsx]                   |   [Fragment-jsx]
  |     |                              |     |
  |     |---[button-jsx]               |     |---[button-jsx]
  |     |                              |     |
  |     |---[span-jsx]                 |     |---[span-jsx]
  |     |                              |     |
  |     |---[button-jsx]               |     |---[button-jsx]
  |
  |---[InputRefForm-jsx]
  |      |
  |    [div-jsx]
  |      |
  |      |---[input-jsx]
  |      |
  |      |---[button-jsx]
  |
  |---[ToggleLabel-jsx]
  |      |
  |    [div-jsx]
  |      |
  |      |---[button-jsx]
  |      |
  |      |---[span-jsx] (or empty node)

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
