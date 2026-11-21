import { ExternalLink } from 'lucide-react';

type Section = { title: string; lines: string[] };

function parse(text: string) {
  const paras = text.split(/\n\s*\n/).map((p) => p.split('\n').map((l) => l.trim()).filter(Boolean)).filter((p) => p.length);
  const intro: string[] = [];
  const sections: Section[] = [];
  for (const p of paras) {
    const first = p[0] ?? '';
    const isHeading = first.length < 60 && !/[।.:,)]$/.test(first) && !first.startsWith('http') && (p.length > 1 || /^[^\p{L}\p{N}]/u.test(first) && first.length < 40 && sections.length > 0);
    if (isHeading && p.length > 1) sections.push({ title: first, lines: p.slice(1) });
    else if (sections.length === 0) intro.push(...p);
    else sections[sections.length - 1]!.lines.push(...p);
  }
  return { intro, sections };
}

function Line({ text }: { text: string }) {
  if (/^https:\/\//.test(text)) return <a href={text} target="_blank" rel="noopener noreferrer" className="inline-flex max-w-full items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"><ExternalLink className="size-3.5 shrink-0" /><span className="truncate">{text.replace('https://', '')}</span></a>;
  return <span className="break-words">{text.replace(/\uFE0F?\u20E3/g, ". ").replace(/\uFE0F/g, "")}</span>;
}

export function AdmissionNotice({ text }: { text: string }) {
  const { intro, sections } = parse(text);
  return <div className="space-y-5">
    {intro.length > 0 && <div className="rounded-2xl border-l-4 border-gold bg-secondary p-5 sm:p-7">
      <div className="space-y-3 text-sm leading-7 text-foreground sm:text-base sm:leading-8">{intro.map((l, i) => <p key={i} className={i === 0 ? 'font-display text-lg font-bold text-primary' : ''}><Line text={l} /></p>)}</div>
    </div>}
    <div className="grid gap-4 md:grid-cols-2">
      {sections.map((s, i) => <article key={i} className={`flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm ${s.lines.length > 9 ? 'md:col-span-2' : ''}`}>
        <header className="flex items-center gap-3 bg-primary px-4 py-3.5 text-primary-foreground sm:px-5">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gold text-sm font-bold text-primary">{i + 1}</span>
          <h3 className="font-display text-base font-bold leading-snug sm:text-lg">{s.title}</h3>
        </header>
        <ul className={`grid gap-2.5 p-4 text-sm leading-7 text-foreground sm:p-5 ${s.lines.length > 9 ? 'lg:grid-cols-2 lg:gap-x-8' : ''}`}>
          {s.lines.map((l, j) => <li key={j} className="flex min-w-0 gap-2.5 border-b border-border pb-2.5 last:border-0 last:pb-0">
            {!/^https:\/\//.test(l) && <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold" />}<Line text={l} />
          </li>)}
        </ul>
      </article>)}
    </div>
  </div>;
}
