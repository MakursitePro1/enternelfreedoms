export type CostCopy = {
  title: string; org: string; intro: string;
  services: { title: string; body: string }[];
  founderNote: string;
  tableHead: [string, string]; rows: [string, string][]; total: [string, string];
  doubleBed: string; singleBedNote: string; singleBed: string; special: string;
  questionTitle: string; question: string; closing: string[];
  tagline: string; whatsappLabel: string; whatsapp: string;
};

export const admissionCostsBn: CostCopy = {
  title: 'আমাদের সার্ভিস ও মাসিক খরচের বিস্তারিত হিসাব',
  org: 'Eternal Freedom Institute Al Islamia',
  intro: 'আমরা শিক্ষার্থীদের জন্য মানসম্মত দ্বীনি ও জেনারেল শিক্ষার পাশাপাশি আধুনিক আবাসিক সুযোগ-সুবিধা নিশ্চিত করছি। আমাদের সার্ভিসগুলো হলো—',
  services: [
    { title: 'দ্বীনি শিক্ষা', body: 'সারা দেশ থেকে বাছাই করা মানসম্মত ওস্তাদ দ্বারা পরিচালিত নূরানী, নাজেরা, হিফজ, শুনানি ও মাদানী নেসাব বিভাগ। মাসিক বেতন ২,৫০০ টাকা।' },
    { title: 'জেনারেল শিক্ষা', body: 'নার্সারি থেকে এসএসসি পর্যন্ত সম্পূর্ণ স্কুলিং। দ্বীনি শিক্ষার পাশাপাশি জেনারেল শিক্ষা সমন্বিতভাবে পরিচালিত হয়। বিজ্ঞান ও মানবিক উভয় বিভাগ থেকে দাখিল পরীক্ষায় অংশগ্রহণের সুযোগ রয়েছে। সকল শ্রেণির মাসিক বেতন ১,৫০০ টাকা।' },
    { title: 'খাবার', body: 'শিক্ষার্থীদের সুস্থতা ও শারীরিক বিকাশের কথা বিবেচনা করে মানসম্মত তিন বেলার খাবার। মাসিক খরচ ৪,০০০ টাকা।' },
    { title: 'নাশতা', body: 'নিজস্ব ব্যবস্থাপনায় প্রতিদিন গরম গরম প্রস্তুতকৃত নাশতা। মাসিক খরচ মাত্র ১,০০০ টাকা।' },
    { title: 'শিক্ষা উপকরণ', body: 'খাতা, কলম, রাবার, কাটার, পেন্সিল, চক, স্লেটসহ প্রয়োজনীয় সকল শিক্ষা উপকরণ। মাসিক খরচ ১,০০০ টাকা।' },
    { title: 'ব্যক্তিগত সামগ্রী', body: 'সাবান, শ্যাম্পু, ডিটারজেন্ট, ব্রাশ, পেস্ট, টিস্যু, বেডশিট, ইউনিফর্ম এবং কাপড় ধোয়া ও ইস্ত্রি (Wash & Iron) করার ব্যবস্থা। মাসিক খরচ ১,০০০ টাকা।' },
    { title: 'আবাসিক সুবিধা', body: 'প্রত্যেক শিক্ষার্থীর জন্য আলাদা খাট, এয়ারকন্ডিশনড আবাসিক ব্যবস্থা, ঠান্ডা ও গরম পানির সুবিধা। প্রতিটি ফ্লোরে ইনস্ট্যান্ট পানির মোটরের লাইন রয়েছে, যার মাধ্যমে সব সময় গরম ও কুসুম গরম পানির ব্যবস্থা নিশ্চিত করা হয়।' },
    { title: 'খেলাধুলা', body: 'রয়েছে বিস্তীর্ণ নিজস্ব খেলার মাঠ, যেখানে প্রতিদিন শিক্ষার্থীরা খেলাধুলা করে। আমরা চাই, প্রতিটি শিশুর শৈশব হোক স্মরণীয় ও আনন্দময়।' },
    { title: 'নিজস্ব কৃষি', body: 'শিক্ষার্থীদের খাবারের জন্য নিজস্ব জমিতে উৎপাদিত শাকসবজির ব্যবস্থা।' },
    { title: 'চিকিৎসাসেবা', body: 'প্রাথমিক চিকিৎসার জন্য মেডিকেল অ্যাসিস্ট্যান্ট এবং জরুরি প্রয়োজনে অসুস্থ শিক্ষার্থীকে হাসপাতালে নেওয়ার জন্য প্রতিষ্ঠানের নিজস্ব গাড়ির ব্যবস্থা।' },
    { title: 'স্পোকেন ইংলিশ', body: 'দক্ষ ও অভিজ্ঞ শিক্ষকের মাধ্যমে নিয়মিত স্পোকেন ইংলিশ ক্লাস পরিচালনা।' },
    { title: 'নিরাপত্তা', body: 'ভবন ও খেলার মাঠসহ গুরুত্বপূর্ণ স্থানগুলো ১০০টি সিসি ক্যামেরার মাধ্যমে নিয়ন্ত্রিত।' },
    { title: 'নিজস্ব ভবন', body: 'একদম খোলামেলা জায়গায় নিজস্ব ছয়তলা ভবন। চারদিক থেকেই পর্যাপ্ত আলো-বাতাস চলাচলের সুব্যবস্থা।' },
    { title: 'বিদ্যুৎ ব্যবস্থা', body: 'নিরবচ্ছিন্ন বিদ্যুৎ সরবরাহের জন্য রয়েছে উচ্চক্ষমতাসম্পন্ন জেনারেটর।' },
    { title: 'আবাসিক চার্জ', body: 'উপরোক্ত সকল আবাসিক সুযোগ-সুবিধার জন্য মাসিক আবাসিক চার্জ মাত্র ২,০০০ টাকা।' },
  ],
  founderNote: 'বিশেষ করে একজন প্রতিষ্ঠাতা প্রিন্সিপাল যিনি খাদেমের মত শিক্ষার্থীদের পেছনে আঠার মত চব্বিশ ঘন্টা লেগে থাকেন!',
  tableHead: ['খরচের বিবরণ', 'টাকা'],
  rows: [['দ্বীনি শিক্ষা', '২,৫০০'], ['জেনারেল শিক্ষা', '১,৫০০'], ['তিন বেলার খাবার', '৪,০০০'], ['নাশতা', '১,০০০'], ['শিক্ষা উপকরণ', '১,০০০'], ['ব্যক্তিগত সামগ্রী ও ইউনিফর্ম, ওয়াশ-আয়রন', '১,০০০'], ['আবাসিক চার্জ', '২,০০০']],
  total: ['সর্বমোট', '১৩,০০০'],
  doubleBed: 'ডাবল বেডে মাসিক সর্বমোট খরচ: ১৩,০০০ টাকা।',
  singleBedNote: 'সিঙ্গেল বেডের ব্যবস্থা: ছোট শিশুদের একটি বেডে দুজন থাকার ব্যবস্থা রয়েছে। তবে সাবালক ও সাবালিকা শিক্ষার্থীদের জন্য সিঙ্গেল বেড বাধ্যতামূলক। কেউ সিঙ্গেল বেড নিতে চাইলে অতিরিক্ত ২,০০০ টাকা প্রদান করতে হবে।',
  singleBed: 'সিঙ্গেল বেডসহ মাসিক সর্বমোট খরচ: ১৫,০০০ টাকা।',
  special: 'বিশেষ দ্রষ্টব্য: প্রতিষ্ঠানে বাইরের কোনো খাবার অনুমোদিত নয়। খাবারসহ প্রয়োজনীয় সকল সামগ্রী প্রতিষ্ঠানের নিজস্ব ব্যবস্থাপনায় সরবরাহ করা হয়। তাই উল্লেখিত খরচের বাইরে নিয়মিত কোনো অতিরিক্ত খরচ নেই।',
  questionTitle: 'এবার আপনাদের কাছে আমাদের প্রশ্ন:',
  question: 'এতগুলো সুযোগ-সুবিধা, মানসম্মত দ্বীনি ও জেনারেল শিক্ষা, তিন বেলার খাবার, গরম গরম নাশতা, শিক্ষা উপকরণ, ব্যক্তিগত সামগ্রী, এয়ারকন্ডিশনড আবাসন, চিকিৎসাসেবা, খেলাধুলা, স্পোকেন ইংলিশ ও সার্বক্ষণিক নিরাপত্তা—সবকিছু মিলিয়ে মাসিক মাত্র ১৩,০০০ টাকায় এর চেয়ে কম খরচে এমন মানসম্মত আবাসিক সেবা দেওয়া কি বাস্তবে সম্ভব?',
  closing: [
    'আমরা শুধু একটি শিক্ষাপ্রতিষ্ঠান পরিচালনা করতে চাই না; আমরা চাই প্রতিটি শিশুর জন্য একটি সুন্দর, নিরাপদ, আনন্দময় ও সম্ভাবনাময় ভবিষ্যৎ গড়ে তুলতে।',
    'আমাদের লক্ষ্য শুধু শিক্ষা দেওয়া নয়, বরং আদর্শ মানুষ হিসেবে গড়ে তোলা এবং প্রতিটি শিশুর শৈশবকে স্মরণীয় করে রাখা।',
    'আল্লাহ আমাদের এই প্রচেষ্টাকে কবুল করুন। আমিন।',
  ],
  tagline: 'দ্বীনি ও জেনারেল শিক্ষার সমন্বয়ে একটি পূর্ণাঙ্গ আবাসিক শিক্ষাপ্রতিষ্ঠান।',
  whatsappLabel: 'জরুরী প্রয়োজনে নিচের whatsapp নাম্বারে ভয়েস অথবা টেক্সট করতে পারেন।',
  whatsapp: '01711022734',
};

