import catalogue from './translations/en.json';

export type Lang = 'bn' | 'en';
export const englishCatalogue: Record<string, string> = catalogue;
const phrasePattern = new RegExp(`(?<![\\u0980-\\u09ff])(?:${Object.keys(englishCatalogue).filter((key) => /[\u0980-\u09ef]/.test(key) && key.length >= 2 && key.length <= 100).sort((a, b) => b.length - a.length).map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![\\u0980-\\u09ff])`, 'g');
export function translateText(source: string, lang: Lang, extra: Record<string, string> = {}): string {
  if (lang === 'bn' || !source) return source;
  const normalized = source.replace(/\s+/g, ' ').trim();
  const exact = extra[source] ?? englishCatalogue[source] ?? extra[normalized] ?? englishCatalogue[normalized];
  if (exact !== undefined) return source.replace(source.trim(), exact);
  // Composed labels retain their numbers, punctuation and layout.
  return source.split(/(\n)/).map((line) => {
    const text = line.trim();
    const candidate = extra[text] ?? englishCatalogue[text] ?? text.replace(phrasePattern, (phrase) => englishCatalogue[phrase] ?? phrase);
    return line.replace(text, /[\u0980-\u09df]/.test(candidate) ? text : candidate);
  }).join('').replace(/[০-৯]/g, (digit) => String('০১২৩৪৫৬৭৮৯'.indexOf(digit))).replace(/।/g, '.');
}