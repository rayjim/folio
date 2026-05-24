# Folio

A personal note-taking app built to render AI-generated HTML and Markdown natively — without the limitations of OneNote or similar tools.

**Single file. No build step. No server required.**

Open `notes.html` directly in Chrome or Edge. All data is stored in your browser's `localStorage`. Optionally link a local folder for real-file persistence via the File System Access API.

---

## Features

| Feature | Details |
|---|---|
| **Notebooks** | Multiple notebooks, each with its own page tree |
| **Page tree** | 2-level hierarchy (root pages + sub-pages) |
| **HTML rendering** | Full `<!DOCTYPE html>` docs rendered in sandboxed iframes; HTML fragments rendered with DOMPurify |
| **Markdown rendering** | GitHub-flavored Markdown via marked.js; syntax highlighting via highlight.js |
| **Auto-detect** | Content type (HTML vs Markdown) detected automatically on paste |
| **Inline search autocomplete** | As you type, the search bar completes the best matching title or word |
| **Search with highlights** | Matches highlighted in-page on navigation; auto-scrolls to first hit |
| **Full-text search** | DOMParser-based extraction searches inside full HTML documents too |
| **Rich toolbar** | Bold, italic, H1–H3, font color (preset palette + custom picker) |
| **Font size selector** | Small / Normal / Large / XL |
| **Light / dark theme** | Toggle with the 🌙 button; persists across sessions |
| **Folder sync** | Link a local folder via the File System Access API — writes `notebooks.json`, `pages.json`, `state.json` |
| **Export** | Per-page clean HTML download |
| **Auto-save** | 1.2 s debounce; also saves on page switch and browser unload |

---

## Getting Started

### Option A — Direct file (simplest)

```
open notes.html
```

Data is stored in `localStorage`. Works offline with no setup.

### Option B — Local dev server (recommended for development)

```bash
python3 -m http.server 8080
# then open http://localhost:8080/notes.html
```

A local server is required for the File System Access API (folder sync) to work in Chrome; `file://` access works for everything else.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+N` | New page in current notebook |
| `Ctrl+Shift+N` | New sub-page under active page |
| `Ctrl+/` | Toggle rendered ↔ source view |
| `Ctrl+F` | Focus search bar |
| `↑` / `↓` in search | Navigate results |
| `Enter` in search | Open selected result |
| `Tab` / `→` in search | Accept inline autocomplete completion |
| `Esc` | Close search / menus |

---

## File System Storage (Chrome / Edge only)

Click the 📁 button in the top-right to open the storage panel.

- **Change…** — pick a folder to sync notes data. The app writes three files:  
  `notebooks.json`, `pages.json`, `state.json`
- **Set Separate…** — optionally store attachments in a different folder
- **Save to Folder** — manually flush to the linked folder
- **Load from Folder** — reload from the folder (useful after editing files externally)
- **Export All (JSON)** — downloads a single JSON backup regardless of folder link

On startup the app automatically loads from the linked folder if one was previously chosen and permission is still granted.

> **Note**: The File System Access API requires Chrome or Edge on a server (`http://`) origin. Firefox does not support it.

---

## Architecture

Everything lives in a single file: **`notes.html`**

| Section | Responsibility |
|---|---|
| `Utils` | Pure helpers: uuid, debounce, content-type detection, HTML escaping, date formatting |
| `Storage` | `localStorage` read/write |
| `FileStore` | File System Access API — directory handle persistence via IndexedDB |
| `State` | In-memory app state; `flush()` writes to both localStorage and FileStore |
| `Notebooks` | CRUD for notebook objects |
| `Pages` | CRUD + tree operations (move, collapse, children) |
| `Editor` | Render, highlight, save, toolbar actions, view-mode toggle |
| `Search` | Text extraction (DOMParser), inline autocomplete, full-text search, in-page highlight on navigate |
| `Export` | Per-page clean HTML download |
| `Theme` / `FontSize` | UI preference application |
| `StorageUI` | Storage modal state |
| `ColorPicker` | Floating color palette |
| `UI` | Tab bar and sidebar rendering |
| `CtxMenu` | Right-click context menu |

