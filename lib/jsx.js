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

import { HTML_AS_COMPONENT, REACT_ELEMENT_TYPE, REACT_TAGS } from "./constants";

export class ReactNode {
  /**
   * ReactNode constructor
   * @param {ReactElement} type
   * @param {any=} props
   * @param {ReactChildren=} children
   */
  constructor(type, props, children) {
    this._$is = REACT_ELEMENT_TYPE;
    this.type = type;
    this.tag = this.parseTag();
    this.props = props;
    this.children = children;
    this.parent = null;
    this.domNode = null;
    this.hooks = null;
    this.domUpdateParams = null;
    this.alternate = null;
  }

  /**
   * Maintain the parent-child relation
   * @param {ReactNode} parent
   */
  bindParent(parent) {
    this.parent = parent;
  }

  /**
   * check if the tag is valid HTML Tag
   * @param {string} tag
   */
  isValidHTMLTag = (tag) => {
    return ["p", "div", "span", "button", "input", "h1"].includes(tag);
  };

  parseTag() {
    switch (typeof this.type) {
      case "string": {
        if (this.isValidHTMLTag(this.type)) {
          return REACT_TAGS.HTML;
        } else {
          throw new Error(
            `The provided html tag "${this.type}" is not valid!!`,
          );
        }
      }
      case "function": {
        return REACT_TAGS.FUNCTION_COMPONENT;
      }
      case "object": {
        if (this.type?.nodeType === HTML_AS_COMPONENT.FRAGMENT) {
          return REACT_TAGS.FRAGMENT;
        }
        if (typeof this.type?.render === "function") {
          return REACT_TAGS.CLASS_COMPONENT;
        }
      }
    }
  }

  markRootNode() {
    this.tag = REACT_TAGS.ROOT_COMPONENT;
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

    return instance?._$is === REACT_ELEMENT_TYPE;
  }
}

/**
 * @param {ReactElement} type
 * @param {ReactNodePropsType=} props
 * @param {ReactChildren=} children
 * @returns
 */
export const jsx = (type, props, children) => {
  return new ReactNode(type, props, children);
};
