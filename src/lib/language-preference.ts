import type { Lang } from './translation';

const key = 'ef-lang';
type LanguageStorage = Pick<Storage, 'getItem' | 'setItem'>;

export function readLanguagePreference(storage: LanguageStorage): Lang {
  try { return storage.getItem(key) === 'en' ? 'en' : 'bn'; }
  catch { return 'bn'; }
}

export function saveLanguagePreference(storage: LanguageStorage, lang: Lang) {
  try { storage.setItem(key, lang); }
  catch { /* Language selection still works without persistence. */ }
}