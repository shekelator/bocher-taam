/**
 * Cursor/selection helpers for contenteditable divs.
 */

/**
 * Get the current cursor offset (in UTF-16 code units from start of element's text content)
 * from the browser's Selection API.
 */
export function getCursorOffset(el: HTMLElement): number {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return 0;

  const range = sel.getRangeAt(0);
  const preRange = document.createRange();
  preRange.selectNodeContents(el);
  preRange.setEnd(range.endContainer, range.endOffset);
  return preRange.toString().length;
}

/**
 * Set the cursor to a specific offset (in UTF-16 code units) within a contenteditable element.
 */
export function setCursorOffset(el: HTMLElement, offset: number): void {
  const sel = window.getSelection();
  if (!sel) return;

  const range = document.createRange();
  let remaining = offset;
  let found = false;

  function walkNodes(node: Node): void {
    if (found) return;
    if (node.nodeType === Node.TEXT_NODE) {
      const len = (node as Text).length;
      if (remaining <= len) {
        range.setStart(node, remaining);
        range.collapse(true);
        found = true;
      } else {
        remaining -= len;
      }
    } else {
      for (const child of Array.from(node.childNodes)) {
        walkNodes(child);
        if (found) return;
      }
    }
  }

  walkNodes(el);

  if (!found) {
    // Cursor past end
    range.selectNodeContents(el);
    range.collapse(false);
  }

  sel.removeAllRanges();
  sel.addRange(range);
}
