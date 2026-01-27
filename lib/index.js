import { MountHookSet } from "./hooks";
import { ReactNode } from "./jsx";
import { Shared } from "./shared";

/**
 * @typedef {import("./index.d").ReactElement} ReactElement
 * @typedef {import("./index.d").ReactNodePropsType} ReactNodePropsType
 * @typedef {import("./index.d").ReactNode} ReactNode
 * @typedef {import("./index.d").ReactChildren} ReactChildren
 * @typedef {import("./index.d").RefObject} RefObject
 */

/**
 * check if the tag is valid HTML Tag
 * @param {string} tag
 */
const validTag = (tag) => {
  return ["p", "div", "span", "button", "input"].includes(tag);
};

const validHtmlelementAsComponents = {
  FRAGMENT: 11,
};

/**
 * Check whether html element is valid component
 * @param {HTMLElement} comp
 */
const validComponentElement = (comp) => {
  if (!comp) return false;

  if ([validHtmlelementAsComponents.FRAGMENT].includes(comp?.nodeType)) {
    return true;
  }

  return false;
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
          props.ref.current = element;
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
      case "className":
        {
          element.className = value;
        }
        break;
    }
  });
};

/**
 * render HTML Node
 * @param {ReactNode} node
 * @param {ReactNode} parent
 * @returns {HTMLElement | null}
 */
const renderNode = (node, parent) => {
  /** @type {HTMLElement | null} */ let element = null;

  node.bindParent(parent);

  const processChildren = () => {
    switch (typeof node.children) {
      case "object":
        {
          if (node.children?.length) {
            const childDOMs = /** @type {ReactNode[]} */ (node.children).reduce(
              (res, child) => {
                let childDOM = child;

                if (ReactNode.is(child)) {
                  childDOM = renderNode(child, node);
                }

                return [...res, childDOM];
              },
              [],
            );

            element.append(...childDOMs);
          } else {
            element.append(
              ReactNode.is(node.children)
                ? renderNode(node.children, parent)
                : node.children,
            );
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
  };

  switch (typeof node.type) {
    case "string":
      {
        if (!validTag(node.type))
          throw new Error(`The given tag name "${node.type}" was invalid`);
        element = document.createElement(node.type);

        processProps(element, node.props);
        processChildren();
      }
      break;
    // class component
    // will be handled later
    case "object":
      {
        if (node.type?.render && node?.type?.render?.length) {
          const classComponentNode = node?.type?.render?.();

          if (classComponentNode) {
            element = renderNode(classComponentNode, parent);
          }
        } else if (validComponentElement(node.type)) {
          element = node.type;
          processChildren();
        }
      }
      break;
    // function component
    case "function":
      {
        Shared.renderringNode = node;
        Shared.hookSet = MountHookSet;

        /** @type {ReactNode} */
        const Component = node.type(node.props);

        Shared.renderringNode = null;
        Shared.renderringHooks = null;
        Shared.hookSet = null;
        node.children = Component;
        element = renderNode(Component, node);
      }
      break;
    default:
      break;
  }

  if (element && !node.domNode) node.bindDOM(element);

  return element;
};

/**
 * Render entire app from root to leaf nodes
 * @param {ReactNode} rootNode
 * @param {HTMLElement} container
 */
export const renderRoot = (rootNode, container) => {
  rootNode.bindDOM(container);
  container.append(renderNode(rootNode, null));
};
