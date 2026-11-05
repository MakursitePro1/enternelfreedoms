import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mediaUrlSchema, requireAdminQuerySuccess } from './admin-validation';

test('Existing local book covers remain editable and saveable', () => {
  assert.equal(mediaUrlSchema.parse('/books/magic-english.jpg'), '/books/magic-english.jpg');
  assert.equal(mediaUrlSchema.parse('https://example.org/cover.jpg'), 'https://example.org/cover.jpg');
});
test('Media links reject executable and protocol-relative URLs', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,test', '//example.org/image.jpg', '/\\example.org']) {
    assert.equal(mediaUrlSchema.safeParse(url).success, false);
  }
});
test('Failed admin reads cannot masquerade as successful empty data', () => {
  assert.throws(() => requireAdminQuerySuccess([{ error: null }, { error: { message: 'Denied' } }]));
  assert.doesNotThrow(() => requireAdminQuerySuccess([{ error: null }]));
});