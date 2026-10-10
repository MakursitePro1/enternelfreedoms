
-- Fees
DELETE FROM public.institution_content WHERE kind='fee';
INSERT INTO public.institution_content(kind,title,detail,category,body,sort_order) VALUES
('fee','ভর্তি ফি','৳ ৪০,০০০','ভর্তি','প্রয়োজনে ২ কিস্তিতে; একসাথে পরিশোধে ৫,০০০ টাকা ডিসকাউন্ট। মাসিক বেতন অন্তর্ভুক্ত নয়।',1),
('fee','দ্বিতীয় বছরের সেশন চার্জ','৳ ২০,০০০','ভর্তি','বর্তমান ভর্তি ফির ৫০%',2),
('fee','মাদ্রাসা ও স্কুল বেতন','৳ ৪,০০০','মাসিক','প্রতি মাসে',3),
('fee','৩ বেলা খাবার','৳ ৪,০০০','মাসিক','প্রতি মাসে',4),
('fee','৩ বেলা নাস্তা','৳ ১,৫০০','মাসিক','নিজস্ব লাইভ বেকারিতে প্রস্তুত',5),
('fee','আবাসিক ফি','৳ ২,০০০','মাসিক','প্রতি মাসে',6),
('fee','শিক্ষা উপকরণ ও পরিচ্ছন্নতা সামগ্রী','৳ ১,০০০','মাসিক','প্রতি মাসে',7),
('fee','মাসিক মোট খরচ','৳ ১২,৫০০','মাসিক','গ্রীষ্মকালে এসি বিলসহ ১৩,০০০ টাকা',8),
('fee','সাবালক শিক্ষার্থী (সিঙ্গেল বেড বাধ্যতামূলক)','৳ ১৪,৫০০ / ১৫,০০০','মাসিক','শীতকাল ১৪,৫০০ ও গ্রীষ্মকাল ১৫,০০০ টাকা',9);

-- FAQ corrections
UPDATE public.institution_content SET body='ভর্তির জন্য শিক্ষার্থীর বয়স ৬–১৬ বছর হতে হবে।' WHERE id='0a9875a8-24e3-4d0a-b555-c651698527bf';
UPDATE public.institution_content SET body='শর্তসাপেক্ষে সীমিত সংখ্যক শিক্ষার্থী ভর্তি নেওয়া হচ্ছে। অল্প কয়েকটি আসন, আগে আসলে আগে পাবেন — আগ্রহীগণ দ্রুত যোগাযোগ করুন।' WHERE id='fd99767e-e843-4344-b29a-98a0bb98f6e5';
UPDATE public.institution_content SET body='সন্তান রেখে যাওয়ার ১ মাস পর প্রথম সাক্ষাতের সুযোগ দেওয়া হয়। এরপর প্রতি ১৫ দিন পর পর অভিভাবকদের সাক্ষাতের সুযোগ রয়েছে।' WHERE id='5a3a7cd5-7a6d-44f7-b96b-261fa06cac4f';
UPDATE public.institution_content SET title='অভিভাবক কখন সন্তানের সঙ্গে কথা বলতে পারবেন?', body='সন্তান রেখে যাওয়ার ৭ দিন পর প্রথম মোবাইলে কথা বলা যাবে। তবে শিক্ষার্থীর প্রতিদিনের ভিডিও আপডেট অভিভাবকের হোয়াটসঅ্যাপে পাঠানো হয়।' WHERE id='02c166fa-23da-43fb-a1c3-504f17b55d43';
UPDATE public.institution_content SET body='বছরে ৪টি নির্ধারিত ছুটি রয়েছে।' WHERE id='9f74f067-f489-4caa-b540-7edd283d7ee8';
UPDATE public.institution_content SET body='ভর্তি ফি দিয়ে আবাসিকের প্রয়োজনীয় সামগ্রী প্রতিষ্ঠান থেকে প্রস্তুত করা হয়। অভিভাবক নিজ দায়িত্বে প্রয়োজনীয় সামগ্রী প্রস্তুত করে দিলে ভর্তি ফির প্রয়োজন নেই।' WHERE id='80598b0e-047b-4a12-8cff-1d15bce0683f';

-- Safety corrections
UPDATE public.institution_content SET title='২৪ ঘণ্টা সিসিটিভি মনিটরিং', body='২৪ ঘণ্টা সিসিটিভি মনিটরিং ও শারীরিক শাসনমুক্ত পরিবেশ।' WHERE id='f302d0f4-bbd3-434e-ae89-36b627d909a8';
UPDATE public.institution_content SET body='জরুরি চিকিৎসার জন্য আইসোলেশন ওয়ার্ড, মেডিকেল সহায়তা ও নিজস্ব গাড়ির ব্যবস্থা।' WHERE id='9e9bca95-2321-4e5f-b6f6-47e6b2126dc7';
UPDATE public.institution_content SET body='প্রতিষ্ঠাতা প্রিন্সিপাল কর্তৃক ২৪ ঘণ্টা সকল কিছু মনিটরিং।' WHERE id='338e5a25-f85c-40ec-98d1-8ff0749df374';
UPDATE public.institution_content SET body='জামাতের ওস্তাদ ও জেনারেল শিক্ষকগণ নিয়মিত শিক্ষার্থীদের ভিডিও ও আপডেট হোয়াটসঅ্যাপে প্রদান করেন।' WHERE id='8b2472ce-cfee-4592-b57c-237ce84a4778';
UPDATE public.institution_content SET body='নতুন শিক্ষার্থীর মানিয়ে নেওয়ার স্বার্থে ৭ দিন পর প্রথম ফোনালাপ ও ১ মাস পর প্রথম সাক্ষাৎ।' WHERE id='a415544f-a904-4e66-8294-b564620c61e4';

