#!/bin/bash
set -e

echo "============================================"
echo "  Обновление ATG.TJ"
echo "============================================"
echo ""

cd /root/ATG

echo "[1/4] Получение обновлений..."
git pull

echo "[2/4] Установка зависимостей..."
npm install

echo "[3/4] Сборка проекта..."
npm run build

echo "[4/4] Перезапуск приложения..."
npx drizzle-kit push --force
pm2 restart atg

echo ""
echo "Обновление завершено!"
echo ""
