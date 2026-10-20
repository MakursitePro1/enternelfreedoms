import catalogue from './translations/en.json';

export type Lang = 'bn' | 'en';
export const englishCatalogue: Record<string, string> = catalogue;
export function translateText(source: string, lang: Lang, extra: Record<string, string> = {}): string {
  if (lang === 'bn' || !source) return source;
  const normalized = source.replace(/\s+/g, ' ').trim();
  const exact = extra[source] ?? englishCatalogue[source] ?? extra[normalized] ?? englishCatalogue[normalized];
  if (exact !== undefined) return source.replace(source.trim(), exact);
  // Composed labels retain their numbers, punctuation and layout.
  return source.split(/(\n)/).map((line) => {
    const text = line.trim();
    return line.replace(text, extra[text] ?? englishCatalogue[text] ?? text);
  }).join('').replace(/[০-৯]/g, (digit) => String('০১২৩৪৫৬৭৮৯'.indexOf(digit))).replace(/।/g, '.');
}