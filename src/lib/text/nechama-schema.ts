import type { Schema, SyllableFeature, WordFeature } from 'hebrew-transliteration';

/**
 * Syllable starting with א or ע that is neither the first nor the last
 * syllable of its word: the guttural is silent, but an apostrophe is kept so
 * the syllable break remains visible (e.g. מֵעַל → me'al).
 *
 * Pass-through: returns modified Hebrew — the apostrophe is a non-Hebrew
 * character, which the mapper leaves untouched.
 */
const MEDIAL_GUTTURAL: SyllableFeature = {
  FEATURE: 'syllable',
  HEBREW: /^[אע]/u,
  TRANSLITERATION: (syl) => {
    // Medial = not the first letter, and more Hebrew letters remain after it:
    // either later syllables, or a following consonant in this syllable
    // (e.g. מֵעַל → me'al). A word-final guttural is silent (e.g. יִשְׁמַע).
    const medial = syl.prev && (syl.next || syl.clusters.length > 1);
    return medial ? syl.text.replace(/^[אע]/u, `'`) : syl.text;
  }
};

/** The double-yod divine name euphemism (יי) → ADONAI. */
const DOUBLE_YOD_EUPHEMISM: WordFeature = {
  FEATURE: 'word',
  HEBREW: /^יּ?י/u,
  TRANSLITERATION: 'ADONAI'
};

/** The lexicalized liturgical exception to the silent final he (סֶלָה → selah). */
const SELAH: WordFeature = {
  FEATURE: 'word',
  HEBREW: /^סֶלָה$/u,
  TRANSLITERATION: 'selah'
};

/** Capitalize the first letter of each line / verse. */
function capitalizeLineStarts(result: string): string {
  return result.replace(/(^|\n)(\p{L})/gu, (_match, lineBreak: string, first: string) =>
    lineBreak + first.toUpperCase()
  );
}

/**
 * Modern Israeli (Sephardic) transliteration following the rules in
 * shekelator/nechama's internal/transliteration/rules.go: ASCII only, no
 * academic diacritics, begadkefat by dagesh, tsadi as "ts", qof as "k",
 * kaf without dagesh as "kh", het as "ch", silent final he (except selah),
 * medial gutturals as apostrophes, no gemination, and ADONAI for the divine
 * name.
 */
export const NECHAMA_SCHEMA: Partial<Schema> = {
  // consonants
  ALEF: '',
  BET: 'v',
  BET_DAGESH: 'b',
  GIMEL: 'g',
  DALET: 'd',
  HE: 'h',
  VAV: 'v',
  ZAYIN: 'z',
  HET: 'ch',
  TET: 't',
  YOD: 'y',
  KAF: 'kh',
  KAF_DAGESH: 'k',
  FINAL_KAF: 'kh',
  LAMED: 'l',
  MEM: 'm',
  FINAL_MEM: 'm',
  NUN: 'n',
  FINAL_NUN: 'n',
  SAMEKH: 's',
  AYIN: '',
  PE: 'f',
  PE_DAGESH: 'p',
  FINAL_PE: 'f',
  TSADI: 'ts',
  FINAL_TSADI: 'ts',
  QOF: 'k',
  RESH: 'r',
  SHIN: 'sh',
  SIN: 's',
  TAV: 't',
  DAGESH: '',
  DAGESH_CHAZAQ: false, // single consonant — no doubling
  // vowels
  VOCAL_SHEVA: 'e',
  PATAH: 'a',
  HATAF_PATAH: 'a',
  QAMATS: 'a',
  HATAF_QAMATS: 'o',
  SEGOL: 'e',
  HATAF_SEGOL: 'e',
  TSERE: 'e',
  HIRIQ: 'i',
  HOLAM: 'o',
  HOLAM_HASER: 'o',
  QUBUTS: 'u',
  QAMATS_HE: 'a', // final he silent
  SEGOL_HE: 'e', // final he silent
  TSERE_HE: 'e', // final he silent
  SEGOL_YOD: 'e',
  HIRIQ_YOD: 'i',
  TSERE_YOD: 'ei',
  FURTIVE_PATAH: 'a',
  QAMATS_QATAN: 'o',
  HOLAM_VAV: 'o',
  SHUREQ: 'u',
  MS_SUFX: 'av',
  PASEQ: '',
  SOF_PASUQ: '.',
  MAQAF: '-',
  DIVINE_NAME: 'ADONAI',
  ADDITIONAL_FEATURES: [DOUBLE_YOD_EUPHEMISM, SELAH, MEDIAL_GUTTURAL],
  // syllabification: same as sblSimple
  longVowels: true,
  shevaAfterMeteg: true,
  sqnmlvy: true,
  wawShureq: true,
  article: true,
  allowNoNiqqud: true,
  strict: false,
  holemHaser: 'remove',
  ON_COMPLETE: capitalizeLineStarts
};