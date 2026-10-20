import { jsx as reactJsx, jsxs as reactJsxs, Fragment } from 'react/jsx-runtime';
import { LocalizedElement } from './element';
import type { ElementType } from 'react';
export { Fragment };
export type { JSX } from 'react';
export const jsx: typeof reactJsx = (type: ElementType, props: Record<string, unknown>, key?: string) => typeof type === 'string' ? reactJsx(LocalizedElement, { tag: type, source: props }, key) : reactJsx(type, props, key);
export const jsxs: typeof reactJsxs = (type: ElementType, props: Record<string, unknown>, key?: string) => typeof type === 'string' ? reactJsxs(LocalizedElement, { tag: type, source: props }, key) : reactJsxs(type, props, key);