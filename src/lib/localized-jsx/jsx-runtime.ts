import { jsx as reactJsx, jsxs as reactJsxs, Fragment } from 'react/jsx-runtime';
import { LocalizedElement, localizeChildren } from './element';
export { Fragment };
export type { JSX } from 'react';
function displayProps(props: unknown) {
  if (!props || typeof props !== 'object') return props;
  const source = props as Record<string, unknown>;
  return source['data-no-translate'] ? props : { ...source, children: localizeChildren(source['children']) };
}
export const jsx: typeof reactJsx = (type, props, key) => typeof type === 'string' ? reactJsx(LocalizedElement, { tag: type, source: props ?? {} }, key) : reactJsx(type, displayProps(props), key);
export const jsxs: typeof reactJsxs = (type, props, key) => typeof type === 'string' ? reactJsxs(LocalizedElement, { tag: type, source: props ?? {} }, key) : reactJsxs(type, displayProps(props), key);