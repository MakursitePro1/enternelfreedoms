import {createFileRoute} from '@tanstack/react-router';
import {Site,PageIntro} from '@/components/Site';
import {InstitutionSections} from '@/components/InstitutionSections';
import {seo} from '@/lib/seo';

export const Route=createFileRoute('/activities')({head:()=>seo('খবর ও অনুষ্ঠান','প্রতিষ্ঠানের প্রকাশিত অনুষ্ঠান ও কার্যক্রমের খবর।'),component:Activities});
function Activities(){return <Site><PageIntro eyebrow="আমাদের আয়োজন" title="খবর ও অনুষ্ঠান" description="প্রতিষ্ঠান থেকে প্রকাশিত আয়োজন এবং কার্যক্রমের তথ্য।"/><InstitutionSections kind="event" eyebrow="সাম্প্রতিক আয়োজন" title="প্রকাশিত খবর" empty="এখনো কোনো অনুষ্ঠান বা খবর প্রকাশিত হয়নি।"/></Site>}