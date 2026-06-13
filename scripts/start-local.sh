#!/usr/bin/env bash
set -euo pipefail

BACKEND="/home/axondevui/Documentos/BACKEND NEQUI IOS"
PWA="/home/axondevui/Documentos/APK IPHONE AXONLABSORG"

echo "🐘 Iniciando PostgreSQL..."
bash "$BACKEND/scripts/start-postgres.sh"

echo "🔧 Iniciando backend Nequi iOS (puerto 3000)..."
fuser -k 3000/tcp 2>/dev/null || true
cd "$BACKEND" && node dist/index.js &
BACKEND_PID=$!

echo "📱 Iniciando PWA (puerto 8080)..."
fuser -k 8080/tcp 2>/dev/null || true
cd "$PWA" && npx serve dist -p 8080 --cors &
PWA_PID=$!

sleep 2
echo ""
echo "✅ Todo listo:"
echo "   Bienvenida PWA → http://127.0.0.1:8080"
echo "   App Nequi      → http://127.0.0.1:8080/app/"
echo "   Backend API    → http://127.0.0.1:3000"
echo ""
echo "PIDs: backend=$BACKEND_PID  pwa=$PWA_PID"
wait
