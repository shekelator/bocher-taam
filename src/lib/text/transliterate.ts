import { transliterate } from 'hebrew-transliteration';
import { brillAcademic, brillSimple, SBL, sblSimple } from 'hebrew-transliteration/schemas';
import type { Schema } from 'hebrew-transliteration';

export const TRANSLITERATION_STYLE_OPTIONS = [
  { value: 'sbl-academic', label: 'SBL academic' },
  { value: 'sbl-simple', label: 'SBL simple' },
  { value: 'brill-academic', label: 'Brill academic' },
  { value: 'brill-simple', label: 'Brill simple' }
] as const;

export type TransliterationStyle = (typeof TRANSLITERATION_STYLE_OPTIONS)[number]['value'];

export const DEFAULT_TRANSLITERATION_STYLE: TransliterationStyle = 'sbl-academic';

const SCHEMAS: Record<TransliterationStyle, Schema> = {
  'sbl-academic': new SBL({}),
  'sbl-simple': sblSimple,
  'brill-academic': brillAcademic,
  'brill-simple': brillSimple
};

export function isTransliterationStyle(value: unknown): value is TransliterationStyle {
  return TRANSLITERATION_STYLE_OPTIONS.some((option) => option.value === value);
}

export function transliterateText(text: string, style: TransliterationStyle): string {
  if (!text) return '';
  return transliterate(text, SCHEMAS[style]);
}