#!/bin/bash
set -e

cd /root/ATG

echo "==> git pull"
git pull origin main

echo "==> npm install"
npm install

echo "==> db:push"
./node_modules/.bin/drizzle-kit push --force

echo "==> npm run build"
npm run build

echo "==> pm2 restart"
pm2 restart atg

echo "==> Done"
