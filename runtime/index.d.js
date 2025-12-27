/**
 * @typedef {string | object | (props: ReactNodePropsType) => ReactNode} ReactElement
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
 * @typedef {object} ReactNode
 * @property {ReactElement} tag
 * @property {any} props
 * @property {Record<string, ReactNode>} children
 * @property {!ReactNode} owner
 */

export {};
