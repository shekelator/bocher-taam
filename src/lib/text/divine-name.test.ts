import { describe, expect, it } from 'vitest';

import {
  DIVINE_NAME_REPLACEMENTS,
  replaceDivineNameOccurrences,
  type DivineNameReplacement
} from './divine-name';

function replace(text: string, replacement: DivineNameReplacement) {
  return replaceDivineNameOccurrences(text, replacement);
}

describe('replaceDivineNameOccurrences', () => {
  it('replaces plain יהוה with double yud', () => {
    expect(replace('יהוה', 'double-yud')).toBe('יי');
  });

  it('replaces pointed יהוה with heh plus geresh', () => {
    const pointed = 'יְהֹוָה';
    expect(replace(pointed, 'heh-geresh')).toBe('ה׳');
  });

  it('replaces every occurrence in the text', () => {
    const text = 'ביהוה נבטח ויהוה מלך יהוה.';
    expect(replace(text, 'double-yud')).toBe('ביי נבטח ויי מלך יי.');
  });

  it('leaves unrelated text unchanged', () => {
    expect(replace('יהודה וישראל', 'double-yud')).toBe('יהודה וישראל');
  });

  it('uses the configured replacement strings', () => {
    expect(DIVINE_NAME_REPLACEMENTS['double-yud']).toBe('יי');
    expect(DIVINE_NAME_REPLACEMENTS['heh-geresh']).toBe('ה׳');
  });
});
