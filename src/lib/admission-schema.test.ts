import { test } from 'node:test';
import assert from 'node:assert/strict';
import { admissionSchema } from './admission-schema';
import { admissionPrograms } from './admission-programs';
import { admissionParentDetails } from './admission-details';

const application = {
  student_name: 'পরীক্ষা ছাত্র', student_name_en: 'Test Student', residential_experience: 'yes', birth_date: '2015-01-01', guardian_name: 'Test Father',
  phone: '01700000001', mother_name: 'Test Mother', mother_phone: '01800000001',
  program: 'হিফজ বিভাগ', agreed: true,
  documents: [{ label: 'শিক্ষার্থীর ছবি', name: 'photo.png', type: 'image/png', data: 'data:image/png;base64,iVBORw0KGgo=' }],
};
test('Agreement is mandatory before submitting an admission application', () => {
  assert.equal(admissionSchema.safeParse(application).success, true);
  assert.equal(admissionSchema.safeParse({ ...application, agreed: false }).success, false);
});
test('The eight required student fields cannot be omitted', () => {
  for (const key of ['student_name', 'guardian_name', 'phone', 'mother_name', 'mother_phone', 'program']) {
    assert.equal(admissionSchema.safeParse({ ...application, [key]: '' }).success, false, key);
  }
  assert.equal(admissionSchema.safeParse({ ...application, documents: [] }).success, false);
  assert.equal(admissionSchema.safeParse({ ...application, documents: [{ ...application.documents[0], type: 'application/pdf', data: 'data:application/pdf;base64,JVBERi0=' }] }).success, false);
});
test('Birth registration is optional and no address or registration number is requested', () => {
  const parsed = admissionSchema.parse(application);
  assert.equal(parsed.documents.length, 1);
  assert.equal('address' in parsed, false);
});
test('Invalid calendar dates and invalid parent phones are rejected', () => {
  assert.equal(admissionSchema.safeParse({ ...application, birth_date: '2015-02-31' }).success, false);
  assert.equal(admissionSchema.safeParse({ ...application, mother_phone: '123' }).success, false);
});test('Guardian note is optional and limited to 1000 characters', () => {
  assert.equal(admissionSchema.safeParse(application).success, true);
  assert.equal(admissionSchema.safeParse({ ...application, guardian_note: 'বিশেষ নোট' }).success, true);
  assert.equal(admissionSchema.safeParse({ ...application, guardian_note: 'ক'.repeat(1001) }).success, false);
});
test('Only the twenty supplied classes and departments are accepted', () => {
  const expected = ['নার্সারি', 'কেজি', '১ম শ্রেণি', '২য় শ্রেণি', '৩য় শ্রেণি', '৪র্থ শ্রেণি', '৫ম শ্রেণি', '৬ষ্ঠ শ্রেণি', '৭ম শ্রেণি', '৮ম শ্রেণি', '৯ম শ্রেণি', '১০ম শ্রেণি', 'নূরানী বিভাগ', 'নাজারা বিভাগ', 'হিফজ বিভাগ', 'হিফজ শুনানি বিভাগ', 'প্রতিযোগিতা বিভাগ', 'কিতাব বিভাগ (মাদানী নেসাব) — প্রথম বর্ষ', 'কিতাব বিভাগ (মাদানী নেসাব) — দ্বিতীয় বর্ষ', 'কিতাব বিভাগ (মাদানী নেসাব) — তৃতীয় বর্ষ'];
  assert.deepEqual(admissionPrograms.map(([name]) => name), expected);
  for (const program of expected) assert.equal(admissionSchema.safeParse({ ...application, program }).success, true, program);
  assert.equal(admissionSchema.safeParse({ ...application, program: 'একাদশ শ্রেণি' }).success, false);
});
test('Admin parent details retain the submitted mother contact, consent and multiline note', () => {
  const details = admissionParentDetails('মায়ের পূর্ণ নাম: Test Mother\nমায়ের মোবাইল নম্বর: 01800000001\nভর্তির নোটিশ ও সকল শর্তাবলিতে সম্মতি: হ্যাঁ\nঅভিভাবকের মন্তব্য / নোট: প্রথম লাইন\nদ্বিতীয় লাইন');
  assert.equal(details.motherName, 'Test Mother');
  assert.equal(details.motherPhone, '01800000001');
  assert.equal(details.consent, 'হ্যাঁ');
  assert.equal(details.guardianNote, 'প্রথম লাইন\nদ্বিতীয় লাইন');
  assert.equal(admissionParentDetails('পুরোনো মন্তব্য').guardianNote, 'পুরোনো মন্তব্য');
});

test('Bengali and English student names are both required in the right script', () => {
  assert.equal(admissionSchema.safeParse({ ...application, student_name_en: '' }).success, false);
  assert.equal(admissionSchema.safeParse({ ...application, student_name: 'Test Student' }).success, false);
  assert.equal(admissionSchema.safeParse({ ...application, student_name_en: 'পরীক্ষা' }).success, false);
});
test('Previous institution is optional and residential experience must be yes or no', () => {
  assert.equal(admissionSchema.parse(application).previous_school, '');
  assert.equal(admissionSchema.safeParse({ ...application, previous_school: 'গফরগাঁও মাদরাসা' }).success, true);
  assert.equal(admissionSchema.safeParse({ ...application, residential_experience: '' }).success, false);
  assert.equal(admissionSchema.safeParse({ ...application, residential_experience: 'no' }).success, true);
});
