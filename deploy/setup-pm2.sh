#!/bin/bash
set -e

echo "============================================"
echo "  Настройка PM2 + Nginx"
echo "============================================"
echo ""

# --- 1. Установка PM2 ---
echo "[1/4] Установка PM2..."
npm install -g pm2

# --- 2. Запуск приложения через PM2 (cluster mode) ---
echo "[2/4] Запуск приложения..."
cd /root/ATG

pm2 stop atg 2>/dev/null || true
pm2 delete atg 2>/dev/null || true

# -i max = cluster mode, использует все ядра CPU
pm2 start dist/index.cjs --name atg -i max --env production
pm2 save
pm2 startup systemd -u root --hp /root

echo "Приложение запущено на порту 5000 (cluster mode)"

# --- 3. Установка и настройка Nginx ---
echo "[3/4] Установка Nginx..."
apt install -y nginx

cat > /etc/nginx/sites-available/atg << 'NGINX'
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
    server_name _;

    client_max_body_size 20M;

    # Прямая отдача загруженных картинок (без Node.js)
    location /uploads/ {
        alias /root/ATG/uploads/;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Access-Control-Allow-Origin "*";
        access_log off;
    }

    # Прямая отдача статики сборки (JS/CSS/assets)
    location /assets/ {
        alias /root/ATG/dist/public/assets/;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # Прямая отдача статичных картинок из public
    location /images/ {
        alias /root/ATG/dist/public/images/;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # Всё остальное — через Node.js
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Таймауты
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
NGINX

# Активация конфигурации
ln -sf /etc/nginx/sites-available/atg /etc/nginx/sites-enabled/atg
rm -f /etc/nginx/sites-enabled/default

# Проверка и перезапуск Nginx
nginx -t
systemctl restart nginx
systemctl enable nginx

echo "[4/4] Настройка файрвола..."
ufw allow 80/tcp 2>/dev/null || true
ufw allow 443/tcp 2>/dev/null || true
ufw allow 22/tcp 2>/dev/null || true

echo ""
echo "============================================"
echo "  Всё готово!"
echo "============================================"
echo ""
echo "Сайт доступен по адресу: http://$(curl -s ifconfig.me)"
echo ""
echo "Для привязки домена atg.tj:"
echo "  1. Направьте A-запись домена на IP сервера"
echo "  2. Запустите: bash /root/ATG/deploy/setup-ssl.sh atg.tj"
echo ""
