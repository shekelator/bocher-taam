<script lang="ts">
  import { documentStore } from '$lib/stores/document.svelte';

  interface Props {
    fontSize: number;
    onIncrease: () => void;
    onDecrease: () => void;
  }

  let { fontSize, onIncrease, onDecrease }: Props = $props();

  let showHelp = $state(false);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(documentStore.content);
    } catch {
      // fallback — select all and copy
    }
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
</script>

<div class="toolbar">
  <div class="toolbar-group">
    <button onclick={onDecrease} title="Decrease font size (Ctrl/Cmd -)">A−</button>
    <span class="font-size">{fontSize}px</span>
    <button onclick={onIncrease} title="Increase font size (Ctrl/Cmd +)">A+</button>
  </div>

  <div class="toolbar-group">
    <button onclick={copyToClipboard} title="Copy all to clipboard (Ctrl/Cmd+Shift+C)">
      📋 Copy
    </button>
    <button onclick={saveAsFile} title="Save as .txt (Ctrl/Cmd+Shift+S)">
      💾 Save
    </button>
    <button onclick={() => showHelp = !showHelp} title="Keyboard shortcuts">
      ❓ Help
    </button>
  </div>
</div>

{#if showHelp}
  <div class="help-panel">
    <h3>Keyboard Shortcuts</h3>
    <table>
      <tbody>
        <tr><td><kbd>`</kbd></td><td>Enter chord mode</td></tr>
        <tr><td><kbd>Tab</kbd> (in chord)</td><td>Switch Nekudot / Te'amim</td></tr>
        <tr><td><kbd>Esc</kbd> (in chord)</td><td>Cancel chord mode</td></tr>
        <tr><td><kbd>Ctrl/Cmd +</kbd></td><td>Increase font size</td></tr>
        <tr><td><kbd>Ctrl/Cmd -</kbd></td><td>Decrease font size</td></tr>
        <tr><td><kbd>Ctrl/Cmd Shift C</kbd></td><td>Copy all to clipboard</td></tr>
        <tr><td><kbd>Ctrl/Cmd Shift S</kbd></td><td>Save as .txt file</td></tr>
        <tr><td><kbd>Ctrl/Cmd Z</kbd></td><td>Undo</td></tr>
      </tbody>
    </table>
    <h4>Nekudot chord keys</h4>
    <p>p=Patach, q=Qamats, i=Hiriq, e=Tsere, E=Segol, o=Holam, u=Qubuts, :=Shva, d=Dagesh, S=Shin Dot, s=Sin Dot, P=Hataf Patach, r=Rafe, m=Meteg</p>
    <h4>Te'amim chord keys</h4>
    <p>e=Etnachta, z=Zaqef Qatan, Z=Zaqef Gadol, t=Tipcha, r=Revia, p=Pashta, v=Tevir, g=Geresh, "=Gershayim, m=Munach, M=Mahapakh, k=Merkha, .=Sof Pasuq</p>
    <button onclick={() => showHelp = false}>Close</button>
  </div>
{/if}

<style>
  .toolbar {
    display: flex;
    gap: var(--spacing-md);
    align-items: center;
    padding: var(--spacing-sm) var(--spacing-md);
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    flex-wrap: wrap;
  }

  .toolbar-group {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }

  button {
    padding: 5px 10px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-surface);
    font-size: 0.875rem;
    color: var(--color-text);
    transition: background 0.1s;
  }

  button:hover {
    background: var(--color-btn-hover);
  }

  .font-size {
    font-size: 0.8rem;
    color: var(--color-text-muted);
    min-width: 40px;
    text-align: center;
  }

  .help-panel {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: var(--spacing-lg);
    z-index: 500;
    max-width: 480px;
    width: 90%;
    box-shadow: 0 4px 24px rgba(0,0,0,0.2);
  }

  .help-panel h3 {
    margin: 0 0 var(--spacing-sm);
  }

  .help-panel h4 {
    margin: var(--spacing-sm) 0 4px;
  }

  .help-panel table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: var(--spacing-sm);
  }

  .help-panel td {
    padding: 4px 8px;
    font-size: 0.875rem;
  }

  .help-panel kbd {
    background: var(--color-tab-bg);
    border: 1px solid var(--color-border);
    border-radius: 3px;
    padding: 1px 5px;
    font-size: 0.8em;
    font-family: monospace;
  }

  .help-panel p {
    font-size: 0.8rem;
    color: var(--color-text-muted);
    margin: 0 0 var(--spacing-sm);
  }

  .help-panel button {
    width: 100%;
    margin-top: var(--spacing-sm);
  }
</style>
