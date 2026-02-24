#!/bin/bash
set -e

echo "============================================"
echo "  Настройка PM2 + Nginx"
echo "============================================"
echo ""

# --- 1. Установка PM2 ---
echo "[1/4] Установка PM2..."
npm install -g pm2

# --- 2. Запуск приложения через PM2 ---
echo "[2/4] Запуск приложения..."
cd /root/ATG

pm2 stop atg 2>/dev/null || true
pm2 delete atg 2>/dev/null || true

pm2 start dist/index.cjs --name atg --env production
pm2 save
pm2 startup systemd -u root --hp /root

echo "Приложение запущено на порту 5000"

# --- 3. Установка и настройка Nginx ---
echo "[3/4] Установка Nginx..."
apt install -y nginx

cat > /etc/nginx/sites-available/atg << 'NGINX'
server {
    listen 80;
    server_name _;

    client_max_body_size 20M;

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
