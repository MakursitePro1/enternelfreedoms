/** @jsxImportSource react */
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useServerFn } from '@tanstack/react-start';
import { englishCatalogue, translateText, type Lang } from './translation';
import { translatePublishedText } from './translations.functions';
import { LangContext } from './language-context';
import { readLanguagePreference, saveLanguagePreference } from './language-preference';
export { useLang } from './language-context';

export type { Lang } from './translation';
export const languages: { key: Lang; label: string }[] = [
  { key: 'bn', label: 'বাংলা' },
  { key: 'en', label: 'English' },
];

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('bn');
  const [extra, setExtra] = useState<Record<string, string>>({});
  const fetchTranslations = useServerFn(translatePublishedText);
  const attempted = useRef(new Set<string>());
  useEffect(() => {
    try {
      setLangState(readLanguagePreference(window.sessionStorage));
    } catch { /* Language selection also works when storage is disabled. */ }
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';
  }, [lang]);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { saveLanguagePreference(window.sessionStorage, l); } catch { /* Optional persistence. */ }
  }, []);
  const t = useCallback((source: string) => translateText(source, lang, extra), [lang, extra]);
  useEffect(() => {
    if (lang !== 'en') return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const collect = async () => {
      const missing = new Set<string>();
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentElement?.closest('script,style,input,textarea,[data-no-translate]')) continue;
        const text = node.textContent?.trim() ?? '';
        if (/[\u0980-\u09ef]/.test(text) && text.length <= 6000 && !englishCatalogue[text] && !extra[text] && !attempted.current.has(text)) missing.add(text);
      }
      const texts = [...missing].slice(0, 20);
      if (!texts.length) return;
      texts.forEach((text) => attempted.current.add(text));
      const translations = await fetchTranslations({ data: { texts } }).catch(() => ({}));
      if (alive && Object.keys(translations).length) setExtra((previous) => ({ ...previous, ...translations }));
      if (alive && missing.size > 20) timer = setTimeout(() => void collect(), 300);
    };
    const schedule = () => { if (timer) clearTimeout(timer); timer = setTimeout(() => void collect(), 250); };
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    schedule();
    return () => { alive = false; observer.disconnect(); if (timer) clearTimeout(timer); };
  }, [lang, extra, fetchTranslations]);
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

