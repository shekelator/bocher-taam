import { describe, it, expect } from 'vitest';
import { insertDiacritic, normalizeText } from './cluster';
import { nekudot } from '../data/nekudot';
import { teamim } from '../data/teamim';
import { type DiacriticDef } from '../types';

// Helper: find a diacritic by name
function byName(arr: DiacriticDef[], name: string): DiacriticDef {
  const found = arr.find((d) => d.name === name);
  if (!found) throw new Error(`No diacritic named "${name}"`);
  return found;
}

const patach    = byName(nekudot, 'Patach');
const qamats    = byName(nekudot, 'Qamats');
const dagesh    = byName(nekudot, 'Dagesh');
const rafe      = byName(nekudot, 'Rafe');
const shinDot   = byName(nekudot, 'Shin Dot');
const sinDot    = byName(nekudot, 'Sin Dot');
const etnachta  = byName(teamim, 'Etnachta');
const tipcha    = byName(teamim, 'Tipcha');

const ALEF = '\u05D0';
const BET  = '\u05D1';
const SHIN = '\u05E9';

describe('insertDiacritic', () => {
  describe('basic insertion', () => {
    it('inserts a vowel on a bare consonant', () => {
      const { text } = insertDiacritic(ALEF, 1, patach);
      expect(text).toBe(ALEF + patach.codepoint);
    });

    it('inserts dagesh on a bare consonant', () => {
      const { text } = insertDiacritic(BET, 1, dagesh);
      expect(text).toBe(BET + dagesh.codepoint);
    });

    it('inserts shin dot on shin', () => {
      const { text } = insertDiacritic(SHIN, 1, shinDot);
      expect(text).toBe(SHIN + shinDot.codepoint);
    });

    it("inserts a te'am on a consonant", () => {
      const { text } = insertDiacritic(ALEF, 1, etnachta);
      expect(text).toBe(ALEF + etnachta.codepoint);
    });
  });

  describe('SBL ordering', () => {
    it('places shin dot before dagesh before vowel', () => {
      let text = SHIN;
      ({ text } = insertDiacritic(text, 1, patach));     // vowel first
      ({ text } = insertDiacritic(text, text.length, dagesh));   // then dagesh
      ({ text } = insertDiacritic(text, text.length, shinDot));  // then shin dot

      // Expected order: SHIN + shin_dot + dagesh + patach
      expect(text).toBe(SHIN + shinDot.codepoint + dagesh.codepoint + patach.codepoint);
    });

    it("places vowel before te'am", () => {
      let text = ALEF;
      ({ text } = insertDiacritic(text, 1, etnachta));   // taam first
      ({ text } = insertDiacritic(text, text.length, patach)); // vowel second

      // Expected: ALEF + patach + etnachta
      expect(text).toBe(ALEF + patach.codepoint + etnachta.codepoint);
    });
  });

  describe('toggle behavior', () => {
    it('removes a mark when inserted a second time', () => {
      let text = ALEF;
      ({ text } = insertDiacritic(text, 1, patach));
      expect(text).toBe(ALEF + patach.codepoint);
      ({ text } = insertDiacritic(text, text.length, patach));
      expect(text).toBe(ALEF);
    });

    it('removes dagesh when re-inserted', () => {
      let text = BET;
      ({ text } = insertDiacritic(text, 1, dagesh));
      ({ text } = insertDiacritic(text, text.length, dagesh));
      expect(text).toBe(BET);
    });
  });

  describe('conflict replacement', () => {
    it('replaces a vowel with a new vowel', () => {
      let text = ALEF;
      ({ text } = insertDiacritic(text, 1, patach));
      expect(text).toBe(ALEF + patach.codepoint);
      ({ text } = insertDiacritic(text, text.length, qamats));
      expect(text).toBe(ALEF + qamats.codepoint);
    });

    it('replaces dagesh with rafe', () => {
      let text = BET;
      ({ text } = insertDiacritic(text, 1, dagesh));
      ({ text } = insertDiacritic(text, text.length, rafe));
      expect(text).toBe(BET + rafe.codepoint);
    });

    it('replaces rafe with dagesh', () => {
      let text = BET;
      ({ text } = insertDiacritic(text, 1, rafe));
      ({ text } = insertDiacritic(text, text.length, dagesh));
      expect(text).toBe(BET + dagesh.codepoint);
    });

    it('replaces shin dot with sin dot', () => {
      let text = SHIN;
      ({ text } = insertDiacritic(text, 1, shinDot));
      ({ text } = insertDiacritic(text, text.length, sinDot));
      expect(text).toBe(SHIN + sinDot.codepoint);
    });
  });

  describe("multiple te'amim", () => {
    it("allows two te'amim on the same letter", () => {
      let text = ALEF;
      ({ text } = insertDiacritic(text, 1, etnachta));
      ({ text } = insertDiacritic(text, text.length, tipcha));
      // Both should be present, sorted by codepoint
      expect(text).toContain(etnachta.codepoint);
      expect(text).toContain(tipcha.codepoint);
    });

    it("sorts multiple te'amim by codepoint", () => {
      let text = ALEF;
      ({ text } = insertDiacritic(text, 1, tipcha));      // U+0596
      ({ text } = insertDiacritic(text, text.length, etnachta)); // U+0591
      // etnachta (0591) < tipcha (0596), so etnachta first
      expect(text).toBe(ALEF + etnachta.codepoint + tipcha.codepoint);
    });
  });

  describe('edge cases', () => {
    it('returns unchanged text for empty string', () => {
      const { text, cursor } = insertDiacritic('', 0, patach);
      expect(text).toBe('');
      expect(cursor).toBe(0);
    });

    it('returns unchanged when cursor at offset 0', () => {
      const { text, cursor } = insertDiacritic(ALEF, 0, patach);
      expect(text).toBe(ALEF);
      expect(cursor).toBe(0);
    });

    it('handles cursor at end of text', () => {
      const { text } = insertDiacritic(ALEF, 1, patach);
      expect(text).toBe(ALEF + patach.codepoint);
    });

    it('handles text with multiple letters, only modifies cluster before cursor', () => {
      const text = ALEF + BET;  // Two consonants
      const { text: result } = insertDiacritic(text, 1, patach);
      // Only alef gets the patach
      expect(result).toBe(ALEF + patach.codepoint + BET);
    });

    it('handles already-marked cluster with additional marks', () => {
      let text = ALEF;
      ({ text } = insertDiacritic(text, 1, patach));
      ({ text } = insertDiacritic(text, text.length, dagesh));
      // Both dagesh and patach present, dagesh (DageshRafe=2) before patach (Vowel=3)
      expect(text).toBe(ALEF + dagesh.codepoint + patach.codepoint);
    });
  });
});

describe('normalizeText', () => {
  it('normalizes a cluster with out-of-order marks', () => {
    // Build text with wrong order: ALEF + patach + dagesh
    const wrongOrder = ALEF + patach.codepoint + dagesh.codepoint;
    const normalized = normalizeText(wrongOrder);
    // Correct order: ALEF + dagesh + patach
    expect(normalized).toBe(ALEF + dagesh.codepoint + patach.codepoint);
  });

  it('handles text with no Hebrew combining marks unchanged', () => {
    const plain = ALEF + BET;
    expect(normalizeText(plain)).toBe(plain);
  });

  it('handles empty string', () => {
    expect(normalizeText('')).toBe('');
  });

  it('normalizes multiple clusters in sequence', () => {
    const wrongOrder = 
      ALEF + patach.codepoint + dagesh.codepoint +
      BET  + patach.codepoint + shinDot.codepoint;
    const normalized = normalizeText(wrongOrder);
    expect(normalized).toBe(
      ALEF + dagesh.codepoint + patach.codepoint +
      BET  + shinDot.codepoint + patach.codepoint
    );
  });
});
