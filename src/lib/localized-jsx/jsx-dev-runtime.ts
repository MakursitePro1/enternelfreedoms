import { jsxDEV as reactJsxDEV, Fragment } from 'react/jsx-dev-runtime';
import { LocalizedElement, localizeChildren } from './element';
export { Fragment };
export type { JSX } from 'react';
export const jsxDEV: typeof reactJsxDEV = (type, props, key, isStaticChildren, source, self) => {
  const original = (props ?? {}) as Record<string, unknown>;
  return typeof type === 'string' ? reactJsxDEV(LocalizedElement, { tag: type, source: original }, key, isStaticChildren, source, self) : reactJsxDEV(type, original['data-no-translate'] ? props : { ...original, children: localizeChildren(original['children']) }, key, isStaticChildren, source, self);
};