import {
  DEFAULT_TRANSLITERATION_STYLE,
  isTransliterationStyle,
  type TransliterationStyle
} from '../text/transliterate';

const ENABLED_KEY = 'bocher-taam-transliteration';
const STYLE_KEY = 'bocher-taam-transliteration-style';

function createTransliterationStore() {
  let enabled = $state(loadEnabled());
  let styleId = $state(loadStyleId());

  function loadEnabled(): boolean {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem(ENABLED_KEY) === 'true';
  }

  function loadStyleId(): TransliterationStyle {
    if (typeof localStorage === 'undefined') return DEFAULT_TRANSLITERATION_STYLE;
    const stored = localStorage.getItem(STYLE_KEY);
    return isTransliterationStyle(stored) ? stored : DEFAULT_TRANSLITERATION_STYLE;
  }

  function saveEnabled(value: boolean) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(ENABLED_KEY, String(value));
  }

  function saveStyleId(value: TransliterationStyle) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STYLE_KEY, value);
  }

  return {
    get enabled() { return enabled; },
    get styleId() { return styleId; },

    setEnabled(value: boolean) {
      enabled = value;
      saveEnabled(value);
    },

    toggleEnabled() {
      enabled = !enabled;
      saveEnabled(enabled);
    },

    setStyleId(value: TransliterationStyle) {
      styleId = value;
      saveStyleId(value);
    },
  };
}

export const transliterationStore = createTransliterationStore();