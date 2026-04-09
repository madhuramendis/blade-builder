# Blade Builder — PMM Edition

A Next.js static site for Product Marketing Managers to compose, preview, and export website pages using predefined blade layouts.

## Local development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

## Deploy to GitHub Pages

### Step 1 — Set your repo name in next.config.ts

Uncomment and update the `basePath` line:

```ts
basePath: "/your-repo-name",
```

Replace `your-repo-name` with your actual GitHub repository name (e.g. `blade-builder`).

### Step 2 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow in `.github/workflows/deploy.yml` will run automatically on every push to `main`

Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO/`

## Adding new blade types

1. Add a definition to `app/lib/bladeDefinitions.ts` in `BLADE_DEFS`
2. Add a render function + `case` in `app/components/blades/BladePreview.tsx`
3. Add CSS styles in `app/globals.css`

## File structure

```
app/
  lib/
    bladeDefinitions.ts   # All blade type configs + TypeScript types
    usePageBuilder.ts     # React hook — all page state
  components/
    PageBuilder.tsx       # Main app shell
    blades/
      BladePreview.tsx    # Visual renders for each blade type
    panels/
      LibraryPanel.tsx    # Left panel: blade library
      StructurePanel.tsx  # Left panel: page structure / reorder
      EditPanel.tsx       # Left panel: field editor
    ui/
      Toast.tsx           # Toast notifications
  globals.css             # All styles (UI + blade previews)
  layout.tsx
  page.tsx
.github/workflows/
  deploy.yml              # GitHub Actions → GitHub Pages
next.config.ts            # Static export config
```
