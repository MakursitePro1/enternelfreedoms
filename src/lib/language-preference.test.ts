import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readLanguagePreference, saveLanguagePreference } from './language-preference';

function tabStorage() {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
}

test('A new visitor defaults to Bengali', () => {
  assert.equal(readLanguagePreference(tabStorage()), 'bn');
});
test('Changing language affects only the selecting tab and persists there', () => {
  const selectedTab = tabStorage();
  const otherTab = tabStorage();
  saveLanguagePreference(selectedTab, 'en');
  assert.equal(readLanguagePreference(selectedTab), 'en');
  assert.equal(readLanguagePreference(otherTab), 'bn');
  saveLanguagePreference(selectedTab, 'bn');
  assert.equal(readLanguagePreference(selectedTab), 'bn');
});