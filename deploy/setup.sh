#!/bin/bash
set -e

echo "============================================"
echo "  ATG.TJ - Установка на сервер Timeweb"
echo "============================================"
echo ""

# --- 1. Обновление системы ---
echo "[1/8] Обновление системы..."
apt update && apt upgrade -y

# --- 2. Установка Node.js 20 ---
echo "[2/8] Установка Node.js 20..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
fi
echo "Node.js: $(node -v)"
echo "npm: $(npm -v)"

# --- 3. Установка PostgreSQL ---
echo "[3/8] Установка PostgreSQL..."
if ! command -v psql &> /dev/null; then
  apt install -y postgresql postgresql-contrib
fi
systemctl enable postgresql
systemctl start postgresql

# --- 4. Создание базы данных ---
echo "[4/8] Настройка базы данных..."
DB_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9' | head -c 24)
sudo -u postgres psql -c "CREATE USER atg_user WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || echo "Пользователь уже существует"
sudo -u postgres psql -c "CREATE DATABASE atg_db OWNER atg_user;" 2>/dev/null || echo "База данных уже существует"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE atg_db TO atg_user;"

echo "  DB User: atg_user"
echo "  DB Name: atg_db"
echo "  DB Pass: $DB_PASSWORD"

# --- 5. Клонирование репозитория ---
echo "[5/8] Клонирование репозитория..."
cd /root
if [ -d "ATG" ]; then
  echo "Папка ATG уже существует, обновляю..."
  cd ATG
  git pull
else
  git clone https://github.com/greyversarex/ATG.git
  cd ATG
fi

# --- 6. Установка зависимостей ---
echo "[6/8] Установка зависимостей..."
npm install

# --- 7. Создание .env файла ---
echo "[7/8] Создание конфигурации..."
SESSION_SECRET=$(openssl rand -base64 32)

cat > .env << EOF
DATABASE_URL=postgresql://atg_user:${DB_PASSWORD}@localhost:5432/atg_db
SESSION_SECRET=${SESSION_SECRET}
NODE_ENV=production
PORT=5000
EOF

echo "Файл .env создан"

# --- 8. Сборка проекта ---
echo "[8/8] Сборка проекта..."
npm run build

# --- Синхронизация базы данных ---
echo "Синхронизация схемы базы данных..."
npx drizzle-kit push --force

echo ""
echo "============================================"
echo "  Установка завершена!"
echo "============================================"
echo ""
echo "Сохраните эти данные:"
echo "  DATABASE_URL: postgresql://atg_user:${DB_PASSWORD}@localhost:5432/atg_db"
echo "  SESSION_SECRET: ${SESSION_SECRET}"
echo ""
echo "Следующий шаг: запустите setup-pm2.sh"
echo ""
