# Nequi iPhone PWA — Orbytek

PWA iPhone. Usuarios en **Firestore** (`orbyteciphone`) vía backend `:3004` — la PWA no expone Firebase en claro.

## Firebase (backend)

Firestore lo maneja el **API backend iPhone**, no el navegador. La PWA solo llama al API.

## Ofuscación (F12)

- URL del backend en blob XOR (`/assets/fonts/metrics.cache`)
- Sin `ios-config.json` ni `firebaseProjectId` en público
- `hardening.js`: bloqueo básico de DevTools en producción
- Regenerar bootstrap: `node scripts/encode-bootstrap.mjs`

## Build

```bash
npm ci
npm run build:pwa
npm run serve:pwa
```

## Cloudflare Pages

- **Build:** `npm ci && npm run build:pwa`
- **Publish:** `dist`

Cambiar backend: `IOS_API_URL=https://tu-api npm run build:pwa`

## Backend

`API_BACKEND_IOSNODECOMAND` — puerto 3004, Firestore `orbyteciphone`.

**No subas** `*-firebase-adminsdk*.json` al repo frontend.
