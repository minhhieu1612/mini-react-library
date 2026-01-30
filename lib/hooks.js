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
  const previous =
    Shared.previousHooks[node.hooks?.length ?? 0];

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
  hook.node = Shared.renderringNode;

  hook.lastDispatch = function dispatchSetState(value) {
    let newValue;

    if (!this.node) {
      console.error(
        "Likely the rendering hook was staled which is no longer " +
          "attached to any react node instance, check whether the invoker was removed properly",
      );
      return;
    }

    if (typeof value === "function") {
      newValue = value(this.lastState);
    } else {
      newValue = value;
    }

    // fast path
    if (newValue === this.lastState) return;

    // schedule a state update because there can be batch updates
    // for a seri of state change =>

    this.memoizedValue = this.lastState = newValue;

    updateContainer(this.node);
  };

  return [hook.memoizedValue, hook.lastDispatch.bind(hook)];
};

const updateState = () => {
  const hook = new InprogressHook();

  hook.lastState = hook.previous.lastState;
  hook.node = Shared.renderringNode;
  hook.lastDispatch = hook.previous.lastDispatch;
  hook.previous.node = null;
  hook.unlinkPrevious();

  return [hook.memoizedValue, hook.lastDispatch.bind(hook)];
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

export const MountHookSet = {
  useState: mountState,
  useRef: mountRef,
};

export const UpdateHookSet = {
  useState: updateState,
  useRef: updateRef,
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
