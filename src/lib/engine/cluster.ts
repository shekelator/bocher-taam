import { SblCategory, type DiacriticDef } from '../types';

/**
 * Unicode ranges for Hebrew combining marks:
 * U+0591–U+05C7 (Hebrew point/accent range)
 */
const HEBREW_BASE_START = 0x05D0;
const HEBREW_BASE_END   = 0x05EA;
const HEBREW_MARK_RANGES: [number, number][] = [
  [0x0591, 0x05C7],
];

function isHebrewCombiningMark(cp: number): boolean {
  return HEBREW_MARK_RANGES.some(([lo, hi]) => cp >= lo && cp <= hi);
}

function isHebrewBase(cp: number): boolean {
  return cp >= HEBREW_BASE_START && cp <= HEBREW_BASE_END;
}

/**
 * Assign an SBL sort key to a combining mark codepoint.
 * Returns a tuple [category, codepoint] for stable sorting.
 */
function sblSortKey(cp: number): [number, number] {
  // Shin dot (U+05C1) and Sin dot (U+05C2)
  if (cp === 0x05C1 || cp === 0x05C2) return [SblCategory.ShinSinDot, cp];
  // Dagesh (U+05BC) and Rafe (U+05BF)
  if (cp === 0x05BC || cp === 0x05BF) return [SblCategory.DageshRafe, cp];
  // Meteg (U+05BD)
  if (cp === 0x05BD) return [SblCategory.Meteg, cp];
  // Vowels: U+05B0–U+05BB, U+05C7
  if ((cp >= 0x05B0 && cp <= 0x05BB) || cp === 0x05C7) return [SblCategory.Vowel, cp];
  // Te'amim: U+0591–U+05AF, U+05C0, U+05C3
  if ((cp >= 0x0591 && cp <= 0x05AF) || cp === 0x05C0 || cp === 0x05C3) return [SblCategory.Taam, cp];
  // Fallback
  return [99, cp];
}

function getSblCategory(cp: number): SblCategory | null {
  const [cat] = sblSortKey(cp);
  if (cat === 99) return null;
  return cat as SblCategory;
}

/**
 * Conflict rules — marks that cannot coexist with the new mark.
 * Returns true if `existing` should be removed when inserting `newMark`.
 */
function conflicts(existing: number, newMark: number): boolean {
  const newCat = getSblCategory(newMark);
  const exCat  = getSblCategory(existing);
  if (newCat === null || exCat === null) return false;
  // Only one vowel
  if (newCat === SblCategory.Vowel && exCat === SblCategory.Vowel) return true;
  // Dagesh and Rafe are mutually exclusive
  if (newCat === SblCategory.DageshRafe && exCat === SblCategory.DageshRafe) return true;
  // Shin dot and Sin dot are mutually exclusive
  if (newCat === SblCategory.ShinSinDot && exCat === SblCategory.ShinSinDot) return true;
  return false;
}

/** Split a string into an array of Unicode codepoints (as numbers). */
function toCodePoints(str: string): number[] {
  return [...str].map((ch) => ch.codePointAt(0)!);
}

/** Join an array of codepoints back to a string. */
function fromCodePoints(cps: number[]): string {
  return cps.map((cp) => String.fromCodePoint(cp)).join('');
}

/**
 * Find the start offset (in code-unit/char index) of the grapheme cluster
 * immediately before `cursorOffset` in `text`.
 */
function findClusterBefore(text: string, cursorOffset: number): {
  baseIndex: number;
  marks: number[];
} {
  const cps = toCodePoints(text);

  // cursorOffset is in UTF-16 code units; convert to codepoint index
  let cpIdx = 0;
  let cuIdx = 0;
  while (cuIdx < cursorOffset && cpIdx < cps.length) {
    const cp = cps[cpIdx];
    cuIdx += cp > 0xFFFF ? 2 : 1;
    cpIdx++;
  }

  // Walk backward collecting combining marks
  let i = cpIdx - 1;
  const marks: number[] = [];

  while (i >= 0 && isHebrewCombiningMark(cps[i])) {
    marks.unshift(cps[i]);
    i--;
  }

  // Now i should point to the base character
  if (i >= 0 && isHebrewBase(cps[i])) {
    return { baseIndex: i, marks };
  }

  return { baseIndex: -1, marks: [] };
}

/**
 * Insert (or toggle/replace) a diacritic mark at the grapheme cluster
 * immediately before cursorOffset in text.
 *
 * Returns { text: newText, cursor: newCursorOffset }
 */
export function insertDiacritic(
  text: string,
  cursorOffset: number,
  mark: DiacriticDef
): { text: string; cursor: number } {
  if (text.length === 0 || cursorOffset === 0) {
    return { text, cursor: cursorOffset };
  }

  const cps = toCodePoints(text);
  const newMarkCp = mark.codepoint.codePointAt(0)!;
  const { baseIndex, marks } = findClusterBefore(text, cursorOffset);

  if (baseIndex === -1) {
    return { text, cursor: cursorOffset };
  }

  // Toggle: if already present, remove it
  if (marks.includes(newMarkCp)) {
    const filtered = marks.filter((m) => m !== newMarkCp);
    const clusterEnd = baseIndex + 1 + marks.length;
    const newCps = [
      ...cps.slice(0, baseIndex + 1),
      ...filtered,
      ...cps.slice(clusterEnd),
    ];
    const newText = fromCodePoints(newCps);
    const newCursor = computeCursorOffset(newCps, baseIndex + 1 + filtered.length);
    return { text: newText, cursor: newCursor };
  }

  // Remove conflicting marks
  const filtered = marks.filter((m) => !conflicts(m, newMarkCp));

  // Add new mark
  filtered.push(newMarkCp);

  // Sort by SBL order
  filtered.sort((a, b) => {
    const [catA, cpA] = sblSortKey(a);
    const [catB, cpB] = sblSortKey(b);
    if (catA !== catB) return catA - catB;
    return cpA - cpB;
  });

  const clusterEnd = baseIndex + 1 + marks.length;
  const newCps = [
    ...cps.slice(0, baseIndex + 1),
    ...filtered,
    ...cps.slice(clusterEnd),
  ];
  const newText = fromCodePoints(newCps);
  const newCursor = computeCursorOffset(newCps, baseIndex + 1 + filtered.length);
  return { text: newText, cursor: newCursor };
}

/** Convert a codepoint index to a UTF-16 code-unit offset */
function computeCursorOffset(cps: number[], cpIndex: number): number {
  let offset = 0;
  for (let i = 0; i < cpIndex && i < cps.length; i++) {
    offset += cps[i] > 0xFFFF ? 2 : 1;
  }
  return offset;
}

/**
 * Normalize all clusters in a text string to SBL ordering.
 * Returns the normalized string.
 */
export function normalizeText(text: string): string {
  const cps = toCodePoints(text);
  const result: number[] = [];
  let i = 0;

  while (i < cps.length) {
    const cp = cps[i];

    if (isHebrewBase(cp)) {
      const base = cp;
      i++;
      const marks: number[] = [];
      while (i < cps.length && isHebrewCombiningMark(cps[i])) {
        marks.push(cps[i]);
        i++;
      }
      // Sort marks by SBL order
      marks.sort((a, b) => {
        const [catA, cpA] = sblSortKey(a);
        const [catB, cpB] = sblSortKey(b);
        if (catA !== catB) return catA - catB;
        return cpA - cpB;
      });
      result.push(base, ...marks);
    } else {
      result.push(cp);
      i++;
    }
  }

  return fromCodePoints(result);
}
