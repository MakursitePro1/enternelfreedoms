import campusBoys from '@/assets/eternal-1.jpg.asset.json';
import campusGirls from '@/assets/eternal-2.jpg.asset.json';
import campusGroup from '@/assets/eternal-3.jpg.asset.json';
import campusGathering from '@/assets/eternal-5.jpg.asset.json';
import student from '@/assets/eternal-8.jpg.asset.json';
import principal from '@/assets/eternal-9.jpg.asset.json';
import dorm from '@/assets/facility-dorm.jpg';
import dining from '@/assets/facility-dining.jpg';
import classroom from '@/assets/facility-classroom.jpg';
import playground from '@/assets/facility-playground.jpg';
import library from '@/assets/facility-library.jpg';
import quran from '@/assets/facility-quran.jpg';
import cover1 from '@/assets/book-cover-1.jpg';
import cover2 from '@/assets/book-cover-2.jpg';

export const photos: [string, string, string, string, string, string] = [campusBoys.url, campusGirls.url, campusGroup.url, campusGathering.url, student.url, principal.url];
export const facilityImages = { dorm, dining, classroom, playground, library, quran } as { dorm: string; dining: string; classroom: string; playground: string; library: string; quran: string };
export type FacilityImageKey = keyof typeof facilityImages;
export const facilityImageList: string[] = [dorm, classroom, quran, library, dining, playground];
export const bookCovers: string[] = [cover1, cover2];
/** Cycles through a non-empty list without returning undefined. */
export function pick(list: readonly string[], index: number): string {
  return list[index % list.length] ?? list[0] ?? '';
}
export function facilityImage(key: string | null | undefined): string | undefined {
  return key && key in facilityImages ? facilityImages[key as FacilityImageKey] : undefined;
}

/** Primary navigation shown in the header. */
export const nav = [
  ['/', 'হোম'],
  ['/about', 'প্রতিষ্ঠান পরিচিতি'],
  ['/academics', 'শিক্ষা কার্যক্রম'],
  ['/residential', 'আবাসিক জীবন'],
  ['/admission', 'ভর্তি'],
  ['/books', 'বইয়ের দোকান'],
  ['/notices', 'নোটিশ'],
] as const;
/** Secondary navigation grouped under "আরও". */
export const moreNav = [
  ['/teachers', 'শিক্ষকমণ্ডলী'],
  ['/campus', 'ক্যাম্পাস ও সুবিধা'],
  ['/activities', 'খবর ও অনুষ্ঠান'],
  ['/gallery', 'গ্যালারি'],
  ['/faq', 'অভিভাবক নির্দেশিকা'],
  ['/contact', 'যোগাযোগ'],
] as const;
export const allNav = [...nav, ...moreNav];

