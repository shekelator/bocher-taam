/** SBL Hebrew ordering categories for combining marks */
export enum SblCategory {
  ShinSinDot = 1,
  DageshRafe = 2,
  Vowel      = 3,
  Meteg      = 4,
  Taam       = 5,
}

/** A single nikud or taam mark the user can insert */
export interface DiacriticDef {
  /** Display name, e.g. "Patach" */
  name: string;
  /** The Unicode combining character, e.g. '\u05B7' */
  codepoint: string;
  /** U+XXXX for display */
  hex: string;
  /** Chord-mode key, e.g. 'p' for Patach */
  key: string;
  /** Category for SBL sort ordering */
  sblCategory: SblCategory;
  /** Is this in the "common" set? */
  common: boolean;
}

export type TabId = 'nekudot' | 'teamim';
