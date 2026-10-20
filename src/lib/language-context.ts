import { createContext, useContext } from 'react';
import type { Lang } from './translation';
export type LanguageContextValue = { lang: Lang; setLang: (lang: Lang) => void; t: (source: string) => string };
export const LangContext = createContext<LanguageContextValue>({ lang: 'bn', setLang: () => {}, t: (source) => source });
export function useLang() { return useContext(LangContext); }