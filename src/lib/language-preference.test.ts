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
test('Independent visitors keep their own language even when another visitor changes it', () => {
  const firstVisitor = tabStorage();
  const secondVisitor = tabStorage();
  saveLanguagePreference(firstVisitor, 'en');
  assert.equal(readLanguagePreference(secondVisitor), 'bn');
  saveLanguagePreference(secondVisitor, 'en');
  saveLanguagePreference(firstVisitor, 'bn');
  assert.equal(readLanguagePreference(firstVisitor), 'bn');
  assert.equal(readLanguagePreference(secondVisitor), 'en');
});
test('An unsupported saved language defaults to Bengali', () => {
  const storage = tabStorage();
  storage.setItem('ef-lang', 'fr');
  assert.equal(readLanguagePreference(storage), 'bn');
});
test('Unavailable language storage defaults to Bengali', () => {
  const storage = { getItem: () => { throw new Error('Storage disabled'); }, setItem: () => {} };
  assert.equal(readLanguagePreference(storage), 'bn');
});