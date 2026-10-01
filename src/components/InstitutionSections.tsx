import { Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Heading } from '@/components/Site';
import { useInstitutionContent, type ContentKind, type InstitutionItem } from '@/lib/institution-content';

export function InstitutionSections({kind,eyebrow,title,empty,limit}:{kind:ContentKind;eyebrow:string;title:string;empty?:string;limit?:number}) {
  const items=useInstitutionContent(kind);
  const visible=limit?items.slice(0,limit):items;
  if(!visible.length&&!empty)return null;
  return <section className="bg-secondary px-5 py-20 lg:px-8"><div className="mx-auto max-w-7xl"><Heading eyebrow={eyebrow} title={title}/>{visible.length?<div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{visible.map(item=><InstitutionCard key={item.id} item={item}/>)}</div>:<p className="text-muted-foreground">{empty}</p>}</div></section>;
}

export function InstitutionCard({item}:{item:InstitutionItem}){
  const isVideo=item.kind==='gallery' && item.category==='ভিডিও';
  return <article className="overflow-hidden bg-background premium-card">{item.image_url&&(isVideo?<div className="aspect-video bg-primary"><iframe title={item.title} src={item.image_url} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="h-full w-full"/></div>:<img src={item.image_url} alt={item.title} loading="lazy" className="aspect-[4/3] w-full object-cover"/>)}<div className="p-6">{item.category&&!isVideo&&<span className="text-xs font-semibold text-gold">{item.category}</span>}<h3 className="mt-2 font-display text-xl font-semibold text-primary">{item.title}</h3>{item.detail&&<p className="mt-2 text-sm font-medium text-primary">{item.detail}</p>}{item.body&&<p className="mt-3 whitespace-pre-line leading-7 text-muted-foreground">{item.body}</p>}</div></article>;
}

export function ActivitiesTeaser(){const items=useInstitutionContent('event');if(!items.length)return null;return <section className="px-5 py-20 lg:px-8"><div className="mx-auto max-w-7xl"><div className="flex flex-wrap items-end justify-between gap-4"><Heading eyebrow="সাম্প্রতিক আয়োজন" title="প্রতিষ্ঠানের খবর ও অনুষ্ঠান"/><Link to="/activities" className="inline-flex items-center gap-2 font-semibold text-primary">সব খবর <ArrowUpRight className="size-4"/></Link></div><div className="grid gap-5 md:grid-cols-3">{items.slice(0,3).map(item=><InstitutionCard key={item.id} item={item}/>)}</div></div></section>}