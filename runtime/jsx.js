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

/**
 * @typedef {object} ReactNode
 * @property {ReactElement} tag
 * @property {any} props
 * @property {ReactChildren=} children
 * @property {!ReactNode} _owner
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
    this._owner = null;
  }

  bindOwner(owner) {
    this._owner = owner;
    return this;
  }

  static is(instance) {
    if (typeof instance !== "object") return false;

    if (
      !Object.getOwnPropertyDescriptor(instance, "type") ||
      !Object.getOwnPropertyDescriptor(instance, "props") ||
      !Object.getOwnPropertyDescriptor(instance, "children") ||
      !Object.getOwnPropertyDescriptor(instance, "_owner")
    )
      return false;

    return true;
  }
}

/**
 * @param {ReactElement} type
 * @param {ReactNodePropsType} props
 * @param  {...ReactNode} children
 * @returns
 */
export const jsx = (type, props, ...children) => {
  return new ReactNode(type, props, children);
};
