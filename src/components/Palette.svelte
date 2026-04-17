<script lang="ts">
  import { nekudot } from '$lib/data/nekudot';
  import { teamim } from '$lib/data/teamim';
  import { paletteStore } from '$lib/stores/palette.svelte';
  import type { DiacriticDef, TabId } from '$lib/types';
  import PaletteItem from './PaletteItem.svelte';
  import SearchBar from './SearchBar.svelte';

  interface Props {
    onInsert: (item: DiacriticDef) => void;
  }

  let { onInsert }: Props = $props();

  const tabs: { id: TabId; label: string }[] = [
    { id: 'nekudot', label: 'Nekudot' },
    { id: 'teamim', label: "Te'amim" },
  ];

  let items = $derived(
    paletteStore.activeTab === 'nekudot' ? nekudot : teamim
  );

  let filtered = $derived(
    items
      .filter((item) => paletteStore.showAll || item.common)
      .filter((item) =>
        paletteStore.searchQuery.length === 0 ||
        item.name.toLowerCase().includes(paletteStore.searchQuery.toLowerCase())
      )
  );
</script>

<div class="palette">
  <div class="palette-header">
    <div class="tabs">
      {#each tabs as tab}
        <button
          class="tab"
          class:active={paletteStore.activeTab === tab.id}
          onclick={() => paletteStore.setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      {/each}
    </div>

    <div class="controls">
      <label class="toggle">
        <input
          type="checkbox"
          checked={paletteStore.showAll}
          onchange={() => paletteStore.toggleShowAll()}
        />
        <span>All</span>
      </label>
    </div>
  </div>

  <div class="palette-search">
    <SearchBar
      value={paletteStore.searchQuery}
      onchange={(q) => paletteStore.setSearchQuery(q)}
      placeholder="Search by name…"
    />
  </div>

  <div class="palette-grid">
    {#each filtered as item (item.codepoint)}
      <PaletteItem {item} onclick={onInsert} />
    {/each}
    {#if filtered.length === 0}
      <p class="empty">No marks found</p>
    {/if}
  </div>
</div>

<style>
  .palette {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: var(--spacing-md);
    min-height: 0;
  }

  .palette-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-sm);
  }

  .tabs {
    display: flex;
    gap: 2px;
    background: var(--color-tab-bg);
    border-radius: var(--radius);
    padding: 3px;
  }

  .tab {
    padding: 5px 14px;
    border: none;
    background: transparent;
    border-radius: calc(var(--radius) - 2px);
    font-size: 0.875rem;
    color: var(--color-text-muted);
    transition: background 0.15s, color 0.15s;
  }

  .tab.active {
    background: var(--color-surface);
    color: var(--color-tab-active);
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: var(--color-text-muted);
    cursor: pointer;
    user-select: none;
  }

  .palette-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    overflow-y: auto;
    max-height: 220px;
    padding: 4px 0;
  }

  .empty {
    color: var(--color-text-muted);
    font-size: 0.875rem;
    margin: 0;
    padding: var(--spacing-sm);
  }
</style>
