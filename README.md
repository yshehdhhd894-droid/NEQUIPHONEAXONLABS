# Nequi iPhone PWA — AxonLabsOrg

PWA frontend (Expo / React Native Web) para Nequi Colombia.

## Build local

```bash
npm ci
npm run build:pwa
npm run serve:pwa
```

Salida en `dist/`:
- `/` — página de bienvenida / instalación
- `/app/` — aplicación Nequi

## Netlify

El repo incluye `netlify.toml`:
- **Build command:** `npm ci && npm run build:pwa`
- **Publish directory:** `dist`

Conecta el repo en Netlify y despliega. El backend API vive en servidor aparte (no en este repo).

## Seguridad frontend

Protecciones solo en cliente (HTML/JS): anti-inspección básica, rutas trampa 404, headers de seguridad, sin source maps en producción.
