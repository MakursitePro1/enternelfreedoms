export const generalAdmissionPrograms = [
  ['নার্সারি', 'Nursery'], ['কেজি', 'KG'], ['১ম শ্রেণি', 'Class 1'], ['২য় শ্রেণি', 'Class 2'],
  ['৩য় শ্রেণি', 'Class 3'], ['৪র্থ শ্রেণি', 'Class 4'], ['৫ম শ্রেণি', 'Class 5'], ['৬ষ্ঠ শ্রেণি', 'Class 6'],
  ['৭ম শ্রেণি', 'Class 7'], ['৮ম শ্রেণি', 'Class 8'], ['৯ম শ্রেণি', 'Class 9'], ['১০ম শ্রেণি', 'Class 10'],
] as const;
export const madrasaAdmissionPrograms = [
  ['নূরানী বিভাগ', 'Nurani Department'], ['নাজারা বিভাগ', 'Nazara Department'],
  ['হিফজ বিভাগ', 'Hifz Department'], ['হিফজ শুনানি বিভাগ', 'Hifz Revision Department'],
  ['প্রতিযোগিতা বিভাগ', 'Competition Department'],
] as const;
export const kitabAdmissionPrograms = [
  ['কিতাব বিভাগ (মাদানী নেসাব) — প্রথম বর্ষ', 'Kitab Department (Madani Nesab) — First Year', 'প্রথম বর্ষ', 'First Year'],
  ['কিতাব বিভাগ (মাদানী নেসাব) — দ্বিতীয় বর্ষ', 'Kitab Department (Madani Nesab) — Second Year', 'দ্বিতীয় বর্ষ', 'Second Year'],
  ['কিতাব বিভাগ (মাদানী নেসাব) — তৃতীয় বর্ষ', 'Kitab Department (Madani Nesab) — Third Year', 'তৃতীয় বর্ষ', 'Third Year'],
] as const;
export const admissionPrograms = [...generalAdmissionPrograms, ...madrasaAdmissionPrograms, ...kitabAdmissionPrograms];
export const isAdmissionProgram = (value: string) => admissionPrograms.some(([name]) => name === value);