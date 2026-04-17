<script lang="ts">
  import { tick } from 'svelte';
  import { getCursorOffset, setCursorOffset } from '$lib/engine/cursor';
  import { insertDiacritic } from '$lib/engine/cluster';
  import { documentStore } from '$lib/stores/document.svelte';
  import { paletteStore } from '$lib/stores/palette.svelte';
  import type { DiacriticDef } from '$lib/types';
  import ChordOverlay from './ChordOverlay.svelte';
  import Palette from './Palette.svelte';
  import Toolbar from './Toolbar.svelte';

  let editorEl: HTMLDivElement;
  let fontSize = $state(28);
  let lastCursorOffset = $state(0);

  function increaseFontSize() { fontSize = Math.min(fontSize + 4, 72); }
  function decreaseFontSize() { fontSize = Math.max(fontSize - 4, 12); }

  function handleInput() {
    if (!editorEl) return;
    const rawText = editorEl.innerText;
    documentStore.setContent(rawText);
  }

  function handleKeydown(e: KeyboardEvent) {
    // Chord mode trigger
    if (e.key === '`' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      lastCursorOffset = getCursorOffset(editorEl);
      paletteStore.enterChordMode();
      return;
    }

    const isMod = e.ctrlKey || e.metaKey;
    if (isMod && (e.key === '=' || e.key === '+')) { e.preventDefault(); increaseFontSize(); return; }
    if (isMod && e.key === '-') { e.preventDefault(); decreaseFontSize(); return; }
    if (isMod && e.shiftKey && e.key === 'C') { e.preventDefault(); navigator.clipboard.writeText(documentStore.content); return; }
    if (isMod && e.shiftKey && e.key === 'S') { e.preventDefault(); saveAsFile(); return; }
  }

  function saveAsFile() {
    const blob = new Blob([documentStore.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hebrew-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleInsert(item: DiacriticDef) {
    if (!editorEl) return;

    const text = documentStore.content;
    const cursor = lastCursorOffset;

    const result = insertDiacritic(text, cursor, item);

    documentStore.setContent(result.text);

    // Update DOM
    editorEl.innerText = result.text;
    await tick();
    setCursorOffset(editorEl, result.cursor);
    lastCursorOffset = result.cursor;
    editorEl.focus();
  }

  function handleFocus() {
    // track cursor position
  }

  function handleSelectionChange() {
    if (document.activeElement === editorEl && editorEl) {
      lastCursorOffset = getCursorOffset(editorEl);
    }
  }

  $effect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  });

  // Initialize editor with stored content
  $effect(() => {
    if (editorEl && documentStore.content && !editorEl.innerText) {
      editorEl.innerText = documentStore.content;
    }
  });
</script>

<div class="editor-wrapper">
  <Toolbar
    {fontSize}
    onIncrease={increaseFontSize}
    onDecrease={decreaseFontSize}
  />

  <div class="editor-area">
    <div
      bind:this={editorEl}
      contenteditable="true"
      role="textbox"
      aria-multiline="true"
      aria-label="Hebrew text editor"
      dir="rtl"
      lang="he"
      class="editor"
      style="font-size: {fontSize}px"
      oninput={handleInput}
      onkeydown={handleKeydown}
      onfocus={handleFocus}
    ></div>
  </div>

  <Palette onInsert={handleInsert} />

  {#if paletteStore.chordMode}
    <ChordOverlay
      onInsert={handleInsert}
      onClose={() => { paletteStore.exitChordMode(); editorEl?.focus(); }}
    />
  {/if}
</div>

<style>
  .editor-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
  }

  .editor-area {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: var(--spacing-md);
  }

  .editor {
    min-height: 100%;
    font-family: var(--font-hebrew);
    line-height: 2;
    outline: none;
    white-space: pre-wrap;
    word-break: break-word;
    caret-color: var(--color-accent);
  }
</style>
