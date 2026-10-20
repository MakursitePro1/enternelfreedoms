/** @jsxImportSource react */
import { createElement, forwardRef, type ReactNode, type ElementType } from 'react';
import { useLang } from '../language-context';

type Props = { tag: string; source: Record<string, unknown> };
const attributes = ['placeholder', 'title', 'alt', 'aria-label', 'aria-description', 'label'];

export const LocalizedElement = forwardRef<HTMLElement, Props>(function LocalizedElement({ tag, source, ...forwarded }, forwardedRef) {
  const { t } = useLang();
  const original: Record<string, unknown> = { ...source, ...forwarded };
  const props: Record<string, unknown> = { ...original };
  if (forwardedRef) props['ref'] = forwardedRef;
  if (!props['data-no-translate'] && !['script', 'style', 'textarea'].includes(tag)) {
    const text = (child: unknown): unknown => typeof child === 'string' ? t(child) : Array.isArray(child) ? child.map(text) : child;
    props['children'] = text(original['children']) as ReactNode;
    for (const name of attributes) if (typeof original[name] === 'string') props[name] = t(original[name] as string);
    // An option's displayed language must never change the submitted value.
    if (tag === 'option' && original['value'] === undefined && typeof original['children'] === 'string') props['value'] = original['children'];
  }
  if (tag === 'textarea' && typeof original['placeholder'] === 'string') props['placeholder'] = t(original['placeholder']);
  return createElement(tag as ElementType, props);
});

export function LocalizedText({ text }: { text: string }) {
  const { t } = useLang();
  return t(text);
}

export function localizeChildren(child: unknown): unknown {
  return typeof child === 'string' ? createElement(LocalizedText, { text: child }) : Array.isArray(child) ? child.map((entry, index) => typeof entry === 'string' ? createElement(LocalizedText, { text: entry, key: index }) : localizeChildren(entry)) : child;
}