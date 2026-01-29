import { Shared } from "lib/shared";
import { updateNode } from "./renderer";

const InitialHook = function (initValue) {
  this.memoizedValue = initValue;
  this.node = Shared.renderringNode;

  if (Shared.renderringHooks?.length) {
    Shared.renderringHooks.push(this);
  } else {
    Shared.renderringNode.hooks = Shared.renderringHooks = [this];
  }
};

const InprogressHook = function (initvalue) {
  
}

const mountState = (initValue) => {
  const hook = new InitialHook(initValue);

  // aim to perform batch update
  hook.lastState = initValue;

  function dispatch(value) {
    let newValue;

    if (typeof value === "function") {
      newValue = value(hook.lastState);
    } else {
      newValue = value;
    }

    // fast path
    if (newValue === hook.lastState) return;

    // schedule a state update because there can be batch updates
    // for a seri of state change =>

    hook.memoizedValue = hook.lastState = newValue;

    updateNode(hook.node);
  }

  hook.lastDispatch = dispatch;

  return [hook.memoizedValue, dispatch];
};

const updateState = (value) => {};

const mountRef = (initValue) => {
  const hook = new InitialHook({ current: initValue });

  return hook.memoizedValue;
};

export const MountHookSet = {
  useState: mountState,
  useRef: mountRef,
};

export const UpdateHookSet = {
  useState: updateState,
  useRef: mountRef,
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
