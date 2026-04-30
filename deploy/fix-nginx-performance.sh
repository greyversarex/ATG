#!/bin/bash
set -e

# Скрипт быстрой оптимизации Nginx для продакшена с SSL
# Запускать: bash /root/ATG/deploy/fix-nginx-performance.sh atg.tj

DOMAIN=${1:-"atg.tj"}
APP_DIR="/root/ATG"

echo "============================================"
echo "  Оптимизация Nginx (домен: $DOMAIN)"
echo "============================================"
echo ""

echo "[1/2] Запись новой конфигурации Nginx..."

cat > /etc/nginx/sites-available/atg << NGINX
# ── Gzip сжатие ──────────────────────────────────────────
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_comp_level 6;
gzip_proxied any;
gzip_types
    text/plain
    text/css
    text/javascript
    application/javascript
    application/json
    application/x-javascript
    text/xml
    application/xml
    image/svg+xml
    font/woff
    font/woff2
    application/font-woff
    application/font-woff2;

# ── HTTP → HTTPS редирект ─────────────────────────────────
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$host\$request_uri;
}

# ── HTTPS основной сервер ─────────────────────────────────
server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    client_max_body_size 50M;

    # Блокировка сканеров
    location ~* ^/api/(\.env|\.git|config|wp-|phpmyadmin|admin\.php|test) {
        return 444;
    }

    # ── Статика: загруженные картинки (без Node.js!) ──────
    location /uploads/ {
        alias $APP_DIR/uploads/;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Access-Control-Allow-Origin "*";
        access_log off;
    }

    # ── Статика: JS/CSS бандлы ────────────────────────────
    location /assets/ {
        alias $APP_DIR/dist/public/assets/;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # ── Статика: картинки из public/ ─────────────────────
    location /images/ {
        alias $APP_DIR/dist/public/images/;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # ── Всё остальное → Node.js ───────────────────────────
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

echo "[2/2] Проверка и перезагрузка Nginx..."
nginx -t && systemctl reload nginx

echo ""
echo "============================================"
echo "  Готово! Что теперь работает:"
echo "  ✓ Gzip сжатие включено (JS/CSS/JSON ~70% меньше)"
echo "  ✓ Картинки /uploads/ отдаются Nginx напрямую"
echo "  ✓ Статика /assets/ и /images/ — тоже напрямую"
echo "  ✓ Боты на /api/.env заблокированы (444)"
echo "  ✓ SSL сохранён"
echo "============================================"
echo ""
echo "Проверь сжатие:"
echo "  curl -I -H 'Accept-Encoding: gzip' https://$DOMAIN/assets/ 2>/dev/null | grep -i content-encoding"
