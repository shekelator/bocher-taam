import { normalizeText } from '../engine/cluster';

const STORAGE_KEY = 'bocher-taam-content';

function createDocumentStore() {
  let content = $state(loadFromStorage());
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  function loadFromStorage(): string {
    if (typeof localStorage === 'undefined') return '';
    return localStorage.getItem(STORAGE_KEY) ?? '';
  }

  function saveToStorage(text: string) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, text);
  }

  function debouncedSave(text: string) {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      saveToStorage(text);
    }, 1000);
  }

  return {
    get content() { return content; },

    setContent(text: string) {
      content = text;
      debouncedSave(text);
    },

    normalizeAndSet(text: string) {
      const normalized = normalizeText(text);
      content = normalized;
      debouncedSave(normalized);
      return normalized;
    },

    saveNow() {
      if (debounceTimer) clearTimeout(debounceTimer);
      saveToStorage(content);
    },
  };
}

export const documentStore = createDocumentStore();