---

## Testing

Open `tests.html` in Chrome or Edge (via the dev server or directly):

```bash
python3 -m http.server 8080
# open http://localhost:8080/tests.html
```

The test suite covers:

- `Utils.isFullDoc` — HTML document detection
- `Utils.detectContentType` — HTML vs Markdown classification
- `Utils.escapeHtml` — XSS-safe escaping
- `Utils.formatDate` — relative date formatting
- `Utils.uuid` — ID uniqueness
- `Search.extractText` — HTML fragment, full-document, and Markdown text extraction
- `Search.getBestCompletion` — autocomplete priority and fallback logic

Tests are written in vanilla JS with no external test framework dependency.

---

## Data Model

### Notebook
```json
{ "id": "nb_...", "name": "Work", "order": 0, "createdAt": "ISO8601" }
```

### Page
```json
{
  "id": "pg_...",
  "notebookId": "nb_...",
  "parentId": null,
  "title": "Meeting Notes",
  "content": "<h1>...</h1>",
  "contentType": "html",
  "order": 0,
  "collapsed": false,
  "createdAt": "ISO8601",
  "modifiedAt": "ISO8601"
}
```

`parentId: null` = root page. Set to another page's `id` for a sub-page (max depth: 2).  
`contentType`: `"html"` | `"markdown"` | `"text"` — auto-detected on paste, manually overridable via the badge in the toolbar.

### localStorage keys

| Key | Contents |
|---|---|
| `folio_v1_nb` | JSON array of Notebook objects |
| `folio_v1_pg` | JSON array of Page objects |
| `folio_v1_st` | JSON object — active selections, theme, font size |

---

## Running at Windows Startup

### Option A — Direct file (localStorage only, no setup)

Best if you don't need folder sync.

1. Press `Win + R`, type `shell:startup`, press Enter
2. Right-drag `notes.html` into that folder → **Create shortcut here**

Folio will open in your browser on every login. All data persists in `localStorage`.

---

### Option B — Local server at startup (folder sync enabled)

Best if you want notes written to real files on disk.

> Requires Python (`python --version` to check it's installed).

Two separate locations are involved:

| What | Where |
|---|---|
| **App files** (`notes.html`, script) | Anywhere — e.g. `Documents\folio` |
| **Data files** (`notebooks.json`, `pages.json`) | Wherever you link inside the app — recommended: `Documents\folio-data` |

**Step 1** — Clone the repo to a Windows folder (not WSL)

```powershell
git clone https://github.com/rayjim/folio.git "$env:USERPROFILE\Documents\folio"
```

**Step 2** — Register in Task Scheduler

1. Open **Task Scheduler** → **Create Basic Task…**
2. **Name:** `Folio`
3. **Trigger:** At log on
4. **Action:** Start a program
   - Program: `powershell.exe`
   - Arguments: `-WindowStyle Hidden -ExecutionPolicy Bypass -File "%USERPROFILE%\Documents\folio\folio-start.ps1"`
5. Check **Run with highest privileges** → Finish

**Step 3** — Link your data folder (first launch only)

1. Click the 📁 button in the top-right
2. Click **Change…** and pick `Documents\folio-data` (create it first if needed)
3. Click **Save to Folder** once to write the initial files

From then on, Folio auto-saves your notes to that folder every 60 seconds.

---

## Dependencies (CDN)

| Library | Version | Purpose |
|---|---|---|
| [marked](https://marked.js.org) | 9.x | Markdown → HTML |
| [DOMPurify](https://github.com/cure53/DOMPurify) | 3.x | HTML sanitization (XSS prevention) |
| [highlight.js](https://highlightjs.org) | 11.x | Code syntax highlighting |
