/** @jsxImportSource react */
import { createElement, type ReactNode, type ElementType } from 'react';
import { useLang } from '../i18n';

type Props = { tag: string; source: Record<string, unknown> };
const attributes = ['placeholder', 'title', 'alt', 'aria-label', 'aria-description', 'label'];

export function LocalizedElement({ tag, source }: Props) {
  const { t } = useLang();
  const props = { ...source };
  if (!props['data-no-translate'] && !['script', 'style', 'textarea'].includes(tag)) {
    const text = (child: unknown): unknown => typeof child === 'string' ? t(child) : Array.isArray(child) ? child.map(text) : child;
    props['children'] = text(source['children']) as ReactNode;
    for (const name of attributes) if (typeof source[name] === 'string') props[name] = t(source[name] as string);
    // An option's displayed language must never change the submitted value.
    if (tag === 'option' && source['value'] === undefined && typeof source['children'] === 'string') props['value'] = source['children'];
  }
  if (tag === 'textarea' && typeof source['placeholder'] === 'string') props['placeholder'] = t(source['placeholder']);
  return createElement(tag as ElementType, props);
}