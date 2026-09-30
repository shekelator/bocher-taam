import { describe, expect, it } from 'vitest';

import {
  DEFAULT_TRANSLITERATION_STYLE,
  isTransliterationStyle,
  TRANSLITERATION_STYLE_OPTIONS,
  transliterateText
} from './transliterate';

describe('transliterateText', () => {
  it('transliterates with the default SBL academic style', () => {
    expect(transliterateText('שֶׁ֣לֶם', 'sbl-academic')).toBe('šelem');
    expect(transliterateText('אֱלֹהִים', 'sbl-academic')).toBe('ʾĕlōhîm');
  });

  it('transliterates with the SBL simple style', () => {
    expect(transliterateText('שֶׁ֣לֶם', 'sbl-simple')).toBe('shelem');
    expect(transliterateText('אָ֣ב', 'sbl-simple')).toBe('av');
  });

  it('preserves non-Hebrew characters and line breaks', () => {
    expect(transliterateText('v1.\n רַ֛עַל', 'sbl-academic')).toBe('v1.\n raʿal');
  });

  it('returns an empty string for empty text', () => {
    expect(transliterateText('', 'sbl-academic')).toBe('');
  });

  it('can distinguish the styles', () => {
    const hebrew = 'שָׁלוֹם';
    expect(transliterateText(hebrew, 'sbl-academic')).not.toBe(
      transliterateText(hebrew, 'sbl-simple')
    );
  });
});

describe('TRANSLITERATION_STYLE_OPTIONS', () => {
  it('lists a style for each value', () => {
    expect(TRANSLITERATION_STYLE_OPTIONS).toEqual([
      { value: 'sbl-academic', label: 'SBL academic' },
      { value: 'sbl-simple', label: 'SBL simple' },
      { value: 'brill-academic', label: 'Brill academic' },
      { value: 'brill-simple', label: 'Brill simple' }
    ]);
  });
});

describe('isTransliterationStyle', () => {
  it('accepts known style values', () => {
    for (const { value } of TRANSLITERATION_STYLE_OPTIONS) {
      expect(isTransliterationStyle(value)).toBe(true);
    }
  });

  it('rejects unknown values', () => {
    expect(isTransliterationStyle(undefined)).toBe(false);
    expect(isTransliterationStyle('nonsense')).toBe(false);
  });

  it('defaults to SBL academic', () => {
    expect(DEFAULT_TRANSLITERATION_STYLE).toBe('sbl-academic');
  });
});