#!/bin/bash
set -e

# Сборка происходит на Replit (где достаточно RAM).
# Собранный dist/ коммитится в репозиторий вместе с кодом.
# Сервер только тянет готовое и перезапускает приложение.

cd /root/ATG

echo "==> git pull"
git pull origin main

echo "==> npm install"
npm install --include=dev

echo "==> db:push"
./node_modules/.bin/drizzle-kit push --force

echo "==> pm2 restart"
pm2 restart atg

echo "==> Done"
