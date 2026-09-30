import { transliterate } from 'hebrew-transliteration';
import { brillAcademic, brillSimple, SBL, sblSimple } from 'hebrew-transliteration/schemas';
import type { Schema } from 'hebrew-transliteration';
import { NECHAMA_SCHEMA } from './nechama-schema';

export const TRANSLITERATION_STYLE_OPTIONS = [
  { value: 'brill-simple', label: 'Brill simple' },
  { value: 'brill-academic', label: 'Brill academic' },
  { value: 'nechama', label: 'Modern Israeli (Nechama)' },
  { value: 'sbl-academic', label: 'SBL academic' },
  { value: 'sbl-simple', label: 'SBL simple' }
] as const;

export type TransliterationStyle = (typeof TRANSLITERATION_STYLE_OPTIONS)[number]['value'];

export const DEFAULT_TRANSLITERATION_STYLE: TransliterationStyle = 'brill-simple';

const SCHEMAS: Record<TransliterationStyle, Schema> = {
  'brill-simple': brillSimple,
  'brill-academic': brillAcademic,
  nechama: new SBL(NECHAMA_SCHEMA),
  'sbl-academic': new SBL({}),
  'sbl-simple': sblSimple
};

export function isTransliterationStyle(value: unknown): value is TransliterationStyle {
  return TRANSLITERATION_STYLE_OPTIONS.some((option) => option.value === value);
}

export function transliterateText(text: string, style: TransliterationStyle): string {
  if (!text) return '';
  return transliterate(text, SCHEMAS[style]);
}