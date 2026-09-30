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
      { value: 'brill-simple', label: 'Brill simple' },
      { value: 'brill-academic', label: 'Brill academic' },
      { value: 'nechama', label: 'Modern Israeli (Nechama)' },
      { value: 'sbl-academic', label: 'SBL academic' },
      { value: 'sbl-simple', label: 'SBL simple' }
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

  it('defaults to the brill simple style', () => {
    expect(DEFAULT_TRANSLITERATION_STYLE).toBe('brill-simple');
  });
});
describe('nechama style', () => {
  // Examples straight from shekelator/nechama internal/transliteration/rules.go
  const cases: Array<[description: string, hebrew: string, expected: string]> = [
    ['leading shva → e; shin dot → sh', 'שְׁמַע', 'shema'],
    ['silent shva closes a syllable', 'מִדְבָּר', 'midbar'],
    ['dagesh chazak → single consonant', 'שַׁבָּת', 'shabat'],
    ['definite article → ha without hyphen', 'הַבַּיִת', 'habayit'],
    ['silent final he; sin dot → s', 'שָׂדֶה', 'sade'],
    ['cholam male → o; bet without dagesh → v', 'טוֹב', 'tov'],
    ['bare cholam → o; segol → e', 'אֹמֶר', 'omer'],
    ['bare cholam → o; shin dot → sh', 'קֹדֶשׁ', 'kodesh'],
    ['silent ayin; final tsadi → ts', 'עֵץ', 'ets'],
    ['inseparable preposition → be; cholam → o', 'בְּיוֹם', 'beyom'],
    ['medial aleph → apostrophe', 'וְאָהַבְתָּ', "ve'ahavta"],
    ['word-initial beit without dagesh → v; final khaf → kh', 'בֵיתֶךָ', 'veitekha'],
    ['final khaf without dagesh → kh (not k)', 'יְהַלְלוּךָ', 'yehalelukha'],
    ['lexicalized final he written as h', 'סֶלָה', 'selah'],
    ['medial ayin marks syllable break with apostrophe', 'מֵעַל', "me'al"],
    ['furtive patach before final chet', 'רוּחַ', 'ruach'],
    ['cholam keeps the o', 'חוֹל', 'chol'],
    ['word-initial beit with dagesh → b', 'בָּשָׂר', 'basar'],
    ['word-initial beit without dagesh → v', 'בָא', 'va'],
    ['beit without dagesh after a vowel → v', 'אָבִיב', 'aviv'],
    ['word-initial kaf with dagesh → k', 'כָּבוֹד', 'kavod'],
    ['word-initial kaf without dagesh → kh', 'כִי', 'khi'],
    ['final kaf without dagesh → kh', 'אַךְ', 'akh'],
    ['divine name → ADONAI', 'יְהוָה', 'ADONAI']
  ];

  it.each(cases)('%s: %j → %j', (_d, hebrew, expected) => {
    // Compared case-insensitively: in these tests each word occupies its own
    // line, so the line-start capitalization (rule 10) applies to it.
    expect(transliterateText(hebrew, 'nechama').toLowerCase()).toBe(expected.toLowerCase());
  });

  it('transliterates the double-yod euphemism as ADONAI', () => {
    expect(transliterateText('יי', 'nechama')).toBe('ADONAI');
  });

  it('uses only ASCII characters', () => {
    const hebrew = 'אָבְרָהָם יִצְחָק וְיַעֲקֹב';
    expect(transliterateText(hebrew, 'nechama')).toMatch(/^[\x20-\x7E\n]*$/u);
  });

  it('capitalizes the first letter of each line', () => {
    expect(transliterateText('בֹּ֗רֵא שָׁמַ֙יִם֙\nוְאֵ֥ת הָאָֽרֶץ', 'nechama')).toMatch(/^[A-Z].+\n[A-Z]/u);
  });

  it('preserves maqaf as a hyphen', () => {
    expect(transliterateText('כִּי־טוֹב', 'nechama').toLowerCase()).toBe('ki-tov');
  });
});