-- Stats (only client-stated facts)
UPDATE public.institution_content SET title='জেলা থেকে শিক্ষার্থী', detail='৬৪', body='দেশ-বিদেশ থেকে আগত শিক্ষার্থী' WHERE id='982e4f3d-9aa6-4e6b-8605-dc51061aa60b';
UPDATE public.institution_content SET title='তলা নিজস্ব ভবন', detail='৬', body='পরিকল্পিতভাবে নির্মিত, পর্যাপ্ত আলো-বাতাস' WHERE id='f1248196-3be4-49d8-8bf0-8bec9db8e956';
UPDATE public.institution_content SET title='ঘণ্টা সিসিটিভি', detail='২৪', body='শারীরিক শাসনমুক্ত পরিবেশ' WHERE id='bb25be81-ff78-4d44-9093-af52f75c401e';
UPDATE public.institution_content SET title='বছর বয়সে ভর্তি', detail='৬–১৬', body='শর্তসাপেক্ষে সীমিত আসন' WHERE id='963749c6-ec37-4e93-9a75-b1eb73a67ef5';
UPDATE public.institution_content SET title='পর্যন্ত স্কুল বিভাগ', detail='দাখিল', body='প্লে থেকে দাখিল/এসএসসি' WHERE id='7e73a4e7-e931-4c94-a1af-4d85a87a0a6b';

-- Facility corrections
UPDATE public.institution_content SET title='শীতাতপ নিয়ন্ত্রিত আবাসন ও তিন তলা খাট', body='সম্পূর্ণ শীতাতপ নিয়ন্ত্রিত (AC) আবাসিক এলাকায় ফোম বেড ও ড্রয়ারসহ তিন তলা খাট।', detail='AC আবাসিক এলাকা, ফোম বেড, ড্রয়ারসহ খাট' WHERE id='ee82d452-5684-4b13-8115-cece185aeeed';
UPDATE public.institution_content SET title='মাল্টিমিডিয়া ক্লাসরুম', body='পরিকল্পিতভাবে নির্মিত নিজস্ব ৬ তলা ভবনে পর্যাপ্ত আলো-বাতাসপূর্ণ মাল্টিমিডিয়া ক্লাসরুম।', detail='মাল্টিমিডিয়া ক্লাস, সাপ্তাহিক ও মাসিক রিপোর্ট' WHERE id='df067b90-d186-46dc-aa46-6d6609c504f4';
UPDATE public.institution_content SET body='স্বাস্থ্যসম্মত ৩ বেলা মূল খাবার; নিজস্ব জমিতে উৎপাদিত শাকসবজি।', detail='৩ বেলা মূল খাবার, নিজস্ব জমির শাকসবজি' WHERE id='ee78e1e5-fa4a-49bb-9349-7b575b9fc1c0';
UPDATE public.institution_content SET title='নিজস্ব লাইভ বেকারি', body='৩ বেলা নাস্তা নিজস্ব লাইভ বেকারিতে প্রস্তুত।', detail='৩ বেলা নাস্তা, টাটকা প্রস্তুত' WHERE id='4ced5405-4448-465b-8f37-5a1dbcc73d20';
UPDATE public.institution_content SET title='সুবিশাল নিজস্ব খেলার মাঠ', body='প্রতিদিন নিয়মিত খেলাধুলা; খেলার মাঠের ভিডিও অভিভাবক সংযুক্ত হোয়াটসঅ্যাপ চ্যানেলে দেওয়া হয়।', detail='প্রতিদিন খেলাধুলা, দৈনিক ভিডিও আপডেট' WHERE id='62b6756c-772f-411c-8e83-aa7205d63440';
UPDATE public.institution_content SET published=false WHERE id IN ('06391d70-3380-4c69-bdff-60aa0f82e613','169850f4-0155-434f-a13b-6b85e46f90fc');
UPDATE public.institution_content SET title='চিকিৎসা ও আইসোলেশন ওয়ার্ড', body='জরুরি চিকিৎসার জন্য আইসোলেশন ওয়ার্ড, মেডিকেল সহায়তা ও নিজস্ব গাড়ির ব্যবস্থা।', detail='আইসোলেশন ওয়ার্ড, মেডিকেল সহায়তা, নিজস্ব গাড়ি' WHERE id='7e974725-ffa9-4ffe-8f68-87834e0f09f8';
UPDATE public.institution_content SET body='প্রতিটি ফ্লোরে ঠান্ডা, গরম ও স্বাভাবিক পানির ব্যবস্থা।', detail='প্রতিটি ফ্লোরে, ঠান্ডা-গরম-স্বাভাবিক পানি' WHERE id='360f2793-c53e-4e8e-8455-3403c8186171';
UPDATE public.institution_content SET title='লন্ড্রি ও আয়রন', body='সপ্তাহে ২ দিন ওয়াশিং মেশিনে কাপড় ধোয়া ও আয়রন।', detail='সপ্তাহে ২ দিন, ওয়াশিং মেশিন, আয়রন' WHERE id='c49d9e09-0fa5-45f1-9398-959071ba6830';
INSERT INTO public.institution_content(kind,title,body,detail,category,sort_order) VALUES
('facility','হাই ভোল্টেজ জেনারেটর','নিরবিচ্ছিন্ন বিদ্যুতের জন্য নিজস্ব হাই ভোল্টেজ জেনারেটর।','নিরবিচ্ছিন্ন বিদ্যুৎ','dorm',50);
