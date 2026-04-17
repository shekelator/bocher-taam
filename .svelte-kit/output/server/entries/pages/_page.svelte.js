import { e as escape_html, a0 as ensure_array_like, a1 as attr, $ as derived, a2 as attr_class, a3 as attr_style, a4 as stringify, a5 as head } from "../../chunks/renderer.js";
import "clsx";
var SblCategory = /* @__PURE__ */ ((SblCategory2) => {
  SblCategory2[SblCategory2["ShinSinDot"] = 1] = "ShinSinDot";
  SblCategory2[SblCategory2["DageshRafe"] = 2] = "DageshRafe";
  SblCategory2[SblCategory2["Vowel"] = 3] = "Vowel";
  SblCategory2[SblCategory2["Meteg"] = 4] = "Meteg";
  SblCategory2[SblCategory2["Taam"] = 5] = "Taam";
  return SblCategory2;
})(SblCategory || {});
const HEBREW_BASE_START = 1488;
const HEBREW_BASE_END = 1514;
const HEBREW_MARK_RANGES = [
  [1425, 1479]
];
function isHebrewCombiningMark(cp) {
  return HEBREW_MARK_RANGES.some(([lo, hi]) => cp >= lo && cp <= hi);
}
function isHebrewBase(cp) {
  return cp >= HEBREW_BASE_START && cp <= HEBREW_BASE_END;
}
function sblSortKey(cp) {
  if (cp === 1473 || cp === 1474) return [SblCategory.ShinSinDot, cp];
  if (cp === 1468 || cp === 1471) return [SblCategory.DageshRafe, cp];
  if (cp === 1469) return [SblCategory.Meteg, cp];
  if (cp >= 1456 && cp <= 1467 || cp === 1479) return [SblCategory.Vowel, cp];
  if (cp >= 1425 && cp <= 1455 || cp === 1472 || cp === 1475) return [SblCategory.Taam, cp];
  return [99, cp];
}
function toCodePoints(str) {
  return [...str].map((ch) => ch.codePointAt(0));
}
function fromCodePoints(cps) {
  return cps.map((cp) => String.fromCodePoint(cp)).join("");
}
function normalizeText(text) {
  const cps = toCodePoints(text);
  const result = [];
  let i = 0;
  while (i < cps.length) {
    const cp = cps[i];
    if (isHebrewBase(cp)) {
      const base = cp;
      i++;
      const marks = [];
      while (i < cps.length && isHebrewCombiningMark(cps[i])) {
        marks.push(cps[i]);
        i++;
      }
      marks.sort((a, b) => {
        const [catA, cpA] = sblSortKey(a);
        const [catB, cpB] = sblSortKey(b);
        if (catA !== catB) return catA - catB;
        return cpA - cpB;
      });
      result.push(base, ...marks);
    } else {
      result.push(cp);
      i++;
    }
  }
  return fromCodePoints(result);
}
const STORAGE_KEY = "bocher-taam-content";
function createDocumentStore() {
  let content = loadFromStorage();
  let debounceTimer = null;
  function loadFromStorage() {
    if (typeof localStorage === "undefined") return "";
    return localStorage.getItem(STORAGE_KEY) ?? "";
  }
  function saveToStorage(text) {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, text);
  }
  function debouncedSave(text) {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(
      () => {
        saveToStorage(text);
      },
      1e3
    );
  }
  return {
    get content() {
      return content;
    },
    setContent(text) {
      content = text;
      debouncedSave(text);
    },
    normalizeAndSet(text) {
      const normalized = normalizeText(text);
      content = normalized;
      debouncedSave(normalized);
      return normalized;
    },
    saveNow() {
      if (debounceTimer) clearTimeout(debounceTimer);
      saveToStorage(content);
    }
  };
}
createDocumentStore();
function createPaletteStore() {
  let activeTab = "nekudot";
  let showAll = false;
  let searchQuery = "";
  let chordMode = false;
  return {
    get activeTab() {
      return activeTab;
    },
    get showAll() {
      return showAll;
    },
    get searchQuery() {
      return searchQuery;
    },
    get chordMode() {
      return chordMode;
    },
    setActiveTab(tab) {
      activeTab = tab;
    },
    toggleShowAll() {
      showAll = !showAll;
    },
    setShowAll(val) {
      showAll = val;
    },
    setSearchQuery(q) {
      searchQuery = q;
    },
    enterChordMode() {
      chordMode = true;
    },
    exitChordMode() {
      chordMode = false;
    }
  };
}
const paletteStore = createPaletteStore();
const nekudot = [
  // Shin/Sin dots
  {
    name: "Shin Dot",
    codepoint: "ׁ",
    hex: "U+05C1",
    key: "S",
    sblCategory: SblCategory.ShinSinDot,
    common: true
  },
  {
    name: "Sin Dot",
    codepoint: "ׂ",
    hex: "U+05C2",
    key: "s",
    sblCategory: SblCategory.ShinSinDot,
    common: true
  },
  // Dagesh/Rafe
  {
    name: "Dagesh",
    codepoint: "ּ",
    hex: "U+05BC",
    key: "d",
    sblCategory: SblCategory.DageshRafe,
    common: true
  },
  {
    name: "Rafe",
    codepoint: "ֿ",
    hex: "U+05BF",
    key: "r",
    sblCategory: SblCategory.DageshRafe,
    common: false
  },
  // Vowels
  {
    name: "Patach",
    codepoint: "ַ",
    hex: "U+05B7",
    key: "p",
    sblCategory: SblCategory.Vowel,
    common: true
  },
  {
    name: "Qamats",
    codepoint: "ָ",
    hex: "U+05B8",
    key: "q",
    sblCategory: SblCategory.Vowel,
    common: true
  },
  {
    name: "Qamats Qatan",
    codepoint: "ׇ",
    hex: "U+05C7",
    key: "Q",
    sblCategory: SblCategory.Vowel,
    common: false
  },
  {
    name: "Hiriq",
    codepoint: "ִ",
    hex: "U+05B4",
    key: "i",
    sblCategory: SblCategory.Vowel,
    common: true
  },
  {
    name: "Tsere",
    codepoint: "ֵ",
    hex: "U+05B5",
    key: "e",
    sblCategory: SblCategory.Vowel,
    common: true
  },
  {
    name: "Segol",
    codepoint: "ֶ",
    hex: "U+05B6",
    key: "E",
    sblCategory: SblCategory.Vowel,
    common: true
  },
  {
    name: "Holam",
    codepoint: "ֹ",
    hex: "U+05B9",
    key: "o",
    sblCategory: SblCategory.Vowel,
    common: true
  },
  {
    name: "Holam Haser",
    codepoint: "ֺ",
    hex: "U+05BA",
    key: "O",
    sblCategory: SblCategory.Vowel,
    common: false
  },
  {
    name: "Qubuts",
    codepoint: "ֻ",
    hex: "U+05BB",
    key: "u",
    sblCategory: SblCategory.Vowel,
    common: true
  },
  {
    name: "Shva",
    codepoint: "ְ",
    hex: "U+05B0",
    key: ":",
    sblCategory: SblCategory.Vowel,
    common: true
  },
  {
    name: "Hataf Patach",
    codepoint: "ֲ",
    hex: "U+05B2",
    key: "P",
    sblCategory: SblCategory.Vowel,
    common: true
  },
  {
    name: "Hataf Qamats",
    codepoint: "ֳ",
    hex: "U+05B3",
    key: "A",
    sblCategory: SblCategory.Vowel,
    common: false
  },
  {
    name: "Hataf Segol",
    codepoint: "ֱ",
    hex: "U+05B1",
    key: "F",
    sblCategory: SblCategory.Vowel,
    common: false
  },
  // Meteg
  {
    name: "Meteg",
    codepoint: "ֽ",
    hex: "U+05BD",
    key: "m",
    sblCategory: SblCategory.Meteg,
    common: false
  }
];
const teamim = [
  // Common te'amim (21-books prose set)
  {
    name: "Etnachta",
    codepoint: "֑",
    hex: "U+0591",
    key: "e",
    sblCategory: SblCategory.Taam,
    common: true
  },
  {
    name: "Segol (Taam)",
    codepoint: "֒",
    hex: "U+0592",
    key: "E",
    sblCategory: SblCategory.Taam,
    common: false
  },
  {
    name: "Shalshelet",
    codepoint: "֓",
    hex: "U+0593",
    key: "L",
    sblCategory: SblCategory.Taam,
    common: false
  },
  {
    name: "Zaqef Qatan",
    codepoint: "֔",
    hex: "U+0594",
    key: "z",
    sblCategory: SblCategory.Taam,
    common: true
  },
  {
    name: "Zaqef Gadol",
    codepoint: "֕",
    hex: "U+0595",
    key: "Z",
    sblCategory: SblCategory.Taam,
    common: true
  },
  {
    name: "Tipcha",
    codepoint: "֖",
    hex: "U+0596",
    key: "t",
    sblCategory: SblCategory.Taam,
    common: true
  },
  {
    name: "Revia",
    codepoint: "֗",
    hex: "U+0597",
    key: "r",
    sblCategory: SblCategory.Taam,
    common: true
  },
  {
    name: "Zarqa",
    codepoint: "֘",
    hex: "U+0598",
    key: "x",
    sblCategory: SblCategory.Taam,
    common: false
  },
  {
    name: "Pashta",
    codepoint: "֙",
    hex: "U+0599",
    key: "p",
    sblCategory: SblCategory.Taam,
    common: true
  },
  {
    name: "Yetiv",
    codepoint: "֚",
    hex: "U+059A",
    key: "y",
    sblCategory: SblCategory.Taam,
    common: false
  },
  {
    name: "Tevir",
    codepoint: "֛",
    hex: "U+059B",
    key: "v",
    sblCategory: SblCategory.Taam,
    common: true
  },
  {
    name: "Geresh",
    codepoint: "֜",
    hex: "U+059C",
    key: "g",
    sblCategory: SblCategory.Taam,
    common: true
  },
  {
    name: "Geresh Muqdam",
    codepoint: "֝",
    hex: "U+059D",
    key: "G",
    sblCategory: SblCategory.Taam,
    common: false
  },
  {
    name: "Gershayim",
    codepoint: "֞",
    hex: "U+059E",
    key: '"',
    sblCategory: SblCategory.Taam,
    common: true
  },
  {
    name: "Qarney Para",
    codepoint: "֟",
    hex: "U+059F",
    key: "C",
    sblCategory: SblCategory.Taam,
    common: false
  },
  {
    name: "Telisha Gedola",
    codepoint: "֠",
    hex: "U+05A0",
    key: "T",
    sblCategory: SblCategory.Taam,
    common: false
  },
  {
    name: "Pazer",
    codepoint: "֡",
    hex: "U+05A1",
    key: "P",
    sblCategory: SblCategory.Taam,
    common: false
  },
  {
    name: "Atnah Hafukh",
    codepoint: "֢",
    hex: "U+05A2",
    key: "H",
    sblCategory: SblCategory.Taam,
    common: false
  },
  {
    name: "Munach",
    codepoint: "֣",
    hex: "U+05A3",
    key: "m",
    sblCategory: SblCategory.Taam,
    common: true
  },
  {
    name: "Mahapakh",
    codepoint: "֤",
    hex: "U+05A4",
    key: "M",
    sblCategory: SblCategory.Taam,
    common: true
  },
  {
    name: "Merkha",
    codepoint: "֥",
    hex: "U+05A5",
    key: "k",
    sblCategory: SblCategory.Taam,
    common: true
  },
  {
    name: "Merkha Kefula",
    codepoint: "֦",
    hex: "U+05A6",
    key: "K",
    sblCategory: SblCategory.Taam,
    common: false
  },
  {
    name: "Darga",
    codepoint: "֧",
    hex: "U+05A7",
    key: "D",
    sblCategory: SblCategory.Taam,
    common: false
  },
  {
    name: "Qadma",
    codepoint: "֨",
    hex: "U+05A8",
    key: "q",
    sblCategory: SblCategory.Taam,
    common: false
  },
  {
    name: "Telisha Qetana",
    codepoint: "֩",
    hex: "U+05A9",
    key: "Q",
    sblCategory: SblCategory.Taam,
    common: false
  },
  {
    name: "Yerah Ben Yomo",
    codepoint: "֪",
    hex: "U+05AA",
    key: "Y",
    sblCategory: SblCategory.Taam,
    common: false
  },
  {
    name: "Ole",
    codepoint: "֫",
    hex: "U+05AB",
    key: "o",
    sblCategory: SblCategory.Taam,
    common: false
  },
  {
    name: "Iluy",
    codepoint: "֬",
    hex: "U+05AC",
    key: "I",
    sblCategory: SblCategory.Taam,
    common: false
  },
  {
    name: "Dehi",
    codepoint: "֭",
    hex: "U+05AD",
    key: "i",
    sblCategory: SblCategory.Taam,
    common: false
  },
  {
    name: "Zinor",
    codepoint: "֮",
    hex: "U+05AE",
    key: "n",
    sblCategory: SblCategory.Taam,
    common: false
  },
  {
    name: "Sof Pasuq",
    codepoint: "׃",
    hex: "U+05C3",
    key: ".",
    sblCategory: SblCategory.Taam,
    common: true
  },
  {
    name: "Paseq",
    codepoint: "׀",
    hex: "U+05C0",
    key: "|",
    sblCategory: SblCategory.Taam,
    common: false
  }
];
function ChordOverlay($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let items = derived(() => paletteStore.activeTab === "nekudot" ? nekudot : teamim);
    $$renderer2.push(`<div class="overlay svelte-1kgokpy" role="dialog" aria-label="Chord mode" aria-modal="true"><div class="chord-panel svelte-1kgokpy"><div class="chord-header svelte-1kgokpy"><span class="chord-title svelte-1kgokpy">Chord Mode — ${escape_html(paletteStore.activeTab === "nekudot" ? "Nekudot" : "Te'amim")}</span> <span class="chord-hint svelte-1kgokpy">Tab: switch • Esc: cancel</span></div> <div class="chord-grid svelte-1kgokpy"><!--[-->`);
    const each_array = ensure_array_like(items());
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      $$renderer2.push(`<button class="chord-item svelte-1kgokpy"${attr("title", item.name)}><span class="key svelte-1kgokpy">${escape_html(item.key)}</span> <span class="glyph svelte-1kgokpy" lang="he">◌${escape_html(item.codepoint)}</span> <span class="name svelte-1kgokpy">${escape_html(item.name)}</span></button>`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
  });
}
function PaletteItem($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { item } = $$props;
    $$renderer2.push(`<button class="palette-item svelte-smlx90"${attr("title", item.name)}><span class="glyph svelte-smlx90" lang="he">◌${escape_html(item.codepoint)}</span> <span class="label svelte-smlx90">${escape_html(item.name)}</span> <kbd class="key svelte-smlx90">${escape_html(item.key)}</kbd></button>`);
  });
}
function SearchBar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { value, placeholder = "Search…" } = $$props;
    $$renderer2.push(`<div class="search-bar svelte-tsg0ih"><input type="search"${attr("placeholder", placeholder)}${attr("value", value)} class="svelte-tsg0ih"/></div>`);
  });
}
function Palette($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const tabs = [
      { id: "nekudot", label: "Nekudot" },
      { id: "teamim", label: "Te'amim" }
    ];
    let items = derived(() => paletteStore.activeTab === "nekudot" ? nekudot : teamim);
    let filtered = derived(() => items().filter((item) => paletteStore.showAll || item.common).filter((item) => paletteStore.searchQuery.length === 0 || item.name.toLowerCase().includes(paletteStore.searchQuery.toLowerCase())));
    $$renderer2.push(`<div class="palette svelte-130wuz3"><div class="palette-header svelte-130wuz3"><div class="tabs svelte-130wuz3"><!--[-->`);
    const each_array = ensure_array_like(tabs);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let tab = each_array[$$index];
      $$renderer2.push(`<button${attr_class("tab svelte-130wuz3", void 0, { "active": paletteStore.activeTab === tab.id })}>${escape_html(tab.label)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="controls"><label class="toggle svelte-130wuz3"><input type="checkbox"${attr("checked", paletteStore.showAll, true)}/> <span>All</span></label></div></div> <div class="palette-search">`);
    SearchBar($$renderer2, {
      value: paletteStore.searchQuery,
      placeholder: "Search by name…"
    });
    $$renderer2.push(`<!----></div> <div class="palette-grid svelte-130wuz3"><!--[-->`);
    const each_array_1 = ensure_array_like(filtered());
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let item = each_array_1[$$index_1];
      PaletteItem($$renderer2, { item });
    }
    $$renderer2.push(`<!--]--> `);
    if (filtered().length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="empty svelte-130wuz3">No marks found</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
function Toolbar($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { fontSize } = $$props;
    $$renderer2.push(`<div class="toolbar svelte-1b5lykn"><div class="toolbar-group svelte-1b5lykn"><button title="Decrease font size (Ctrl/Cmd -)" class="svelte-1b5lykn">A−</button> <span class="font-size svelte-1b5lykn">${escape_html(fontSize)}px</span> <button title="Increase font size (Ctrl/Cmd +)" class="svelte-1b5lykn">A+</button></div> <div class="toolbar-group svelte-1b5lykn"><button title="Copy all to clipboard (Ctrl/Cmd+Shift+C)" class="svelte-1b5lykn">📋 Copy</button> <button title="Save as .txt (Ctrl/Cmd+Shift+S)" class="svelte-1b5lykn">💾 Save</button> <button title="Keyboard shortcuts" class="svelte-1b5lykn">❓ Help</button></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function Editor($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let fontSize = 28;
    $$renderer2.push(`<div class="editor-wrapper svelte-nmz6rb">`);
    Toolbar($$renderer2, {
      // Initialize editor with stored content
      fontSize
    });
    $$renderer2.push(`<!----> <div class="editor-area svelte-nmz6rb"><div contenteditable="true" role="textbox" aria-multiline="true" aria-label="Hebrew text editor" dir="rtl" lang="he" class="editor svelte-nmz6rb"${attr_style(`font-size: ${stringify(fontSize)}px`)}></div></div> `);
    Palette($$renderer2);
    $$renderer2.push(`<!----> `);
    if (paletteStore.chordMode) {
      $$renderer2.push("<!--[0-->");
      ChordOverlay($$renderer2);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function _page($$renderer) {
  head("1uha8ag", $$renderer, ($$renderer2) => {
    $$renderer2.title(($$renderer3) => {
      $$renderer3.push(`<title>Bocher Taam — Hebrew Nikud &amp; Te'amim Editor</title>`);
    });
  });
  $$renderer.push(`<main class="svelte-1uha8ag"><header class="svelte-1uha8ag"><h1 class="svelte-1uha8ag">בֹּחֵר טַעַם</h1> <p class="subtitle svelte-1uha8ag">Hebrew Nikud &amp; Te'amim Editor</p></header> <div class="app-body svelte-1uha8ag">`);
  Editor($$renderer);
  $$renderer.push(`<!----></div></main>`);
}
export {
  _page as default
};
