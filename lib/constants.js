export const REACT_ELEMENT_TYPE = Symbol("ReactElement");
export const HTML_AS_COMPONENT = {
  FRAGMENT: 11,
};
export const REACT_TAGS = {
  HTML: Symbol("html"),
  FUNCTION_COMPONENT: Symbol("functionComponent"),
  CLASS_COMPONENT: Symbol("classComponent"),
  ROOT_COMPONENT: Symbol("rootComponent"),
  FRAGMENT: Symbol("fragment"),
};
export const VALID_HTML_TAG_MAPPING = [
  "ul",
  "ol",
  "li",
  "table",
  "thead",
  "th",
  "tr",
  "tbody",
  "td",
  "div",
  "span",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "button",
  "input",
].reduce((res, tag) => ({ ...res, [tag]: true }), {});
