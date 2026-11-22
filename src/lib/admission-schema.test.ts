import { test } from 'node:test';
import assert from 'node:assert/strict';
import { admissionSchema } from './admission-schema';

const application = {
  student_name: 'Test Student', birth_date: '2015-01-01', guardian_name: 'Test Father',
  phone: '01700000001', mother_name: 'Test Mother', mother_phone: '01800000001',
  program: 'হিফজ বিভাগ', agreed: true,
  documents: [{ label: 'শিক্ষার্থীর ছবি', name: 'photo.png', type: 'image/png', data: 'data:image/png;base64,iVBORw0KGgo=' }],
};
test('Agreement is mandatory before submitting an admission application', () => {
  assert.equal(admissionSchema.safeParse(application).success, true);
  assert.equal(admissionSchema.safeParse({ ...application, agreed: false }).success, false);
});
test('The eight required student fields cannot be omitted', () => {
  for (const key of ['student_name', 'birth_date', 'guardian_name', 'phone', 'mother_name', 'mother_phone', 'program']) {
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
