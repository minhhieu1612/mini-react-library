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
        if (ReactNode.is(child)) {
          child.bindParent(node);
          queue.push(child);
        }
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
 * We have two trees need to compare as following:
 * @example
 * ```
 * |---[comp-jsx](current)              |---[comp-jsx](alternate new)
 * |     |                              |     |
 * |   [div-jsx]                        |   [div-jsx]
 * |     |                              |     |
 * |     |---[html1-jsx]                |     xxx
 * |     |                              |     |
 * |     |---[html2-jsx]                |     |---[html2-jsx](modified)
 * |                                    |     |
 * |                                    |     |---[html3-jsx](new)
 * ```
 * Assume that:
 * + html1 is removed
 * + html2 is modified
 * + html3 is added
 *
 * How do we assess this, okay it is not easy so handle later
 * @param {ReactNode} current
 * @param {ReactNode} alternate
 */
function bindAlternateDOMNode(current, alternate) {
  // TODO: implement node structure change later
  const currentQueue = [current];
  const alternateQueue = [alternate];

  function normalizeChildren(
    /**@type {ReactNode | string | number | any} */ children,
  ) {
    return Array.isArray(children)
      ? children.filter((child) => ReactNode.is(child))
      : ReactNode.is(children)
        ? [children]
        : [];
  }

  while (currentQueue.length) {
    const currentNode = currentQueue.shift();
    const alternateNode = alternateQueue.shift();

    // just process on html react node
    if (currentNode.tag === REACT_TAGS.HTML) {
      currentNode.alternate = alternateNode;

      if (alternateNode) alternateNode.alternate = currentNode;
    }

    /**
     * Let assume current is A, and alternate is B
     * Will encounter follwing cases:
     * A and B both have chilren as arrays: compare children length
     * - (1) equal: push the both chidren list into the queue, respectively
     * - (2) A > B: some nodes are deleted, push some null nodes into alternate
     * queue
     * - (3) A < B: some nodes are created, push new nodes from B into current
     * queue
     */
    // normalize all children first
    const currentChildrenArray = normalizeChildren(currentNode.children);
    const alternateChildrenArray = normalizeChildren(alternateNode.children);
    const alternateChildLength = alternateChildrenArray.length;
    const currentChildLength = currentChildrenArray.length;

    // case (1)
    if (alternateChildLength === currentChildLength) {
      alternateQueue.push(...alternateChildrenArray);
      currentQueue.push(...currentChildrenArray);
    } else if (currentChildLength > alternateChildLength) {
      // case (2)
      currentChildrenArray.forEach((currentChild, index) => {
        currentQueue.push(currentChild);
        alternateQueue.push(
          index < alternateChildLength ? alternateChildrenArray[index] : null,
        );
      });
    } else {
      // case (3)
      alternateChildrenArray.forEach((alternateChild, index) => {
        alternateQueue.push(alternateChild);
        currentQueue.push(
          index < currentChildLength
            ? currentChildrenArray[index]
            : alternateChild,
        );
      });
    }
  }
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

  function isPrimitiveType(input) {
    return typeof input === "string" || typeof input === "number";
  }

  switch (current.tag) {
    case REACT_TAGS.HTML:
      {
        const alternate = current.alternate;
        let domUpdateParams = current.domUpdateParams;
        if (!alternate) {
          domUpdateParams = current.props;
          if (isPrimitiveType(current.children)) {
            domUpdateParams = {
              ...domUpdateParams,
              textContent: current.children,
            };
          }
        } else {
          domUpdateParams = extractChanges(current.props, alternate.props);
          if (
            isPrimitiveType(current.children) &&
            isPrimitiveType(alternate.children) &&
            current.children !== alternate.children
          ) {
            current.children = alternate.children;
            domUpdateParams = {
              ...domUpdateParams,
              textContent: alternate.children,
            };
          }

          domUpdateParams = {
            ...domUpdateParams,
            cleanUpEvents: Object.entries(current.props).reduce(
              (acc, [key, value]) => {
                if (/^on/.test(key) && domUpdateParams[key]) {
                  acc[key] = value;
                }
                return acc;
              },
              {},
            ),
          };
          // ship all the props changes to the current node

          current.props = alternate?.props;
        }

        current.domUpdateParams = domUpdateParams;
      }
      break;
    case REACT_TAGS.ROOT_COMPONENT:
    case REACT_TAGS.FUNCTION_COMPONENT: {
      Shared.renderringNode = current;

      // with hook set, component can have a new hooks array data
      // or get the previous hook set data then reuse it in alternate
      // node
      if (current.children) {
        Shared.hookSet = UpdateHookSet;
        Shared.previousHooks = current.hooks;
        current.hooks = [];

        let alternateChild = current.type(current.props);
        let currentChild = current.children;

        bindAlternateDOMNode(currentChild, alternateChild);
        Shared.previousHooks = null;
      } else {
        Shared.hookSet = MountHookSet;
        current.children = current.type(current.props);
      }

      Shared.renderringNode = null;
      Shared.hookSet = null;
    }
  }

  current.alternate = null;
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
    // case (3)
    if (Object.getOwnPropertyDescriptor(a, key)) {
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
            if (props?.cleanUpEvents?.onClick) {
              element.removeEventListener("click", props.cleanUpEvents.onClick);
            }
            element.addEventListener("click", value);
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
export const updateContainer = (node) => {
  if (!node) {
    console.error(
      "this node instance cannot be processed, please check the updater",
    );
    return;
  }
  // prepare for the update: scheduling => can be implemtented later

  // use a work loop to perform update on current and child node
  workLoopSync(node);

  // should commit the update at the end of reconciler
  commitNodeSync(node);
};
