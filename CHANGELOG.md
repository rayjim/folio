# Changelog

All notable changes to Folio are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
Versions follow `vYYYY.MM.DD` (date of release).

---

## [Unreleased]

### Added
- **Math / equation rendering** — KaTeX support for inline (`$...$`) and display (`$$...$$`) math. Also supports `\(...\)` and `\[...\]` LaTeX delimiters. Markdown mode pre-processes math blocks before marked.js to prevent underscore/caret mangling.

---

## [v2026.05.27] — 2026-05-27

### Added
- **Notebook archive/restore** — clicking × on a tab now opens a dialog with three options: Archive (hides but keeps all data), Delete Permanently (double-confirmed), or Cancel. Archived notebooks are recoverable via the 🗄 Archived panel in the tab bar.
- **File attachments** — attach any file via the 📎 Attach button, drag-and-drop onto the editor, or Ctrl+V paste. Images paste inline; other files appear in an attachment bar below the editor. Files saved to the linked folder or localStorage (≤2 MB fallback).
- **Page deep-links** — 🔗 button next to the page title copies a direct URL (`#page=<id>`) to the clipboard. URL hash updates on every page navigation; opening the link jumps straight to that page. Also available via right-click → Copy Link.
- **Live sync** — multiple open instances stay in sync automatically: same-browser tabs via `StorageEvent` (~150 ms), different browsers (Chrome + Edge) via 3-second file polling on the linked folder. Shows "Synced ↓" indicator on update.
- **Notebook context menu** — right-click any notebook tab for Move Left, Move Right, Rename, Delete.
- **Auto-save indicator** — "Saved ✓" flashes in the tab bar after every save; "Synced ↓" flashes on incoming sync.
- **Default data folder path setting** — configurable in the 📁 storage panel, stored in localStorage.

### Fixed
- Notebook tab reorder (Move Left / Move Right) now works correctly — `renderTabs()` was ignoring the `.order` field.
- Notebook drag-and-drop uses nearest-tab detection so releasing between tabs no longer silently fails.

### Changed
- Auto-save interval reduced from 30 s to **5-minute safety net** — all real changes already save immediately via `State.flush()`.

---

## [v2026.05.24] — 2026-05-24

### Added
- **Multi-level page tree** — pages can be nested up to 4 levels deep (depth 0–3). Drag pages to reorder and re-nest with a 3-zone drop target (above / into / below).
- **Indent / Unindent** — right-click any page → Indent → or ← Unindent to change nesting level without dragging.
- **Notebook tab drag-and-drop** — drag tabs left/right to reorder notebooks.
- **Windows startup script** (`folio-start.ps1`) — launches a hidden Python HTTP server and opens Folio in the browser. Registers via Task Scheduler for auto-start on login.
- **Folder auto-save** — saves to the linked folder automatically on every change (immediate) plus a periodic safety-net flush.

### Fixed
- Folder picker silently aborting on `file://` origins — now handled gracefully.
- Write permission now requested at pick time (inside user-gesture context) so background saves succeed.
- Drop indicator element surviving `renderSidebar()` re-renders by moving it outside `#page-tree`.

### Changed
- App renamed from **Notes** to **Folio**.

---

## [v2026.05.24-initial] — 2026-05-24

### Added
- Initial release — single `notes.html` file, no build step, no server required.
- Multiple notebooks with per-notebook page trees.
- Full HTML and Markdown rendering (marked.js, DOMPurify, highlight.js).
- Auto-detect content type on paste.
- Inline search with autocomplete and in-page highlight.
- Rich toolbar: Bold, Italic, H1–H3, font color, font size.
- Light / dark theme toggle.
- Folder sync via File System Access API.
- Per-page HTML export.
- Auto-save with 1.2 s debounce + save on page switch and browser unload.