export type Program = {
  slug: string; name: string; group: string; text: string; number: string; image: string;
  classes: string; age: string; duration: string;
  goals: string[]; activities: string[]; benefits: string[]; schedule: string;
};
export const programs: Program[] = [
  { slug: 'general', image: facilityImages.classroom, number: '০১', group: 'সাধারণ শিক্ষা', name: 'সাধারণ শিক্ষা (প্লে – দশম / দাখিল)', text: 'প্লে থেকে দশম শ্রেণি / দাখিল পর্যন্ত জাতীয় পাঠক্রমের সঙ্গে ইসলামি মূল্যবোধের সমন্বয়।', classes: 'প্লে, নার্সারি, ১ম – ১০ম শ্রেণি', age: '৪ – ১৬ বছর', duration: 'বার্ষিক শিক্ষাবর্ষ (জানুয়ারি – ডিসেম্বর)', goals: ['জাতীয় পাঠক্রম অনুযায়ী মানসম্মত শিক্ষা', 'বাংলা, ইংরেজি, গণিত ও বিজ্ঞানে দৃঢ় ভিত্তি', 'এসএসসি / দাখিল পরীক্ষার জন্য পূর্ণ প্রস্তুতি'], activities: ['নিয়মিত ক্লাস ও সাপ্তাহিক মূল্যায়ন', 'মাসিক পরীক্ষা ও অভিভাবককে ফলাফল প্রদান', 'দুর্বল শিক্ষার্থীদের জন্য অতিরিক্ত যত্ন'], benefits: ['সীমিত শিক্ষার্থী সংখ্যায় ব্যক্তিগত মনোযোগ', 'দ্বীনি পরিবেশে সাধারণ শিক্ষা', 'রাতের তত্ত্বাবধানে পড়াশোনা'], schedule: 'সকাল ৮:০০ – দুপুর ১:০০ (শ্রেণিভেদে পরিবর্তনযোগ্য)' },
  { slug: 'nurani', image: facilityImages.quran, number: '০২', group: 'কুরআন শিক্ষা', name: 'নূরানী বিভাগ', text: 'শিশুর প্রাথমিক কুরআন শিক্ষা, শুদ্ধ উচ্চারণ ও আদব-আখলাকের ভিত্তি।', classes: 'নূরানী ১ম – ৩য় স্তর', age: '৫ – ৮ বছর', duration: '১ – ২ বছর', goals: ['আরবি হরফ ও মাখরাজের শুদ্ধ উচ্চারণ', 'নামাজের প্রয়োজনীয় সূরা ও দোয়া মুখস্থ', 'ইসলামি আদব ও শিষ্টাচার শেখা'], activities: ['নূরানী কায়দা অনুশীলন', 'দৈনিক দোয়া ও মাসআলা', 'বাংলা, ইংরেজি ও গণিতের প্রাথমিক পাঠ'], benefits: ['শিশুবান্ধব পাঠদান', 'অভিজ্ঞ ক্বারী শিক্ষক', 'নাজেরা ও হিফজে যাওয়ার মজবুত ভিত্তি'], schedule: 'ফজরের পর ও সকাল ৮:০০ – দুপুর ১২:০০' },
  { slug: 'nazera', image: photos[4], number: '০৩', group: 'কুরআন শিক্ষা', name: 'নাজেরা বিভাগ', text: 'মাখরাজ ও তাজবিদের প্রতি যত্ন রেখে দেখে দেখে কুরআন তিলাওয়াতের অনুশীলন।', classes: 'নাজেরা পূর্ণ কুরআন', age: '৭ – ১২ বছর', duration: '১ – ১.৫ বছর', goals: ['সম্পূর্ণ কুরআন শুদ্ধভাবে দেখে পড়া', 'তাজবিদের নিয়ম প্রয়োগ', 'হিফজের প্রস্তুতি'], activities: ['প্রতিদিন নির্দিষ্ট পারা তিলাওয়াত', 'শিক্ষকের সামনে শুনানি', 'সাপ্তাহিক তাজবিদ মূল্যায়ন'], benefits: ['ব্যক্তিগত তত্ত্বাবধান', 'নিয়মিত অগ্রগতি রিপোর্ট', 'সুন্দর তিলাওয়াতের চর্চা'], schedule: 'ফজরের পর, সকাল ও আসরের পর' },
  { slug: 'hifz', image: photos[0], number: '০৪', group: 'কুরআন শিক্ষা', name: 'হিফজ ও হিফজ শুনানি', text: 'নিয়মিত সবক, সাতসবক, আমুখতা ও শুনানির মাধ্যমে কুরআন মুখস্থ ও সংরক্ষণ।', classes: 'হিফজ (৩০ পারা) ও শুনানি', age: '৮ – ১৫ বছর', duration: '২ – ৩ বছর (শিক্ষার্থীভেদে)', goals: ['পূর্ণ কুরআন হিফজ সম্পন্ন করা', 'মুখস্থ অংশ স্থায়ীভাবে সংরক্ষণ', 'হাফেজদের শুনানি ও দাওর'], activities: ['দৈনিক সবক, সাতসবক ও আমুখতা', 'সাপ্তাহিক পারা শুনানি', 'হিফজ প্রতিযোগিতায় অংশগ্রহণ'], benefits: ['অভিজ্ঞ হাফেজ শিক্ষক', 'ফজর থেকে রাত পর্যন্ত তত্ত্বাবধান', 'স্বাস্থ্য ও বিশ্রামের প্রতি যত্ন'], schedule: 'তাহাজ্জুদ/ফজর থেকে রাত ৯:৩০ পর্যন্ত নির্ধারিত রুটিন' },
  { slug: 'kitab', image: facilityImages.library, number: '০৫', group: 'ইসলামিক স্টাডিজ', name: 'কিতাব বিভাগ', text: 'আরবি ভাষা, নাহু-সরফ, ফিকহ, হাদিস ও তাফসিরের ধারাবাহিক পাঠ।', classes: 'ইবতেদায়ি থেকে উচ্চতর কিতাব জামাত', age: '১০ বছর ও তদূর্ধ্ব', duration: 'জামাতভিত্তিক বার্ষিক কোর্স', goals: ['আরবি ভাষায় দক্ষতা', 'ফিকহ, হাদিস ও আকিদার মৌলিক জ্ঞান', 'দ্বীনের সঠিক বুঝ ও আমল'], activities: ['কিতাবভিত্তিক দরস', 'আরবি কথোপকথন চর্চা', 'মাসিক মূল্যায়ন ও বার্ষিক পরীক্ষা'], benefits: ['অভিজ্ঞ আলেম শিক্ষক', 'লাইব্রেরি সুবিধা', 'সাধারণ বিষয়েরও পাঠ'], schedule: 'সকাল ৮:০০ – দুপুর ১:০০ ও রাতের মুতালাআ' },
  { slug: 'english', image: photos[3], number: '০৬', group: 'বিশেষ কার্যক্রম', name: 'স্পোকেন ইংলিশ', text: 'আত্মবিশ্বাসের সঙ্গে ইংরেজিতে কথা বলা ও লেখার নিয়মিত চর্চা।', classes: 'সকল বিভাগের আগ্রহী শিক্ষার্থী', age: 'সকল বয়স', duration: 'সাপ্তাহিক নিয়মিত ক্লাস', goals: ['দৈনন্দিন ইংরেজি কথোপকথন', 'উচ্চারণ ও শব্দভাণ্ডার বৃদ্ধি', 'উপস্থাপনায় আত্মবিশ্বাস'], activities: ['কথোপকথন চর্চা', 'ইংরেজি বক্তৃতা ও উপস্থাপনা', 'শব্দ শেখার খেলা'], benefits: ['ছোট দলে অনুশীলন', 'ভবিষ্যৎ শিক্ষায় সহায়ক'], schedule: 'সপ্তাহে ৩ দিন, বিকেল' },
  { slug: 'ict', image: photos[1], number: '০৭', group: 'বিশেষ কার্যক্রম', name: 'আইসিটি', text: 'কম্পিউটারের মৌলিক ব্যবহার, টাইপিং ও প্রযুক্তি সচেতনতা।', classes: '৩য় শ্রেণি ও তদূর্ধ্ব', age: '৮ বছর ও তদূর্ধ্ব', duration: 'সাপ্তাহিক নিয়মিত ক্লাস', goals: ['কম্পিউটারের মৌলিক ধারণা', 'বাংলা ও ইংরেজি টাইপিং', 'নিরাপদ ইন্টারনেট ব্যবহার'], activities: ['ল্যাবে হাতে-কলমে চর্চা', 'ছোট প্রজেক্ট'], benefits: ['আধুনিক দক্ষতা', 'ভবিষ্যৎ কর্মজীবনে সহায়ক'], schedule: 'সপ্তাহে ২ দিন' },
  { slug: 'life-skills', image: facilityImages.playground, number: '০৮', group: 'বিশেষ কার্যক্রম', name: 'জীবনদক্ষতা ও খেলাধুলা', text: 'আদব-আখলাক, নেতৃত্ব, পরিচ্ছন্নতা, খেলাধুলা ও সুস্থ জীবনযাপন।', classes: 'সকল শিক্ষার্থী', age: 'সকল বয়স', duration: 'সারা বছর', goals: ['দায়িত্বশীলতা ও নেতৃত্ব', 'শারীরিক সুস্থতা', 'দলগত কাজের অভ্যাস'], activities: ['বিকেলে ফুটবল, ভলিবল ও দৌড়', 'বক্তৃতা ও সাংস্কৃতিক অনুষ্ঠান', 'পরিচ্ছন্নতা অভিযান'], benefits: ['সুস্থ দেহ ও মন', 'সামাজিক দক্ষতা'], schedule: 'প্রতিদিন আসরের পর' },
];

