# CV Download API - Cloudflare Worker

Ez a Cloudflare Worker automatikusan megtalálja és kiszolgálja a legfrissebb CV PDF-et nyelvenként az R2 bucket-ból.

## Telepítés

### 1. Wrangler CLI telepítése
```bash
npm install -g wrangler
```

### 2. Bejelentkezés Cloudflare-be
```bash
wrangler login
```

### 3. Worker telepítése
```bash
cd cloudflare-worker
wrangler deploy
```

A deploy után kapni fogsz egy URL-t, pl:
`https://cv-api.YOUR-SUBDOMAIN.workers.dev`

### 4. Site konfiguráció frissítése

Szerkeszd a `_data/cv_data.yml` fájlt és add meg a worker URL-t:

```yaml
downloads:
  worker_url: 'https://cv-api.YOUR-SUBDOMAIN.workers.dev'
```

## API Endpoints

| Endpoint | Leírás |
|----------|--------|
| `GET /latest/en` | Átirányít a legfrissebb angol CV-re |
| `GET /latest/hu` | Átirányít a legfrissebb magyar CV-re |
| `GET /latest/de` | Átirányít a legfrissebb német CV-re |
| `GET /manifest.json` | Visszaadja a legfrissebb fájlneveket JSON-ban |

## Működés

1. A Worker lapozva listázza az R2 bucket `cv_public_` prefixű kulcsait (egy hívás max. 1000 kulcsot ad vissza)
2. Megkeresi a `cv_public_{lang}_default_{date}_{time}.pdf` mintájú fájlokat
3. Kiválasztja a legfrissebbet (timestamp alapján) nyelvenként
4. Átirányítja a felhasználót a megfelelő fájlra (ismeretlen nyelvnél az angolra)

Csak `GET`, `HEAD` és `OPTIONS` engedélyezett, minden más `405`. Belső hiba esetén
generikus `500` megy ki, a részlet csak a `wrangler tail` logban látszik.

## Konfiguráció

| Változó (`wrangler.toml` → `[vars]`) | Mire |
|---|---|
| `PUBLIC_BASE_URL` | Erre a bázis URL-re irányít a `/latest/:lang` (perjel nélkül). Alapértelmezés a bucket `r2.dev` URL-je |

## Tesztek

```bash
cd cloudflare-worker
npm test   # node:test, Node 22+, nincs npm-függőség
```

A tesztek egy hamis R2 bindinggel futnak, a CI `worker` jobja is ezt hívja.

## R2 Bucket Binding

A `wrangler.toml` már konfigurálva van a `porkolab-cv` bucket használatára.
Ha más bucket nevet használsz, módosítsd a `wrangler.toml`-t:

```toml
[[r2_buckets]]
binding = "CV_BUCKET"
bucket_name = "your-bucket-name"
```
