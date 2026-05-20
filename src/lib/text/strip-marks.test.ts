import { describe, expect, it } from 'vitest';

import {
  HEBREW_MARK_REMOVAL_OPTIONS,
  removeHebrewMarks,
  type HebrewMarkRemoval
} from './strip-marks';

function remove(text: string, removal: HebrewMarkRemoval) {
  return removeHebrewMarks(text, removal);
}

describe('removeHebrewMarks', () => {
  it("removes te'amim while leaving nequdot and punctuation", () => {
    expect(remove('בְּרֵאשִׁ֖ית׃', 'teamim')).toBe('בְּרֵאשִׁית׃');
  });

  it("removes both te'amim and nequdot while leaving punctuation", () => {
    expect(remove('שָׁלוֹם֑׃,.', 'teamim-and-nequdot')).toBe('שלום׃,.');
  });

  it('leaves plain Hebrew text unchanged', () => {
    expect(remove('בראשית', 'teamim-and-nequdot')).toBe('בראשית');
  });

  it('uses the configured removal option labels', () => {
    expect(HEBREW_MARK_REMOVAL_OPTIONS).toEqual([
      { value: 'teamim', label: "Remove all te'amim" },
      { value: 'teamim-and-nequdot', label: "Remove all te'amim and nequdot" }
    ]);
  });
});