/** The 14-step daily routine from the proposal. */
export const dayTimeline: [string, string, string][] = [
  ['ভোর ৪:৪৫', 'ফজর', 'জামাতে ফজরের নামাজ ও মাসনুন আমল'],
  ['ভোর ৫:৩০', 'কুরআন শিক্ষা', 'সবক, তিলাওয়াত ও হিফজের পাঠ'],
  ['সকাল ৭:৩০', 'নাশতা', 'নিজস্ব বেকারি ও রান্নাঘরের পুষ্টিকর নাশতা'],
  ['সকাল ৮:০০', 'একাডেমিক ক্লাস', 'সাধারণ ও কিতাব বিভাগের নিয়মিত ক্লাস'],
  ['দুপুর ১:০০', 'দুপুরের খাবার', 'জোহরের নামাজ ও মধ্যাহ্নভোজ'],
  ['দুপুর ১:৪৫', 'বিশ্রাম', 'কায়লুলা — শরীর ও মনের প্রশান্তি'],
  ['দুপুর ২:৩০', 'পাঠাভ্যাস', 'শিক্ষকের তত্ত্বাবধানে পড়া তৈরি'],
  ['বিকেল ৪:১৫', 'আসর', 'জামাতে আসরের নামাজ'],
  ['বিকেল ৪:৪৫', 'খেলাধুলা', 'মাঠে ফুটবল, ভলিবল ও শরীরচর্চা'],
  ['সন্ধ্যা ৬:০০', 'মাগরিব', 'জামাতে মাগরিব ও দোয়া'],
  ['সন্ধ্যা ৬:৩০', 'কুরআন চর্চা', 'আমুখতা ও তিলাওয়াত'],
  ['রাত ৮:০০', 'রাতের খাবার', 'এশার নামাজ ও রাতের খাবার'],
  ['রাত ৮:৪৫', 'পড়াশোনা', 'পরদিনের পড়া প্রস্তুতি'],
  ['রাত ১০:০০', 'ঘুম', 'মাসনুন দোয়া পড়ে বিশ্রাম'],
];
export const routine = dayTimeline.map(([t, a]) => [t, a]);

