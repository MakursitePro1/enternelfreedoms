import { jsxDEV as reactJsxDEV, Fragment } from 'react/jsx-dev-runtime';
import { LocalizedElement } from './element';
export { Fragment };
export type { JSX } from 'react';
export const jsxDEV: typeof reactJsxDEV = (type, props, key, isStaticChildren, source, self) => typeof type === 'string' ? reactJsxDEV(LocalizedElement, { tag: type, source: props }, key, isStaticChildren, source, self) : reactJsxDEV(type, props, key, isStaticChildren, source, self);