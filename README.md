# Nequi iPhone PWA — Orbytek (Firebase)

PWA frontend (Expo / React Native Web) para iPhone. Los usuarios viven en **Firebase Firestore** (`orbyteciphone`) vía el backend iPhone en `:3004`.

## Firebase

| Recurso | Valor |
|---------|--------|
| Proyecto | `orbyteciphone` |
| Config app | `firebase/google-services.json` |
| Backend admin | fuera del repo (cuenta de servicio en servidor) |

La PWA no habla directo con Firestore: login/registro van al **API backend iPhone**, que escribe en Firebase.

## Build local

```bash
npm ci
npm run build:pwa
npm run serve:pwa
```

Salida en `dist/`:
- `/` — bienvenida / instalación
- `/app/` — aplicación Nequi
- `/ios-config.json` — URL del API backend (bootstrap remoto)

## Cloudflare Pages / Netlify

- **Build:** `npm ci && npm run build:pwa`
- **Publish:** `dist`

Edita `public/ios-config.json` para cambiar la URL del backend sin recompilar (también se copia a `dist/ios-config.json`).

## Backend API

Servidor aparte: `API_BACKEND_IOSNODECOMAND` (puerto 3004, Firestore `orbyteciphone`).

## Seguridad frontend

Protecciones en cliente: anti-inspección básica, rutas trampa 404, headers de seguridad, sin source maps en producción.

**No subas** claves `*-firebase-adminsdk*.json` al repo.
