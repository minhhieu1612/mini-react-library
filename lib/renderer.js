/**
 * @typedef {import(".").ReactNode} ReactNode
 */

import { REACT_TAGS } from "./constants";
import { MountHookSet, UpdateHookSet } from "./hooks";
import { ReactNode } from "./jsx";
import { Shared } from "./shared";

/**
 * Start tree traverse here with root is the input node.
 * @param {ReactNode} node
 */
function workLoopSync(root) {
  // use bfs but need to be able to pause work and continue later
  // TODO: implement yield to main thread mechanism

  const /** @type {ReactNode[]} */ queue = [root];

  while (queue.length) {
    const node = queue.shift();

    Shared.inProgressWork = node;
    performUnitOfWork();

    if (typeof node.children === "object" && Array.isArray(node.children)) {
      node.children.forEach((/** @type {ReactNode} */ child) => {
        child.bindParent(node);
        queue.push(child);
      });
    } else if (ReactNode.is(node.children)) {
      queue.push(node.children);
      /** @type {ReactNode} */ (node.children).bindParent(node);
    }
  }

  // finish: the last node was shipped
  Shared.inProgressWork = null;
}

/**
 * Collect changes and store them in domUpdateParams,
 * changes can be categorized as property change or structure change
 * - property change: class, style, attribute of dom node, can be
 * the text change by children
 * - structure change:
 *   - add: create connection between dom RN with react comp RN
 *   - remove: the current RN doesn't have children but alternate RN has
 *    => might do something here, but not sure
 */
function performUnitOfWork() {
  /** @type {ReactNode} */
  const current = Shared.inProgressWork;
  const parent = current?.parent;
  const /**@type {ReactNode=} */ alternate = current.alternate;

  function isPrimitiveType(input) {
    return typeof input === "string" || typeof input === "number";
  }

  switch (current.tag) {
    case REACT_TAGS.HTML:
      {
        if (!alternate) {
          current.domUpdateParams = current.props;
          if (isPrimitiveType(current.children)) {
            current.domUpdateParams = {
              ...current.domUpdateParams,
              textContent: current.children,
            };
          }
        } else {
          current.domUpdateParams = extractChanges(
            alternate.props,
            current.props,
          );
          if (
            isPrimitiveType(current.children) &&
            isPrimitiveType(alternate.children) &&
            current.children !== alternate.children
          ) {
            current.domUpdateParams = {
              ...current.domUpdateParams,
              textContent: current.children,
            };
          }
        }
      }
      break;
    case REACT_TAGS.ROOT_COMPONENT:
    case REACT_TAGS.FUNCTION_COMPONENT: {
      Shared.renderringNode = current;

      if (current.children) {
        Shared.hookSet = UpdateHookSet;
        current.children.alternate = current.type(current.props);
      } else {
        Shared.hookSet = MountHookSet;
        current.children = current.type(current.props);
      }

      Shared.renderringNode = null;
      Shared.renderringHooks = null;
      Shared.hookSet = null;
    }
  }
}

/**
 * changes are extracted based on:
 * - (1) a and b have the same prop A with same value => not include A
 * - (2) a and b have the same prop A with different value => include A
 * - (3) b has A as a new prop => add A
 * - (4) b does not have prop A as a has => add A with undefined value
 * @param {object} a old props
 * @param {object} b new props
 * @returns diff between a and b
 */
function extractChanges(a, b) {
  const result = {};
  Object.keys(a).forEach((key) => {
    if (Object.getOwnPropertyDescriptor(b, key)) {
      // case (1) and (2)
      if (a[key] !== b[key]) result[key] = b[key];
    } else {
      // case (4)
      result[key] = undefined;
    }
  });

  Object.keys(b).forEach((key) => {
    if (Object.getOwnPropertyDescriptor(result, key)) {
      return;
    }
    result[key] = b[key];
  });

  return result;
}

/**
 * DOM mutations are situated here with these following cases:
 * - new: append new html node to its parent html dom
 * - modified: based on dom props in domUpdateParams update the
 * current dom
 * - remove: remove the current dom from its parent
 *
 * (note: all dom node will attach their react node through domNode field)
 * @param {ReactNode} node
 */
function processDOM(node) {
  if (node.tag !== REACT_TAGS.HTML && node.tag !== REACT_TAGS.FRAGMENT) return;

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
        case "name":
        case "type":
          {
            element.setAttribute(key, value);
          }
          break;
        case "textContent":
        case "className":
          {
            element[key] = value;
          }
          break;
      }
    });
  };

  // create
  if (!node.domNode) {
    const /** @type {Element} */ element =
        node.tag === REACT_TAGS.FRAGMENT
          ? new DocumentFragment()
          : document.createElement(node.type);

    node.bindDOM(element);
    let parent = node.parent;
    while (
      ![
        REACT_TAGS.HTML,
        REACT_TAGS.FRAGMENT,
        REACT_TAGS.ROOT_COMPONENT,
      ].includes(parent.tag)
    ) {
      parent = parent.parent;
    }

    parent.domNode.append(element);
  }

  if (node.domUpdateParams) {
    // modified
    console.log({ type: node.type, updateParams: node.domUpdateParams });
    processProps(node.domNode, node.domUpdateParams);
    node.domUpdateParams = null;
  }

  // remove
  // TODO: implement later
}

/**
 * DOM manipulation takes place here with changes in domUpdateParams
 * a node can be removed, created, modified
 * - created: create a dom node with html tag name then append to its
 * parent
 * - modified: can change the style, geometry or if children is text,
 * "textContent" in domUpdateParams will be the params to update the
 * existed dom node.
 * - removed: simply remove the dom node from parent and unbind domNode
 * on current React Node
 * @param {ReactNode} node
 */
function commitNodeSync(root) {
  const queue = [root];

  // use bfs
  while (queue.length) {
    const node = queue.shift();

    processDOM(node);

    if (typeof node.children === "object" && Array.isArray(node.children)) {
      queue.push(...node.children);
    } else if (ReactNode.is(node.children)) {
      queue.push(node.children);
    }
  }
}

/**
 * @param {ReactNode} node
 */
export const updateNode = (node) => {
  // prepare for the update: scheduling => can be implemtented later

  // use a work loop to perform update on current and child node
  workLoopSync(node);

  // should commit the update at the end of reconciler
  commitNodeSync(node);
};