export const admissionCostsEn: CostCopy = {
  title: 'Our Services and Detailed Monthly Cost Breakdown',
  org: 'Eternal Freedom Institute Al Islamia',
  intro: 'Alongside quality Islamic and general education, we ensure modern residential facilities for our students. Our services are—',
  services: [
    { title: 'Islamic Education', body: 'Nurani, Nazera, Hifz, Shunani and Madani Nesab departments run by quality teachers selected from across the country. Monthly fee Tk 2,500.' },
    { title: 'General Education', body: 'Complete schooling from Nursery to SSC, run in an integrated way alongside Islamic education. Students can sit the Dakhil exam in both Science and Humanities. Monthly fee for all classes Tk 1,500.' },
    { title: 'Meals', body: 'Quality three meals a day, planned for students’ health and physical growth. Monthly cost Tk 4,000.' },
    { title: 'Snacks', body: 'Freshly prepared hot snacks every day under our own management. Monthly cost only Tk 1,000.' },
    { title: 'Study Materials', body: 'Notebooks, pens, erasers, sharpeners, pencils, chalk, slates and all other necessary study materials. Monthly cost Tk 1,000.' },
    { title: 'Personal Items', body: 'Soap, shampoo, detergent, brush, paste, tissue, bedsheet, uniform, and washing & ironing (Wash & Iron). Monthly cost Tk 1,000.' },
    { title: 'Residential Facilities', body: 'A separate bed for every student, air-conditioned accommodation, and cold and hot water. Every floor has an instant water motor line, ensuring hot and lukewarm water at all times.' },
    { title: 'Sports', body: 'A vast playground of our own where students play every day. We want every child’s childhood to be memorable and joyful.' },
    { title: 'Own Farming', body: 'Vegetables grown on our own land for students’ meals.' },
    { title: 'Medical Care', body: 'A medical assistant for first aid, and the institution’s own vehicle to take sick students to hospital in emergencies.' },
    { title: 'Spoken English', body: 'Regular spoken English classes by skilled and experienced teachers.' },
    { title: 'Security', body: 'Important areas including the building and playground are monitored by 100 CCTV cameras.' },
    { title: 'Own Building', body: 'Our own six-storey building in a completely open setting, with plenty of light and air from all sides.' },
    { title: 'Electricity', body: 'A high-capacity generator for uninterrupted power supply.' },
    { title: 'Residential Charge', body: 'Monthly residential charge for all the above residential facilities is only Tk 2,000.' },
  ],
  founderNote: 'Above all, a founder principal who stays with the students twenty-four hours a day like a devoted servant!',
  tableHead: ['Cost item', 'Taka'],
  rows: [['Islamic Education', '2,500'], ['General Education', '1,500'], ['Three meals', '4,000'], ['Snacks', '1,000'], ['Study materials', '1,000'], ['Personal items & uniform, wash-iron', '1,000'], ['Residential charge', '2,000']],
  total: ['Total', '13,000'],
  doubleBed: 'Total monthly cost with a double bed: Tk 13,000.',
  singleBedNote: 'Single bed: Young children share one bed between two. However, single beds are mandatory for adolescent students. Anyone wanting a single bed must pay an extra Tk 2,000.',
  singleBed: 'Total monthly cost with a single bed: Tk 15,000.',
  special: 'Special note: No outside food is allowed in the institution. Food and all necessary items are supplied under the institution’s own management, so there are no regular extra costs beyond those listed.',
  questionTitle: 'Now our question to you:',
  question: 'With so many facilities — quality Islamic and general education, three meals, hot snacks, study materials, personal items, air-conditioned accommodation, medical care, sports, spoken English and round-the-clock security — all for only Tk 13,000 a month, is it really possible to provide such quality residential service for less?',
  closing: [
    'We do not just want to run an educational institution; we want to build a beautiful, safe, joyful and promising future for every child.',
    'Our goal is not only to educate, but to raise ideal human beings and make every child’s childhood memorable.',
    'May Allah accept our efforts. Ameen.',
  ],
  tagline: 'A complete residential institution combining Islamic and general education.',
  whatsappLabel: 'For urgent needs, you can send a voice or text message to the WhatsApp number below.',
  whatsapp: '01711022734',
};
