<script lang="ts">
  import type { DiacriticDef } from '$lib/types';

  interface Props {
    item: DiacriticDef;
    onclick: (item: DiacriticDef) => void;
  }

  let { item, onclick }: Props = $props();

  const DOTTED_CIRCLE = '\u25CC';
</script>

<button
  class="palette-item"
  title={item.name}
  onclick={() => onclick(item)}
>
  <span class="glyph" lang="he">{DOTTED_CIRCLE}{item.codepoint}</span>
  <span class="label">{item.name}</span>
  <kbd class="key">{item.key}</kbd>
</button>

<style>
  .palette-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 6px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    cursor: pointer;
    min-width: 80px;
    transition: background 0.1s, border-color 0.1s;
  }

  .palette-item:hover {
    background: var(--color-btn-hover);
    border-color: var(--color-border-focus);
  }

  .glyph {
    font-family: var(--font-hebrew);
    font-size: 1.8em;
    line-height: 1.4;
  }

  .label {
    font-size: 0.7em;
    color: var(--color-text-muted);
    text-align: center;
    white-space: nowrap;
  }

  .key {
    font-size: 0.65em;
    padding: 1px 5px;
    background: var(--color-tab-bg);
    border: 1px solid var(--color-border);
    border-radius: 3px;
    font-family: monospace;
    color: var(--color-accent);
  }
</style>
