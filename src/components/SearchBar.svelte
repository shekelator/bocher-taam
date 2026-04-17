<script lang="ts">
  interface Props {
    value: string;
    onchange: (value: string) => void;
    placeholder?: string;
  }

  let { value, onchange, placeholder = 'Search…' }: Props = $props();
</script>

<div class="search-bar">
  <input
    type="search"
    {placeholder}
    value={value}
    oninput={(e) => onchange((e.target as HTMLInputElement).value)}
  />
</div>

<style>
  .search-bar {
    width: 100%;
  }

  input {
    width: 100%;
    padding: 6px 10px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    font-size: 0.875rem;
    background: var(--color-surface);
    color: var(--color-text);
    outline: none;
    transition: border-color 0.15s;
  }

  input:focus {
    border-color: var(--color-border-focus);
  }
</style>