export const whyCards = [
  { title: 'কুরআনকেন্দ্রিক শিক্ষা', text: 'কুরআন শিক্ষার সঙ্গে সাধারণ শিক্ষার সমন্বিত ব্যবস্থা।', icon: 'book' },
  { title: 'সমন্বিত পাঠক্রম', text: 'দুনিয়াবি ও ইসলামী শিক্ষার ভারসাম্যপূর্ণ সমন্বয়।', icon: 'grad' },
  { title: 'পূর্ণাঙ্গ আবাসিক ব্যবস্থা', text: 'পড়াশোনা, থাকা, খাবার ও দৈনন্দিন জীবন—একটি সুশৃঙ্খল পরিবেশে।', icon: 'home' },
  { title: 'নিরাপদ ও তত্ত্বাবধানে', text: 'সিসিটিভি পর্যবেক্ষণ, নিয়ন্ত্রিত পরিবেশ ও প্রয়োজনীয় তত্ত্বাবধান।', icon: 'shield' },
  { title: 'চরিত্র ও জীবনদক্ষতা', text: 'আদব-আখলাকের পাশাপাশি প্রয়োজনীয় আধুনিক দক্ষতার বিকাশ।', icon: 'heart' },
  { title: 'শিক্ষা + খেলাধুলা', text: 'শিক্ষার পাশাপাশি খেলাধুলা ও সুস্থ জীবনযাপনের সুযোগ।', icon: 'trophy' },
] as const;

