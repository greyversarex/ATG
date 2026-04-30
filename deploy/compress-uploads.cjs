#!/usr/bin/env node
// Скрипт пересжатия всех изображений в папке uploads
// Запуск: node /root/ATG/deploy/compress-uploads.cjs

const sharp = require('/root/ATG/node_modules/sharp');
const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = '/root/ATG/uploads';
const MAX_DIM = 1000;       // макс. размер стороны
const WEBP_QUALITY = 72;    // качество WebP
const PNG_QUALITY = 75;     // качество PNG (fallback)
const SKIP_BELOW_KB = 80;   // не трогать файлы меньше 80KB

async function compressFile(filename) {
  const fp = path.join(UPLOADS_DIR, filename);
  const ext = path.extname(filename).toLowerCase();

  if (ext === '.svg') return { skip: true, reason: 'svg' };

  const statBefore = fs.statSync(fp);
  const sizeBefore = statBefore.size;

  if (sizeBefore < SKIP_BELOW_KB * 1024) {
    return { skip: true, reason: 'already small' };
  }

  try {
    let result;

    if (ext === '.png') {
      // Конвертируем PNG в WebP — сохраняем под тем же именем но меняем содержимое
      // (URL в базе остаётся прежним, файл становится WebP внутри)
      result = await sharp(fp)
        .resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY, effort: 6 })
        .toBuffer();
    } else if (ext === '.webp') {
      result = await sharp(fp)
        .resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY, effort: 6 })
        .toBuffer();
    } else {
      result = await sharp(fp)
        .resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY, effort: 6 })
        .toBuffer();
    }

    // Только перезаписываем если стало меньше
    if (result.length < sizeBefore) {
      fs.writeFileSync(fp, result);
      return {
        saved: sizeBefore - result.length,
        before: sizeBefore,
        after: result.length,
      };
    } else {
      return { skip: true, reason: 'already optimized' };
    }
  } catch (e) {
    return { error: e.message };
  }
}

async function main() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.error('Папка uploads не найдена:', UPLOADS_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(UPLOADS_DIR)
    .filter(f => /\.(png|jpg|jpeg|webp|gif|avif)$/i.test(f));

  console.log(`\nНайдено файлов: ${files.length}`);

  const sizeBefore = files.reduce((acc, f) => {
    try { return acc + fs.statSync(path.join(UPLOADS_DIR, f)).size; } catch { return acc; }
  }, 0);

  console.log(`Общий размер до: ${(sizeBefore / 1024 / 1024).toFixed(1)} MB`);
  console.log('Начинаю сжатие...\n');

  let processed = 0, skipped = 0, errors = 0, totalSaved = 0;

  // По 10 файлов параллельно
  const BATCH = 10;
  for (let i = 0; i < files.length; i += BATCH) {
    const batch = files.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(f => compressFile(f)));

    results.forEach((res, idx) => {
      const f = batch[idx];
      if (res.skip) {
        skipped++;
      } else if (res.error) {
        errors++;
        console.log(`  ✗ ${f}: ${res.error}`);
      } else {
        processed++;
        totalSaved += res.saved;
        const pct = Math.round((1 - res.after / res.before) * 100);
        console.log(`  ✓ ${f}: ${(res.before/1024).toFixed(0)}KB → ${(res.after/1024).toFixed(0)}KB (-${pct}%)`);
      }
    });

    process.stdout.write(`\rПрогресс: ${Math.min(i + BATCH, files.length)}/${files.length}`);
  }

  const sizeAfter = files.reduce((acc, f) => {
    try { return acc + fs.statSync(path.join(UPLOADS_DIR, f)).size; } catch { return acc; }
  }, 0);

  console.log(`\n\n====================================`);
  console.log(`Сжато файлов:   ${processed}`);
  console.log(`Пропущено:      ${skipped}`);
  console.log(`Ошибок:         ${errors}`);
  console.log(`Было:           ${(sizeBefore/1024/1024).toFixed(1)} MB`);
  console.log(`Стало:          ${(sizeAfter/1024/1024).toFixed(1)} MB`);
  console.log(`Сэкономлено:    ${(totalSaved/1024/1024).toFixed(1)} MB`);
  console.log(`====================================\n`);
}

main().catch(console.error);
