import type { TabId } from '../types';

function createPaletteStore() {
  let activeTab = $state<TabId>('nekudot');
  let showAll = $state(false);
  let searchQuery = $state('');
  let chordMode = $state(false);

  return {
    get activeTab() { return activeTab; },
    get showAll() { return showAll; },
    get searchQuery() { return searchQuery; },
    get chordMode() { return chordMode; },

    setActiveTab(tab: TabId) { activeTab = tab; },
    toggleShowAll() { showAll = !showAll; },
    setShowAll(val: boolean) { showAll = val; },
    setSearchQuery(q: string) { searchQuery = q; },
    enterChordMode() { chordMode = true; },
    exitChordMode() { chordMode = false; },
  };
}

export const paletteStore = createPaletteStore();