export const parentQuestions = [
  { q: 'আমার সন্তান কোথায় থাকবে?', a: 'পরিচ্ছন্ন আবাসিক কক্ষে, আলাদা বিছানায়, দায়িত্বপ্রাপ্ত শিক্ষকের তত্ত্বাবধানে।', img: 'dorm' },
  { q: 'কী খাবে?', a: 'নিজস্ব রান্নাঘরে তৈরি তিনবেলা পুষ্টিকর খাবার ও বেকারির টাটকা নাশতা।', img: 'dining' },
  { q: 'পরিষ্কার-পরিচ্ছন্নতা কেমন?', a: 'নিয়মিত পরিচ্ছন্নতা, বিশুদ্ধ পানি, লন্ড্রি ও স্বাস্থ্যসম্মত বাথরুম।', img: 'dorm' },
  { q: 'সারাদিন কী করবে?', a: 'নামাজ, কুরআন, ক্লাস, বিশ্রাম, খেলাধুলা ও পড়াশোনার সুশৃঙ্খল রুটিন।', img: 'quran' },
  { q: 'নিরাপত্তা কেমন?', a: 'সিসিটিভি, নিয়ন্ত্রিত প্রবেশ ও ২৪ ঘণ্টা তত্ত্বাবধান।', img: 'classroom' },
] as const;

export const admissionSteps = [
  ['তথ্য জানুন', 'বিভাগ, যোগ্যতা, ফি ও প্রয়োজনীয় কাগজপত্র দেখে নিন।'],
  ['অনলাইনে আবেদন', 'ঘরে বসেই ফর্ম পূরণ করে ছবি ও কাগজপত্র যুক্ত করুন।'],
  ['সাক্ষাৎ ও মূল্যায়ন', 'নির্ধারিত দিনে শিক্ষার্থীর মৌখিক মূল্যায়ন ও অভিভাবক সাক্ষাৎ।'],
  ['ভর্তি সম্পন্ন', 'ফি পরিশোধ করে ভর্তি নিশ্চিত করুন ও আবাসনে উঠুন।'],
] as const;
export const requiredDocs = ['শিক্ষার্থীর জন্মনিবন্ধন সনদের কপি', 'শিক্ষার্থীর ২ কপি পাসপোর্ট সাইজ ছবি', 'পিতা/মাতা বা অভিভাবকের জাতীয় পরিচয়পত্রের কপি', 'আগের প্রতিষ্ঠানের ছাড়পত্র / প্রত্যয়নপত্র (যদি থাকে)', 'সর্বশেষ পরীক্ষার মার্কশিট (সাধারণ শিক্ষার ক্ষেত্রে)'];
export const eligibility = ['নূরানী: ৫ – ৮ বছর বয়সী শিশু', 'নাজেরা: আরবি হরফ চেনা ও প্রাথমিক পাঠ জানা', 'হিফজ: নাজেরা সম্পন্ন অথবা সাবলীল দেখে পড়তে পারা', 'কিতাব: হিফজ / নাজেরা সম্পন্ন ও প্রাথমিক আরবি জ্ঞান', 'সাধারণ শিক্ষা: আগের শ্রেণি উত্তীর্ণ হওয়ার প্রমাণ'];

export const galleryCategories = ['ক্যাম্পাস', 'শ্রেণিকক্ষ', 'কুরআন শিক্ষা', 'হিফজ', 'নাজেরা', 'কিতাব', 'আবাসিক জীবন', 'খাবার ও রান্নাঘর', 'খেলাধুলা', 'অনুষ্ঠান', 'শিক্ষকবৃন্দ', 'শিক্ষার্থীদের কার্যক্রম'];
export const galleryPhotos: { src: string; category: string; alt: string }[] = [
  { src: photos[2], category: 'ক্যাম্পাস', alt: 'শিক্ষার্থী ও শিক্ষকদের সম্মিলিত ছবি' },
  { src: facilityImages.classroom, category: 'শ্রেণিকক্ষ', alt: 'শ্রেণিকক্ষে পাঠরত শিক্ষার্থীরা' },
  { src: facilityImages.quran, category: 'কুরআন শিক্ষা', alt: 'রেহালে কুরআন তিলাওয়াত' },
  { src: photos[0], category: 'হিফজ', alt: 'হিফজ বিভাগের শিক্ষার্থীরা' },
  { src: photos[4], category: 'নাজেরা', alt: 'কুরআন পড়ছে একজন শিক্ষার্থী' },
  { src: facilityImages.library, category: 'কিতাব', alt: 'লাইব্রেরি ও কিতাব' },
  { src: facilityImages.dorm, category: 'আবাসিক জীবন', alt: 'আবাসিক কক্ষ' },
  { src: facilityImages.dining, category: 'খাবার ও রান্নাঘর', alt: 'ডাইনিংয়ে খাবার পরিবেশন' },
  { src: facilityImages.playground, category: 'খেলাধুলা', alt: 'খেলার মাঠে শিক্ষার্থীরা' },
  { src: photos[3], category: 'অনুষ্ঠান', alt: 'প্রতিষ্ঠানের অনুষ্ঠান' },
  { src: photos[5], category: 'শিক্ষকবৃন্দ', alt: 'প্রতিষ্ঠাতা ও অধ্যক্ষ' },
  { src: photos[1], category: 'শিক্ষার্থীদের কার্যক্রম', alt: 'শিক্ষার্থীদের কার্যক্রম' },
];

