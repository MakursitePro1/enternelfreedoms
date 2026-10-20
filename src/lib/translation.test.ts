import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { translateText } from './translation';
import { LangContext } from './language-context';
import { LocalizedElement } from './localized-jsx/element';

test('English selection translates Bengali while Bengali selection preserves the source', () => {
  assert.equal(translateText('শিক্ষার্থীর তথ্য', 'en'), 'Student Information');
  assert.equal(translateText('শিক্ষার্থীর তথ্য', 'bn'), 'শিক্ষার্থীর তথ্য');
});
test('Changing the displayed language never changes a submitted option value', () => {
  const markup = renderToStaticMarkup(createElement(LangContext.Provider, { value: { lang: 'en', setLang: () => {}, t: (source) => translateText(source, 'en') } }, createElement(LocalizedElement, { tag: 'option', source: { children: 'ভর্তি' } })));
  assert.match(markup, /value="ভর্তি"/);
  assert.ok(markup.includes(`>${translateText('ভর্তি', 'en')}</option>`));
});
test('Customer-entered form values stay unchanged in English', () => {
  const markup = renderToStaticMarkup(createElement(LangContext.Provider, { value: { lang: 'en', setLang: () => {}, t: (source) => translateText(source, 'en') } }, createElement(LocalizedElement, { tag: 'input', source: { defaultValue: 'বাংলা ব্যক্তিগত নাম', placeholder: 'নাম' } })));
  assert.match(markup, /value="বাংলা ব্যক্তিগত নাম"/);
});
test('English numerals preserve the original number', () => {
  assert.equal(translateText('৳ ৪০,০০০', 'en'), '৳ 40,000');
});