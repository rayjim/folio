# Folio

A personal note-taking app built to render AI-generated HTML and Markdown natively — without the limitations of OneNote or similar tools.

**Single file. No build step. No server required.**

Open `notes.html` directly in Chrome or Edge. All data is stored in your browser's `localStorage`. Optionally link a local folder for real-file persistence via the File System Access API.

---

## Features

| Feature | Details |
|---|---|
| **Notebooks** | Multiple notebooks, each with its own page tree |
| **Page tree** | Up to 4 levels deep (depth 0–3); drag to reorder and re-nest |
| **Indent / Unindent** | Drag pages to change nesting, or use right-click → Indent / Unindent |
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
| **File attachments** | Attach any file via 📎 button, drag-and-drop, or Ctrl+V paste; images paste inline |
| **Page deep-links** | 🔗 button copies a direct URL to any page; URL hash updates on navigation |
| **Live sync** | Same-browser tabs sync instantly via `StorageEvent`; cross-browser sync via 3 s file polling on linked folder |
| **Notebook archive** | × button opens Archive / Delete Permanently dialog — archived notebooks are hidden but fully recoverable |
| **Notebook reorder** | Right-click tab → Move Left / Move Right |
| **Export** | Per-page clean HTML download |
| **Auto-save** | 1.2 s debounce on edits; every structural change saves immediately; 5-minute safety-net flush |
| **Math rendering** | KaTeX — inline (`$...$`) and display (`$$...$$`) math; also `\(...\)` and `\[...\]` LaTeX delimiters |

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
- **Default Data Folder Path** — set the suggested path shown when first linking a folder

On startup the app automatically loads from the linked folder if one was previously chosen and permission is still granted.

> **Note**: The File System Access API requires Chrome or Edge on a server (`http://`) origin. Firefox does not support it.

---

## Live Sync

Folio keeps multiple open instances in sync automatically:

| Scenario | Mechanism |
|---|---|
| Multiple tabs / windows in the same browser | `localStorage StorageEvent` — updates within ~150 ms |
| Chrome + Edge open simultaneously on the same PC | File polling — checks the linked folder every 3 s for changes made by another browser |

Both browsers must link the **same folder** for cross-browser sync to work. A **"Synced ↓"** flash appears in the tab bar when an external change is loaded.

---

## File Attachments

Attach files to any page via:

- **📎 Attach** button in the toolbar — opens a file picker
- **Drag and drop** any file onto the editor area
- **Ctrl+V** paste — images embed inline in the content; other files appear in the attachment bar

Attached files are saved to the linked attachments/data folder. Without a linked folder, files under 2 MB are stored as base64 in `localStorage`.

---

## Page Deep-Links

Every page has a unique URL: `http://localhost:8080/notes.html#page=<pageId>`

- Click the **🔗** button next to the page title to copy the link
- Or right-click any page in the sidebar → **🔗 Copy Link**
- Paste the link into OneNote, a browser bookmark, or anywhere — clicking it opens Folio and jumps directly to that page

---

## Notebook Protection

Clicking **×** on a notebook tab (or right-click → Delete) opens a dialog with three options:

| Option | Effect |
|---|---|
| **Archive** | Hides the notebook from the tab bar; all pages remain intact and recoverable |
| **Delete Permanently** | Requires a second confirmation; removes all pages and attachments |
| **Cancel** | Does nothing |

Archived notebooks appear under the **🗄 Archived (N)** button in the tab bar. Click **Restore** to bring one back, or 🗑 to permanently delete it.

---

## Architecture

Everything lives in a single file: **`notes.html`**

| Section | Responsibility |
|---|---|
| `Utils` | Pure helpers: uuid, debounce, content-type detection, HTML escaping, date formatting |
| `Storage` | `localStorage` read/write |
| `FileStore` | File System Access API — directory handle persistence via IndexedDB |
| `AttachStore` | File attachment storage — folder write or localStorage base64 fallback |
| `FilePoller` | 3 s polling of linked folder to detect external changes (cross-browser sync) |
| `State` | In-memory app state; `flush()` writes to both localStorage and FileStore |
| `Notebooks` | CRUD + archive / restore / permanent-delete for notebook objects |
| `Pages` | CRUD + tree operations (move, indent, unindent, collapse, drag-and-drop) |
| `Editor` | Render, highlight, save, toolbar actions, view-mode toggle |
| `Search` | Text extraction (DOMParser), inline autocomplete, full-text search, in-page highlight on navigate |
| `Export` | Per-page clean HTML download |
| `Theme` / `FontSize` | UI preference application |
| `StorageUI` | Storage modal state |
| `ColorPicker` | Floating color palette |
| `AttachUI` | Attachment bar rendering, file embed/save logic |
| `UI` | Tab bar and sidebar rendering, drag-and-drop, archived panel |
| `CtxMenu` | Right-click context menu (pages) |
| `NbCtxMenu` | Right-click context menu (notebook tabs) |
| `NbDeleteDialog` | Archive / Delete Permanently confirmation modal |

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
{
  "id": "nb_...",
  "name": "Work",
  "order": 0,
  "archived": false,
  "archivedAt": null,
  "createdAt": "ISO8601"
}
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
  "attachments": [],
  "createdAt": "ISO8601",
  "modifiedAt": "ISO8601"
}
```

`parentId: null` = root page. Set to another page's `id` for a sub-page (max depth: 3, i.e. 4 levels).  
`contentType`: `"html"` | `"markdown"` | `"text"` — auto-detected on paste, manually overridable via the badge in the toolbar.

### Attachment (inside `page.attachments[]`)
```json
{
  "id": "att_...",
  "name": "report.pdf",
  "size": 204800,
  "type": "application/pdf",
  "addedAt": "ISO8601"
}
```

### localStorage keys

| Key | Contents |
|---|---|
| `folio_v1_nb` | JSON array of Notebook objects |
| `folio_v1_pg` | JSON array of Page objects |
| `folio_v1_st` | JSON object — active selections, theme, font size |
| `folio_v1_att_<id>` | Base64 file content for attachments without a linked folder |
| `folio_v1_default_path` | Default data folder path shown in storage settings |

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

From then on, Folio auto-saves your notes to that folder on every change.

---

## Dependencies (CDN)

| Library | Version | Purpose |
|---|---|---|
| [marked](https://marked.js.org) | 9.x | Markdown → HTML |
| [DOMPurify](https://github.com/cure53/DOMPurify) | 3.x | HTML sanitization (XSS prevention) |
| [highlight.js](https://highlightjs.org) | 11.x | Code syntax highlighting |
| [KaTeX](https://katex.org) | 0.16 | Math / equation rendering |
