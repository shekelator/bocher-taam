<script lang="ts">
  import '../app.css';
  import Editor from '../components/Editor.svelte';
</script>

<svelte:head>
  <title>Bocher Taam — Hebrew Nikud & Te'amim Editor</title>
</svelte:head>

<main>
  <header>
    <h1>בֹּחֵר טַעַם</h1>
    <p class="subtitle">Hebrew Nikud &amp; Te'amim Editor</p>
  </header>

  <div class="app-body">
    <Editor />
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  header {
    display: flex;
    align-items: baseline;
    gap: var(--spacing-md);
    padding: var(--spacing-sm) var(--spacing-md);
    border-bottom: 1px solid var(--color-border);
    background: var(--color-surface);
    flex-shrink: 0;
  }

  h1 {
    font-family: var(--font-hebrew);
    font-size: 1.5rem;
    margin: 0;
    color: var(--color-accent);
  }

  .subtitle {
    margin: 0;
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .app-body {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
</style>
