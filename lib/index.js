import { ReactNode } from "./jsx";
import { updateNode } from "./renderer";

/**
 * Render entire app from root to leaf nodes
 * @param {ReactNode} root
 * @param {HTMLElement} container
 */
export const renderRoot = (root, container) => {
  root.bindDOM(container);
  root.markRootNode();
  updateNode(root);
};
