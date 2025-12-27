/**
 * @typedef {any} T
 */

/**
 * @typedef {T | (prev: T) => void} SetterValue
 */

/**
 * Hook to submit change and invoke rerendering on a component
 * @param {T} initValue
 * @returns {[T, SetterValue]}
 */
export const useState = (initValue) => {
  const memoized = {
    value: initValue,
  };

  const getter = () => {
    return memoized.value;
  };

  /**
   * @param {SetterValue} newValue
   */
  const setter = (newValue) => {
    if (
      typeof newValue === "function" &&
      /** @type {Function} */ (newValue)?.length === 1
    ) {
      memoized.value = newValue(memoized.value);
    } else {
      memoized.value = newValue;
    }
  };

  return [getter(), setter];
};

/**
 * Store ref value
 * @param {T} initValue
 * @returns {import("./index.d").RefObject}
 */
export const useRef = (initValue) => {
  const _ref = {
    current: initValue,
  };

  return _ref;
};
