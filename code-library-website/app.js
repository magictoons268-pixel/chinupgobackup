const grid = document.querySelector("#program-grid");
const searchInput = document.querySelector("#search-input");
const categoryFilter = document.querySelector("#category-filter");
const categoryChips = document.querySelector("#category-chips");
const resultCount = document.querySelector("#result-count");
const programCount = document.querySelector("#program-count");
const emptyState = document.querySelector("#empty-state");
const dialog = document.querySelector("#code-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogFilename = document.querySelector("#dialog-filename");
const dialogCategory = document.querySelector("#dialog-category");
const dialogLines = document.querySelector("#dialog-lines");
const dialogCode = document.querySelector("#dialog-code");
const dialogCopy = document.querySelector("#dialog-copy");
const toast = document.querySelector("#toast");

let programs = [];
let activeCategory = "all";
let activeProgram = null;
let toastTimer = null;

const escapeHTML = (value) => value.replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));

function highlightPython(source) {
  // Tokenizes only for display. Original source is retained untouched in the data.
  const pattern = /(#.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|\b(def|class|return|if|elif|else|for|while|in|is|not|and|or|True|False|None|break|continue|pass|import|from|as|with|try|except|finally|raise|lambda|yield|global|nonlocal|assert|del)\b|\b(print|len|range|sum|min|max|sorted|enumerate|input|set|list|dict|int|str|float|bool|super|isinstance)\b|\b\d+(?:\.\d+)?\b/gm;
  let out = "";
  let last = 0;
  for (const match of source.matchAll(pattern)) {
    const token = match[0];
    const index = match.index;
    out += escapeHTML(source.slice(last, index));
    let cls = "token-number";
    if (match[1]) cls = "token-comment";
    else if (match[2]) cls = "token-string";
    else if (match[3]) cls = "token-keyword";
    else if (match[4]) cls = "token-builtin";
    out += `<span class="${cls}">${escapeHTML(token)}</span>`;
    last = index + token.length;
  }
  return out + escapeHTML(source.slice(last));
}

async function loadPrograms() {
  try {
    const response = await fetch("programs.json");
    if (!response.ok) throw new Error("Could not load programs.json");
    const metadata = await response.json();
    programs = await Promise.all(metadata.map(async (item, index) => {
      const fileResponse = await fetch(`programs/${encodeURIComponent(item.filename)}`);
      if (!fileResponse.ok) throw new Error(`Could not load ${item.filename}`);
      return { ...item, code: await fileResponse.text(), id: index + 1 };
    }));
    programCount.textContent = String(programs.length).padStart(2, "0");
    document.querySelector(".stat:nth-child(3) strong").textContent = String(new Set(programs.map(p => p.category)).size).padStart(2, "0");
    buildFilters();
    render();
  } catch (error) {
    grid.innerHTML = `<div class="loading-state">Unable to load the library. Run this site through a local server, then refresh.<br><small>${escapeHTML(error.message)}</small></div>`;
  }
}

function buildFilters() {
  const categories = [...new Set(programs.map(program => program.category))].sort();
  categoryFilter.innerHTML = '<option value="all">All topics</option>' +
    categories.map(category => `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`).join("");
  categoryChips.innerHTML = `<button class="filter-chip selected" data-category="all" type="button">All programs <span>${programs.length}</span></button>` +
    categories.map(category => {
      const count = programs.filter(program => program.category === category).length;
      return `<button class="filter-chip" data-category="${escapeHTML(category)}" type="button">${escapeHTML(category)} <span>${count}</span></button>`;
    }).join("");
  categoryChips.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", () => setCategory(button.dataset.category));
  });
}

function filteredPrograms() {
  const query = searchInput.value.trim().toLowerCase();
  return programs.filter(program => {
    const matchesCategory = activeCategory === "all" || program.category === activeCategory;
    const haystack = `${program.title} ${program.filename} ${program.description} ${program.category} ${program.language}`.toLowerCase();
    return matchesCategory && haystack.includes(query);
  });
}

function render() {
  const matches = filteredPrograms();
  resultCount.textContent = String(matches.length).padStart(2, "0");
  grid.hidden = matches.length === 0;
  emptyState.hidden = matches.length !== 0;
  grid.innerHTML = matches.map(program => `
    <article class="program-card" data-id="${program.id}">
      <div class="card-main">
        <div class="card-topline">
          <span class="file-type"><span class="file-icon">PY</span> PYTHON FILE</span>
          <span class="category-label">${escapeHTML(program.category.toUpperCase())}</span>
        </div>
        <h3 class="card-title">${escapeHTML(program.title)}</h3>
        <p class="card-description">${escapeHTML(program.description)}</p>
        <div class="code-preview" aria-label="Code preview for ${escapeHTML(program.filename)}"><pre><code>${highlightPython(program.code.split("\n").slice(0, 7).join("\n"))}</code></pre></div>
      </div>
      <div class="card-footer">
        <span class="filename" title="${escapeHTML(program.filename)}">${escapeHTML(program.filename)}</span>
        <div class="card-actions">
          <button class="icon-button" type="button" data-action="copy" data-id="${program.id}" aria-label="Copy ${escapeHTML(program.filename)} code" title="Copy code">▣</button>
          <button class="view-button" type="button" data-action="view" data-id="${program.id}">View code ↗</button>
        </div>
      </div>
    </article>`).join("");
  grid.querySelectorAll("button[data-action]").forEach(button => {
    button.addEventListener("click", async event => {
      const program = programs.find(item => item.id === Number(event.currentTarget.dataset.id));
      if (!program) return;
      if (event.currentTarget.dataset.action === "copy") await copyCode(program);
      else openViewer(program);
    });
  });
}

function setCategory(category) {
  activeCategory = category;
  categoryFilter.value = category;
  categoryChips.querySelectorAll("button").forEach(button => {
    const selected = button.dataset.category === category;
    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  render();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2200);
}

async function copyCode(program) {
  try {
    await navigator.clipboard.writeText(program.code);
    showToast(`Copied ${program.filename}`);
  } catch {
    const area = document.createElement("textarea");
    area.value = program.code;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const success = document.execCommand("copy");
    area.remove();
    showToast(success ? `Copied ${program.filename}` : "Copy failed — select the source and copy manually");
  }
}

function openViewer(program) {
  activeProgram = program;
  dialogTitle.textContent = program.title;
  dialogFilename.textContent = program.filename;
  dialogCategory.textContent = program.category.toUpperCase();
  dialogLines.textContent = `${program.code.split("\n").length} lines`;
  dialogCode.innerHTML = highlightPython(program.code);
  dialog.showModal();
  dialog.querySelector(".full-code-wrap").scrollTop = 0;
}

searchInput.addEventListener("input", render);
categoryFilter.addEventListener("change", event => setCategory(event.target.value));
document.querySelector("#clear-filters").addEventListener("click", () => {
  searchInput.value = "";
  setCategory("all");
  searchInput.focus();
});
document.querySelector("#dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});
dialogCopy.addEventListener("click", () => {
  if (activeProgram) copyCode(activeProgram);
});
document.addEventListener("keydown", event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    searchInput.focus();
  }
});

loadPrograms();
