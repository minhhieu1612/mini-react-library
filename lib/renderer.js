import { Shared } from "./shared";

/**
 * @param {import(".").ReactNode} node
 */
export const updateNode = (node) => {
  // prepare for the update: scheduling => can be implemtented later

  // use a work loop to perform update on current and child node
  Shared.inProgressWork = node;
  workLoopSync();

  // should commit the update at the end of reconciler
  commitNode(node);
};

function workLoopSync() {
  while (Shared.inProgressWork !== null) {
    performUnitOfWork(Shared.inProgressWork);
  }
}

/**
 *
 * @param {import(".").ReactNode} inProgressWork
 */
function performUnitOfWork(inProgressWork) {
  

  const completed = true;
  console.log(inProgressWork);
  if (completed) {
    Shared.inProgressWork = null;
  }
}

/**
 *
 * @param {import(".").ReactNode} node
 */
function commitNode(node) {}
