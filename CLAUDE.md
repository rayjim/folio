# Folio — Project Rules for Claude

## Feature Development Workflow

For every new feature request, follow this process in order:

### 1. Create a feature branch
Branch off `master` before writing any code:
```
git checkout master && git pull
git checkout -b feature/<short-kebab-name>
```

### 2. Implement on the branch
All code changes go on the feature branch. Do not touch `master` directly.

### 3. Wait for user review and approval
When implementation is complete, summarize what changed and ask the user to review. Do not merge until the user explicitly says it looks good / approves.

### 4. Merge to master
Once approved:
```
git checkout master
git merge --no-ff feature/<short-kebab-name>
git branch -d feature/<short-kebab-name>
```

### 5. Update documentation, then commit on master
After merging:
- Update `CHANGELOG.md` — move changes to a new dated version block (format: `[vYYYY.MM.DD]`) or append to `[Unreleased]` if not yet releasing
- Update `README.md` features table and any relevant sections
- Update the "What's New" section in the Folio welcome page inside `notes.html`
- Create a single commit on `master` that bundles the merge + all doc updates

---

## General Rules

- All app code lives in the single file `notes.html`. No build step, no separate JS/CSS files.
- Prefer editing existing code over adding new abstractions.
- Do not push to the remote (`git@github.com:rayjim/folio.git`) unless the user explicitly asks.
- Never force-push to `master`.
