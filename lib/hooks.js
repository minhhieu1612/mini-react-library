/**@typedef {import("./index.d").Effect} Effect */

import { Shared } from "lib/shared";
import { updateContainer } from "./renderer";

const InitialHook = function (initValue) {
  this.memoizedValue = initValue;
  const node = Shared.renderringNode;

  if (node.hooks?.length) {
    node.hooks.push(this);
  } else {
    node.hooks = [this];
  }
};

const InprogressHook = function () {
  const node = Shared.renderringNode;
  const previous = Shared.previousHooks[node.hooks?.length ?? 0];

  if (!previous) {
    throw new Error("Render more hooks than previous render!!");
  }

  this.memoizedValue = previous.memoizedValue;
  this.previous = previous;

  if (node.hooks?.length) {
    node.hooks.push(this);
  } else {
    node.hooks = [this];
  }

  this.unlinkPrevious = () => {
    delete this.previous;
  };
};

const mountState = (initValue) => {
  const hook = new InitialHook(initValue);

  hook.lastState = initValue;
  const /**@type {import("./index.d").ReactNode} */ currentNode =
      Shared.renderringNode;
  const currentStateHookIndex = currentNode.hooks.length - 1;

  // hook.node = Shared.renderringNode;

  hook.lastDispatch = function dispatchSetState(value) {
    let newValue;

    if (
      !currentNode ||
      !currentNode.hooks ||
      !currentNode.hooks[currentStateHookIndex]
    ) {
      throw new Error("Render less hooks than previous render");
    }

    const currentHook = currentNode.hooks[currentStateHookIndex];

    if (typeof value === "function") {
      newValue = value(currentHook.lastState);
    } else {
      newValue = value;
    }

    // fast path
    if (newValue === currentHook.lastState) return;

    // schedule a state update because there can be batch updates
    // for a seri of state change =>

    currentHook.memoizedValue = currentHook.lastState = newValue;

    updateContainer(currentNode);
  };

  return [hook.memoizedValue, hook.lastDispatch];
};

const updateState = () => {
  const hook = new InprogressHook();

  hook.lastState = hook.previous.lastState;
  // hook.node = Shared.renderringNode;
  hook.lastDispatch = hook.previous.lastDispatch;
  hook.previous.node = null;
  hook.unlinkPrevious();

  return [hook.memoizedValue, hook.lastDispatch];
};

const mountRef = (initValue) => {
  const hook = new InitialHook({ current: initValue });

  return hook.memoizedValue;
};

const updateRef = (_initValue) => {
  const hook = new InprogressHook();

  hook.unlinkPrevious();
  return hook.memoizedValue;
};

const mountMemo = (create, deps) => {
  const hook = new InitialHook(create());
  hook.lastDeps = deps;

  return hook.memoizedValue;
};

/**
 * Shallowly compare old and new dependencies
 * @param {any[] | undefined} oldDeps
 * @param {any[] | undefined} newDeps
 */
const shallowCompare = (oldDeps, newDeps) => {
  if (oldDeps === newDeps && newDeps === undefined) return false;

  if (Array.isArray(oldDeps) !== Array.isArray(newDeps)) {
    throw new Error("Old and new dependencies must have consistent data type");
  }

  if (Array.isArray(oldDeps) && Array.isArray(newDeps)) {
    if (oldDeps.length !== newDeps.length) {
      throw new Error(
        "Some dependecies are added or missing",
      );
    }

    for (let i = 0; i < oldDeps.length; i++) {
      if (oldDeps[i] !== newDeps[i]) {
        return false;
      }
    }
  }

  return true;
};

const updateMemo = (create, deps) => {
  const hook = new InprogressHook();

  hook.lastDeps = hook.previous.lastDeps;
  hook.unlinkPrevious();

  if (!shallowCompare(hook.lastDeps, deps)) {
    hook.memoizedValue = create();
    hook.lastDeps = deps;
  }

  return hook.memoizedValue;
};

const mountCallback = (callback, deps) => {
  const hook = new InitialHook(callback);

  hook.lastDeps = deps;

  return hook.memoizedValue;
};

const updateCallback = (callback, deps) => {
  const hook = new InprogressHook();

  hook.lastDeps = hook.previous.lastDeps;
  hook.unlinkPrevious();
  if (!shallowCompare(hook.lastDeps, deps)) {
    hook.memoizedValue = callback;
    hook.lastDeps = deps;
  }

  return hook.memoizedValue;
};

const mountEffect = (caller, deps) => {
  const /**@type {Effect} */ effect = {
      caller,
      destroy: null,
    };

  const hook = new InitialHook(effect);

  hook.lastDeps = deps;
  Shared.effectQueue.push(effect);
};

const updateEffect = (caller, deps) => {
  const hook = new InprogressHook();

  hook.lastDeps = hook.previous.lastDeps;
  hook.unlinkPrevious();

  if (!shallowCompare(hook.lastDeps, deps)) {
    hook.lastDeps = deps;
    /**@type {Effect} */ (hook.memoizedValue).caller = caller;
    Shared.effectQueue.push(hook.memoizedValue);
  }
};

export const MountHookSet = {
  useState: mountState,
  useRef: mountRef,
  useMemo: mountMemo,
  useCallback: mountCallback,
  useEffect: mountEffect,
};

export const UpdateHookSet = {
  useState: updateState,
  useRef: updateRef,
  useMemo: updateMemo,
  useCallback: updateCallback,
  useEffect: updateEffect,
};

const hookResolver = (name) => {
  const hookSet = Shared.hookSet;
  if (name in hookSet) return hookSet[name];
};

export const useRef = (initValue) => {
  return hookResolver("useRef")(initValue);
};

export const useState = (initValue) => {
  return hookResolver("useState")(initValue);
};

export const useMemo = (create, deps) => {
  return hookResolver("useMemo")(create, deps);
};

export const useCallback = (callback, deps) => {
  return hookResolver("useCallback")(callback, deps);
};

export const useEffect = (caller, deps) => {
  return hookResolver("useEffect")(caller, deps);
};
