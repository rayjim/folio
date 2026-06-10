# Changelog

All notable changes to Folio are documented here.  
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).  
Versions follow `vYYYY.MM.DD` (date of release).

---

## [v2026.06.10c] — 2026-06-10

### Fixed
- **Export dropdown always visible on load** — `.export-menu.hidden` had no `display:none` rule; menu was permanently shown.
- **Email export sent plain text** — now copies the full page HTML to clipboard and opens the mail app with the title as subject; user pastes (Ctrl+V) into the email body to get formatted HTML content.
- **PDF / folder dialogs appeared behind other windows** — switched to `BrowserWindow.getFocusedWindow()` so dialogs always attach to the correct window.

---

## [v2026.06.10b] — 2026-06-10

### Added
- **Export dropdown** — the `Export` toolbar button is now a dropdown with three options:
  - **Save as HTML** — downloads a clean standalone `.html` file (existing behaviour)
  - **Save as PDF** — Electron only: uses native `printToPDF()` to save a proper `.pdf` file via a save dialog; in the browser, shows a reminder to use Print → Save as PDF
  - **Send via Email** — opens the system mail app (or Outlook) with the page title as subject and plain-text body via `mailto:`; content over ~1800 chars is truncated with a note

---

## [v2026.06.10] — 2026-06-10

### Fixed
- **In-page anchor navigation in rendered HTML** — clicking `<a href="#section">` links, table-of-contents buttons, and any hash-based navigation inside a rendered full HTML page now smoothly scrolls to the target section. Previously, the iframe sandbox blocked `window.location.hash` changes so all hash links were silently ignored.

---

## [v2026.06.09b] — 2026-06-09

### Added
- **Folder conflict detection** — when multiple Electron windows share the same data folder and one saves, the other detects the conflict and shows a dialog: "Load Latest" (reload from disk) or "Keep Mine" (overwrite with current state). Triggers both on save and on the 3-second file poller.
- **Persistent folder path** — the linked data folder path is now stored in `folio-paths.json` inside the app's userData directory, not just localStorage. Survives reinstalls and localStorage clears; auto-loads the folder on every startup without any manual re-linking.

### Fixed
- `publish: never` in `electron-builder.yml` causing macOS CI to fail with MODULE_NOT_FOUND.

---

## [v2026.06.09] — 2026-06-09

### Added
- **macOS CI build** — pushing to `master` or any `feature/*` branch now also builds a macOS `.zip` (unsigned) via GitHub Actions. Download from the Actions → Artifacts tab. Requires Electron 33 + electron-builder 26.

### Fixed
- **In-app dialog system** — all native `prompt()` / `confirm()` / `alert()` calls (Add Notebook, rename, delete, etc.) are replaced with a custom modal dialog. Electron with `contextIsolation: true` silently blocks native browser dialogs; the custom Dialog object restores all interactive flows without requiring any Electron API changes.

---

## [v2026.06.07] — 2026-06-07

### Added
- **Ctrl+scroll zoom** — in rendered (HTML/Markdown) view, hold Ctrl and scroll to zoom in or out, just like a browser. `Ctrl+0` resets to 100%. A brief percentage indicator appears while adjusting.
- **Windows installer via GitHub Actions** — pushing to `master` or any `feature/*` branch now builds a proper Windows setup `.exe` using Inno Setup (replaces the previous portable zip). Download from the Actions → Artifacts tab.

### Fixed
- **Folder link now auto-loads existing data** — clicking "Change…" to link a data folder immediately reads any existing notes from that folder and shows them in the sidebar, instead of overwriting the folder with current state first.

### Removed
- **Default Data Folder Path** setting — removed from the Storage panel; it was machine-specific and only used by the old `folio-start.ps1` launcher.

---

## [v2026.06.06] — 2026-06-06

### Added
- **Electron desktop app** — Folio can now run as an installable native desktop app on Windows and macOS via Electron. Run `npm start` to launch in dev mode; use `npm run dist` to build a distributable installer. The app routes file I/O through native `fs` instead of the File System Access API — no browser needed, no flags, no server. Browser mode (plain `file://` or HTTP server) is fully preserved. Data files (`notebooks.json`, `pages.json`, `state.json`) are unchanged — zero migration needed.
- **Web Clip bookmarklet** — save any webpage to Folio in one click. Click **📌 Clip** in the toolbar to get the bookmarklet; drag it to the browser bookmarks bar. On any page, click it to copy the full HTML to the clipboard, then Ctrl+V in Folio to create a new page. Page title is extracted from the `<title>` tag automatically.
- **GitHub Actions Windows build** — pushing to `master` or any `feature/*` branch triggers a Windows installer build (NSIS `.exe`) on GitHub Actions; download the artifact from the Actions tab.

---

## [v2026.06.04] — 2026-06-04

### Added
- **Print button** — `🖨 Print` in the toolbar opens a clean popup containing only the rendered page content (no sidebar, tabs, or toolbar) and triggers the browser print dialog. Works for both physical printers and Save as PDF.

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
