# aporkolab.com — CV site

Háromnyelvű (EN / HU / DE) önéletrajz-oldal, Jekyll-lel buildelve, GitHub Pages-en
kiszolgálva az `aporkolab.com` domainen.

## Stack

| Komponens | Verzió |
|---|---|
| Ruby | 3.4 (CI) |
| Bundler | 4.0 (`Gemfile.lock` → `BUNDLED WITH`) |
| Jekyll | 4.4 |
| jekyll-feed | 0.18 |
| Node.js (csak a worker tesztjeihez) | ≥ 22 |

## Szerkezet

| Útvonal | Mi ez |
|---|---|
| `_layouts/default.html` | Az egész oldal: inline CSS/JS, nincs téma |
| `index.md`, `hu.md`, `de.md` | Nyelvi oldalak (csak front matter) |
| `_data/cv_data.yml` | CV-tartalom. **A külső CV-generátor hetente felülírja**, kézzel ne szerkeszd |
| `_data/cv_short.yml` | A rövid, 2 oldalas PDF-ek linkjei |
| `assets/data/github-stats.json` | A `update-github-stats.yml` workflow írja naponta |
| `sw.js` | Service worker (layout-változásnál `CACHE_NAME` bump!) |
| `cloudflare-worker/` | Opcionális R2 → legfrissebb PDF redirect API, lásd a saját [README](cloudflare-worker/README.md)-jét |
| `.github/scripts/` | A build-ellenőrzések, amiket a CI és a deploy workflow is futtat |

## Lokális futtatás

```bash
bundle install
bundle exec jekyll serve        # http://localhost:4000
```

Production build, pontosan úgy, ahogy a CI csinálja:

```bash
ruby .github/scripts/validate-data-yaml.rb _data/*.yml
JEKYLL_ENV=production bundle exec jekyll build --destination ./_site
.github/scripts/check-localized-leaks.sh _site
```

A worker tesztjei (függőség nélkül, `node:test`):

```bash
cd cloudflare-worker && npm test
```

## CI / deploy

| Workflow | Mikor fut | Mit csinál |
|---|---|---|
| `ci.yml` | PR-ok és nem-`main` branch push | YAML-validálás, Jekyll build, lokalizált mezők szivárgás-ellenőrzése, worker tesztek. Nem deployol |
| `jekyll-gh-pages.yml` | push a `main`-re, kézi indítás | Ugyanaz a build, majd deploy GitHub Pages-re |
| `update-github-stats.yml` | push a `main`-re, naponta 06:00 UTC | GitHub-statisztikák frissítése, commit, majd Pages deploy indítása. API-hiba esetén nem ír felül semmit |

### Secretek (érték nélkül)

| Név | Hol | Mire |
|---|---|---|
| `GH_STATS_TOKEN` | repo secret | GitHub GraphQL/REST olvasás a statisztikákhoz (privát repószám is) |

A függőségeket a Dependabot havonta frissíti (`.github/dependabot.yml`: GitHub Actions + Bundler).
