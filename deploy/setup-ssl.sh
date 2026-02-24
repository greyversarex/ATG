#!/bin/bash
set -e

DOMAIN=${1:-"atg.tj"}

echo "============================================"
echo "  Установка SSL для $DOMAIN"
echo "============================================"
echo ""

# Установка Certbot
apt install -y certbot python3-certbot-nginx

# Обновление конфигурации Nginx с доменом
cat > /etc/nginx/sites-available/atg << NGINX
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    client_max_body_size 20M;

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
    }
}
NGINX

nginx -t
systemctl reload nginx

# Получение SSL сертификата
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email admin@$DOMAIN --redirect

echo ""
echo "============================================"
echo "  SSL установлен!"
echo "============================================"
echo "Сайт доступен по адресу: https://$DOMAIN"
echo ""
