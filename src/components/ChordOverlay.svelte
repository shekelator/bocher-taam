<script lang="ts">
  import { nekudot } from '$lib/data/nekudot';
  import { teamim } from '$lib/data/teamim';
  import { paletteStore } from '$lib/stores/palette.svelte';
  import type { DiacriticDef, TabId } from '$lib/types';

  interface Props {
    onInsert: (item: DiacriticDef) => void;
    onClose: () => void;
  }

  let { onInsert, onClose }: Props = $props();

  const DOTTED_CIRCLE = '\u25CC';

  let items = $derived(
    paletteStore.activeTab === 'nekudot' ? nekudot : teamim
  );

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      paletteStore.setActiveTab(paletteStore.activeTab === 'nekudot' ? 'teamim' : 'nekudot');
      return;
    }
    const found = items.find((item) => item.key === e.key);
    if (found) {
      e.preventDefault();
      onInsert(found);
      onClose();
    }
  }

  $effect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  });
</script>

<div class="overlay" role="dialog" aria-label="Chord mode" aria-modal="true">
  <div class="chord-panel">
    <div class="chord-header">
      <span class="chord-title">Chord Mode — {paletteStore.activeTab === 'nekudot' ? 'Nekudot' : "Te'amim"}</span>
      <span class="chord-hint">Tab: switch • Esc: cancel</span>
    </div>
    <div class="chord-grid">
      {#each items as item (item.codepoint)}
        <button
          class="chord-item"
          onclick={() => { onInsert(item); onClose(); }}
          title={item.name}
        >
          <span class="key">{item.key}</span>
          <span class="glyph" lang="he">{DOTTED_CIRCLE}{item.codepoint}</span>
          <span class="name">{item.name}</span>
        </button>
      {/each}
    </div>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: var(--color-overlay-bg);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    z-index: 1000;
    padding: var(--spacing-md);
  }

  .chord-panel {
    background: var(--color-chord-bg);
    color: var(--color-chord-text);
    border-radius: var(--radius);
    padding: var(--spacing-md);
    width: 100%;
    max-width: 800px;
    max-height: 60vh;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    box-shadow: 0 -4px 24px rgba(0,0,0,0.4);
  }

  .chord-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
  }

  .chord-title {
    font-weight: 600;
    color: #d4b896;
  }

  .chord-hint {
    color: #8a7a6a;
    font-size: 0.8rem;
  }

  .chord-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    overflow-y: auto;
  }

  .chord-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 10px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: var(--radius);
    color: var(--color-chord-text);
    cursor: pointer;
    min-width: 70px;
    transition: background 0.1s;
  }

  .chord-item:hover {
    background: rgba(255,255,255,0.15);
  }

  .key {
    font-family: monospace;
    font-size: 1rem;
    color: #f0c070;
    font-weight: bold;
  }

  .glyph {
    font-family: var(--font-hebrew);
    font-size: 1.6em;
    line-height: 1.3;
  }

  .name {
    font-size: 0.65em;
    color: #8a7a6a;
    text-align: center;
    white-space: nowrap;
  }
</style>