export const facilities = ['আবাসিক কক্ষ ও তিন স্তরের বিছানা', 'পাঠকক্ষ ও লাইব্রেরি', 'নিজস্ব রান্নাঘর ও ডাইনিং', 'গরম, ঠান্ডা ও সাধারণ পানির ব্যবস্থা', 'কাপড় ধোয়ার ব্যবস্থা', 'চিকিৎসা সহায়তা', 'খেলাধুলা ও বিনোদন', 'সিসিটিভি ও তত্ত্বাবধান'];

export const parentRules = ['আবাসিক শিক্ষার্থীদের মোবাইল ফোন রাখা নিষেধ', 'নির্ধারিত সাক্ষাৎ দিবসে অভিভাবক দেখা করতে পারবেন', 'ছুটি শেষে নির্ধারিত দিনে প্রতিষ্ঠানে ফেরা বাধ্যতামূলক', 'প্রতিষ্ঠানের নির্ধারিত পোশাক পরিধান করতে হবে', 'মাসিক বেতন প্রতি মাসের ১০ তারিখের মধ্যে পরিশোধ করতে হবে'];
export const prepareList = ['বিছানাপত্র, বালিশ ও মশারি', 'সাদা পাঞ্জাবি-পায়জামা ও টুপি (৩ সেট)', 'প্লেট, গ্লাস ও বাটি', 'সাবান, টুথব্রাশ, তোয়ালে ও ব্যক্তিগত জিনিস', 'শীতকালে গরম কাপড় ও কম্বল'];

export const faq = [
  ['ভর্তির জন্য কীভাবে আবেদন করব?', 'অনলাইন ভর্তি পৃষ্ঠার আবেদন ফর্ম পূরণ করে জমা দিন। জমা দেওয়ার পর পাওয়া নম্বর দিয়ে আবেদনের অবস্থা জানা যাবে।'],
  ['কোন কোন বিভাগে পড়ানো হয়?', 'নূরানী, নাজেরা, হিফজ, শুনানি, কিতাব ও সাধারণ শিক্ষার পাশাপাশি স্পোকেন ইংলিশ এবং আইসিটি শেখানো হয়।'],
  ['ভর্তির সময় কী কী কাগজ লাগবে?', 'শিক্ষার্থীর জন্মনিবন্ধন, সাম্প্রতিক ছবি এবং অভিভাবকের পরিচয়পত্র প্রস্তুত রাখুন।'],
  ['আবাসিক শিক্ষার্থীদের দিন কীভাবে কাটে?', 'নামাজ ও কুরআন শিক্ষা, সাধারণ ক্লাস, খাবার, বিশ্রাম, খেলাধুলা ও রাতের পড়াশোনা মিলিয়ে একটি নিয়মিত রুটিন অনুসরণ করা হয়।'],
];

export function isDemo(slug: string | null | undefined) {
  return !!slug && slug.startsWith('demo-');
}
export function initials(name: string) {
  const parts = name.replace(/^(মাওলানা|হাফেজ|ক্বারী|মোঃ|মোছাঃ|আলহাজ্ব)\s+/g, '').split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((p) => p[0]).join('');
}
