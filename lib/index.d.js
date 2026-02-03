/**
 * @typedef {(keyof HTMLElementTagNameMap) | object | (props: ReactNodePropsType) => ReactNode} ReactElement
 */

/**
 * @typedef {ReactNode[] | ReactNode | string | boolean | number | null | undefined} ReactChildren
 */

/**
 * @typedef {object} RefObject<T>
 * @property {T} current
 */

/**
 * @typedef {object} ReactPropsType
 * @property {ReactChildren=} children
 * @property {RefObject=} ref
 * @property {string=} className
 * @property {FunctionConstructor<PointerEvent<HTMLElement>>=} onClick
 */

/**
 * @typedef {ReactPropsType } ReactNodePropsType
 */

/**
 * @typedef {{ memoizedValue: any, node: ReactNode }} HookType
 */

/**
 * @typedef {{ caller: Function, destroy: Function | null }} Effect
 */

/**
 * @typedef {object} ReactNode
 * @property {ReactElement} type
 * @property {Symbol=} tag
 * @property {any} props
 * @property {Record<string, ReactNode>} children
 * @property {HTMLElement=} domNode
 * @property {ReactNode=} parent
 * @property {Record<keyof HTMLElement, string | number>} domUpdateParams
 * @property {HookType[]=} hooks
 */

export {};
