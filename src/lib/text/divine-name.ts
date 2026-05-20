const HEBREW_MARKS = '\u0591-\u05C7';
const DIVINE_NAME_PATTERN = new RegExp(
  `י[${HEBREW_MARKS}]*ה[${HEBREW_MARKS}]*ו[${HEBREW_MARKS}]*ה[${HEBREW_MARKS}]*`,
  'gu'
);

export const DIVINE_NAME_REPLACEMENTS = {
  'double-yud': 'יי',
  'heh-geresh': 'ה׳'
} as const;

export type DivineNameReplacement = keyof typeof DIVINE_NAME_REPLACEMENTS;

export const DIVINE_NAME_REPLACEMENT_OPTIONS: Array<{
  value: DivineNameReplacement;
  label: string;
}> = [
  { value: 'double-yud', label: 'יי' },
  { value: 'heh-geresh', label: 'ה׳' }
];

export function replaceDivineNameOccurrences(
  text: string,
  replacement: DivineNameReplacement
): string {
  return text.replaceAll(DIVINE_NAME_PATTERN, DIVINE_NAME_REPLACEMENTS[replacement]);
}
