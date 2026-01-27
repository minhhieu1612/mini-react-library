/**
 * @typedef {import("./index.d").ReactElement} ReactElement
 */

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

export class ReactNode {
  /**
   * ReactNode constructor
   * @param {ReactElement} type
   * @param {any=} props
   * @param {ReactChildren=} children
   */
  constructor(type, props, children) {
    this.type = type;
    this.props = props;
    this.children = children;
    this.parent = null;
    this.domNode = null;
    this.hooks = null;
    this.domUpdateParams = null;
  }

  /**
   * Maintain the parent-child relation
   * @param {ReactNode} parent
   */
  bindParent(parent) {
    this.parent = parent;
  }

  /**
   * Store dom node data into node
   * @param {HTMLElement} dom
   */
  bindDOM(dom) {
    this.domNode = dom;
  }

  static is(instance) {
    if (typeof instance !== "object") return false;

    if (
      !Object.getOwnPropertyDescriptor(instance, "type") ||
      !Object.getOwnPropertyDescriptor(instance, "props") ||
      !Object.getOwnPropertyDescriptor(instance, "children") ||
      !Object.getOwnPropertyDescriptor(instance, "parent")
    )
      return false;

    return true;
  }
}

/**
 * @param {ReactElement} type
 * @param {ReactNodePropsType=} props
 * @param  {ReactChildren=} children
 * @returns
 */
export const jsx = (type, props, children) => {
  return new ReactNode(type, props, children);
};
