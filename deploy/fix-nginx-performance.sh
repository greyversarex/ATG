#!/bin/bash
set -e

# Скрипт быстрой оптимизации Nginx на продакшене
# Запускать: bash /root/ATG/deploy/fix-nginx-performance.sh

DOMAIN=${1:-""}
APP_DIR="/root/ATG"

echo "============================================"
echo "  Оптимизация Nginx + PM2"
echo "============================================"

# Определяем server_name
if [ -z "$DOMAIN" ]; then
    SERVER_NAME="_"
    echo "Домен не указан, используется wildcard. Для домена запусти:"
    echo "  bash fix-nginx-performance.sh atg.tj"
else
    SERVER_NAME="$DOMAIN www.$DOMAIN"
    echo "Домен: $SERVER_NAME"
fi

echo ""
echo "[1/3] Обновление конфигурации Nginx..."

cat > /etc/nginx/sites-available/atg << NGINX
# Gzip сжатие
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;
gzip_types
    text/plain
    text/css
    text/javascript
    application/javascript
    application/json
    application/x-javascript
    text/xml
    application/xml
    application/xml+rss
    image/svg+xml
    font/woff
    font/woff2
    application/font-woff
    application/font-woff2;

server {
    listen 80;
    server_name $SERVER_NAME;

    client_max_body_size 20M;

    # === ПРЯМАЯ ОТДАЧА СТАТИКИ (без Node.js) ===

    # Загруженные картинки через админку
    location /uploads/ {
        alias $APP_DIR/uploads/;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Access-Control-Allow-Origin "*";
        access_log off;
    }

    # Хэшированные JS/CSS бандлы
    location /assets/ {
        alias $APP_DIR/dist/public/assets/;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # Статичные картинки (из public/)
    location /images/ {
        alias $APP_DIR/dist/public/images/;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # === ВСЁ ОСТАЛЬНОЕ → Node.js ===
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
NGINX

echo "[2/3] Проверка и перезапуск Nginx..."
nginx -t && systemctl reload nginx
echo "Nginx обновлён ✓"

echo "[3/3] Перезапуск PM2 в cluster mode..."
cd $APP_DIR
pm2 stop atg 2>/dev/null || true
pm2 delete atg 2>/dev/null || true
pm2 start dist/index.cjs --name atg -i max --env production
pm2 save
echo "PM2 запущен в cluster mode ✓"

echo ""
echo "============================================"
echo "  Готово! Что изменилось:"
echo "  ✓ Картинки теперь отдаются Nginx напрямую"
echo "  ✓ Gzip сжатие включено"
echo "  ✓ PM2 использует все ядра CPU"
echo "============================================"
pm2 list
