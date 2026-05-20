const TEAMIM_PATTERN = /[\u0591-\u05AF]/gu;
const TEAMIM_AND_NEQUDOT_PATTERN = /[\u0591-\u05AF\u05B0-\u05BC\u05BD\u05BF-\u05C2\u05C4-\u05C5\u05C7]/gu;

export const HEBREW_MARK_REMOVAL_OPTIONS = [
  { value: 'teamim', label: "Remove all te'amim" },
  { value: 'teamim-and-nequdot', label: "Remove all te'amim and nequdot" }
] as const;

export type HebrewMarkRemoval = (typeof HEBREW_MARK_REMOVAL_OPTIONS)[number]['value'];

export function removeHebrewMarks(text: string, removal: HebrewMarkRemoval): string {
  const pattern = removal === 'teamim' ? TEAMIM_PATTERN : TEAMIM_AND_NEQUDOT_PATTERN;
  return text.replaceAll(pattern, '');
}
