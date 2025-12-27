/**
 * @typedef {import("./index.d").ReactElement} ReactElement
 */

import { ReactNode } from "./jsx.js";

/**
 * @typedef {import("./index.d").ReactNodePropsType} ReactNodePropsType
 */

/**
 * @typedef {import("./index.d").ReactNode} ReactNode
 */

/**
 * @typedef {import("./index.d").ReactChildren} ReactChildren
 */
/**
 * @typedef {import("./index.d").RefObject} RefObject
 */

/**
 * check if the tag is valid HTML Tag
 * @param {string} tag
 */
const validTag = (tag) => {
  return ["p", "div", "span", "button", "input"].includes(tag);
};

/**
 * bind props for native html dom node such as: onClick, ref, style, ...
 * @param {HTMLElement} element
 * @param {ReactNodePropsType} props
 */
const processProps = (element, props) => {
  if (typeof props !== "object" || !props) return;

  Object.entries(props).forEach(([key, value]) => {
    switch (key) {
      case "ref":
        {
          props.ref = element;
        }
        break;
      case "onClick":
        {
          // TODO: need to incorporate logic to remove event listener
          element.addEventListener("click", props.onClick);
        }
        break;
      case "value":
        {
          if (element.tagName === "input") {
            /** @type {HTMLInputElement} */ (element).value = value + "";
          }
        }
        break;
    }
  });
};

/**
 * render HTML Node
 * @param {ReactNode} node
 * @returns {HTMLElement | null}
 */
const renderNode = (node) => {
  switch (typeof node.type) {
    case "string": {
      if (!validTag(node.type))
        throw new Error(`The given tag name "${node.type}" was invalid`);
      const element = document.createElement(node.type);

      processProps(element, node.props);

      switch (typeof node.children) {
        case "object":
          {
            if (node.children?.length) {
              element.append(
                node.children.reduce(
                  (res, child) =>
                    res.concat(ReactNode.is(child) ? renderNode(child) : child),
                  []
                )
              );
            } else {
              element.append(renderNode(node.children));
            }
          }
          break;
        case "string":
        case "boolean":
        case "number":
          {
            element.textContent = node.children;
          }
          break;
      }

      return element;
    }
    // class component
    // will be handle later
    case "object": {
      const classComponentNode = node.render();

      return renderNode(classComponentNode);
    }
    case "function": {
      const functionComponentNode = node.type();

      return renderNode(functionComponentNode);
    }
    default:
      break;
  }

  return null;
};

/**
 * Render entire app from root to leaf nodes
 * @param {ReactNode} rootNode
 * @param {HTMLElement} container
 */
export const renderRoot = (rootNode, container) => {
  rootNode.bindOwner(container);

  if (container.firstElementChild) {
    // handle update change here
  } else {
    // handle mount entire app
    container.append(renderNode(rootNode));
  }
};
