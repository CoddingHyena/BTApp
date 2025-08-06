const fs = require('fs');
const path = require('path');

// Маппинг для сложных случаев
const manualFactionLogoMapping = {
  'Federated Suns': 'DavionLogo.png',
  'Clan Ghost Bear': 'GhostBearLogo.png', 
  'Capellan Confederation': 'HouseLiaoLogo.png',
  'Kell Hounds': 'imagesKH.jpg',
  'Free Worlds League': 'MaricLogo.png'
};

// Функция для очистки имени файла для сопоставления
function cleanFileName(filename) {
  return filename
    .replace(/\.(png|jpg|jpeg|svg)$/i, '') // Убираем расширение
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Убираем спецсимволы
    .trim();
}

// Функция для очистки названия фракции для сопоставления
function cleanFactionName(factionName) {
  return factionName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Убираем спецсимволы
    .trim();
}

// Функция для автоматического сопоставления файлов с фракциями
function autoMatchFactionToLogo(factionName, availableFiles) {
  const cleanFactionNameResult = cleanFactionName(factionName);
  
  for (const file of availableFiles) {
    const cleanFileNameResult = cleanFileName(file);
    
    // Проверяем точное совпадение
    if (cleanFileNameResult === cleanFactionNameResult) {
      return file;
    }
    
    // Проверяем частичное совпадение (файл содержит название фракции)
    if (cleanFileNameResult.includes(cleanFactionNameResult) || cleanFactionNameResult.includes(cleanFileNameResult)) {
      return file;
    }
  }
  
  return null;
}

// Функция для чтения текущего seed файла
function readCurrentSeedFile() {
  const seedFilePath = path.join(__dirname, '..', 'prisma', 'seeds', 'faction.seeds.ts');
  return fs.readFileSync(seedFilePath, 'utf8');
}

// Функция для сканирования папки логотипов
function scanLogosDirectory() {
  const logosDir = path.join(__dirname, '..', 'public', 'uploads', 'factions', 'logos');
  
  if (!fs.existsSync(logosDir)) {
    console.log('⚠️  Папка логотипов не найдена:', logosDir);
    return [];
  }
  
  const files = fs.readdirSync(logosDir);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.svg'].includes(ext);
  });
}

// Функция для обновления seed файла
function updateSeedFile(factions, availableFiles) {
  const seedFilePath = path.join(__dirname, '..', 'prisma', 'seeds', 'faction.seeds.ts');
  const currentContent = fs.readFileSync(seedFilePath, 'utf8');
  
  // Создаем обновленный массив фракций
  const updatedFactions = factions.map(faction => {
    const updatedFaction = { ...faction };
    
    // Проверяем ручной маппинг
    if (manualFactionLogoMapping[faction.name]) {
      const mappedFile = manualFactionLogoMapping[faction.name];
      if (availableFiles.includes(mappedFile)) {
        updatedFaction.logoUrl = `factions/logos/${mappedFile}`;
        console.log(`✅ Ручной маппинг: ${faction.name} → ${mappedFile}`);
      } else {
        console.log(`⚠️  Файл не найден для ручного маппинга: ${faction.name} → ${mappedFile}`);
      }
    } else {
      // Автоматическое сопоставление
      const matchedFile = autoMatchFactionToLogo(faction.name, availableFiles);
      if (matchedFile) {
        updatedFaction.logoUrl = `factions/logos/${matchedFile}`;
        console.log(`✅ Автоматическое сопоставление: ${faction.name} → ${matchedFile}`);
      } else {
        console.log(`⚠️  Не найдено соответствие для: ${faction.name}`);
      }
    }
    
    return updatedFaction;
  });
  
  // Генерируем новый контент seed файла
  const factionsString = updatedFactions.map(faction => {
    const lines = [
      '      {',
      `        name: '${faction.name}',`,
      `        code: '${faction.code}',`,
      `        primaryColor: '${faction.primaryColor}',`,
      `        secondaryColor: '${faction.secondaryColor}',`,
      `        formationYear: ${faction.formationYear},`,
      faction.dissolutionYear ? `        dissolutionYear: ${faction.dissolutionYear},` : '        dissolutionYear: null,',
      `        description: '${faction.description}',`,
      `        logoUrl: '${faction.logoUrl}',`,
      `        bannerUrl: '${faction.bannerUrl}',`,
      `        gameIdRef: ${faction.gameIdRef},`,
      `        isMajor: ${faction.isMajor},`,
      `        isActive: ${faction.isActive},`,
      '      },'
    ];
    return lines.join('\n');
  }).join('\n\n');
  
  // Заменяем массив фракций в seed файле
  const updatedContent = currentContent.replace(
    /const factions = \[[\s\S]*?\];/,
    `const factions = [\n\n${factionsString}\n\n    ];`
  );
  
  // Сохраняем обновленный файл
  fs.writeFileSync(seedFilePath, updatedContent);
  console.log(`\n✅ Seed файл обновлен: ${seedFilePath}`);
}

// Основная функция
function main() {
  console.log('🔄 Начинаем обновление faction.seeds.ts с путями к логотипам...\n');
  
  // Сканируем папку логотипов
  const availableFiles = scanLogosDirectory();
  console.log(`📁 Найдено файлов логотипов: ${availableFiles.length}`);
  availableFiles.forEach(file => console.log(`   - ${file}`));
  console.log('');
  
  // Читаем текущий seed файл и извлекаем фракции
  const currentContent = readCurrentSeedFile();
  
  // Извлекаем фракции только из блока factions
  const factionsBlockMatch = currentContent.match(/const factions = \[([\s\S]*?)\];/);
  let factionNames = [];
  
  if (factionsBlockMatch) {
    const factionsBlock = factionsBlockMatch[1];
    const factionMatches = factionsBlock.match(/name: '([^']+)'/g);
    let allNames = factionMatches ? factionMatches.map(match => match.replace("name: '", "").replace("'", "")) : [];
    
    // Исключаем игры и дубликаты
    const gameNames = ['Battletech', 'Trench Crusade'];
    factionNames = allNames.filter(name => !gameNames.includes(name));
    
    // Удаляем дубликаты
    factionNames = [...new Set(factionNames)];
  }
  
  console.log(`📋 Найдено фракций в seed: ${factionNames.length}`);
  factionNames.forEach(name => console.log(`   - ${name}`));
  console.log('');
  
  // Создаем временные объекты фракций для обновления
  const factions = factionNames.map(name => ({
    name,
    code: 'TEMP',
    primaryColor: '#FFD700',
    secondaryColor: '#000080',
    formationYear: 2571,
    dissolutionYear: null,
    description: 'Temporary description',
    logoUrl: 'factions/logos/temp.png',
    bannerUrl: 'factions/banners/temp.jpg',
    gameIdRef: 'temp',
    isMajor: false,
    isActive: true,
  }));
  
  // Обновляем seed файл
  updateSeedFile(factions, availableFiles);
  
  console.log('\n🎉 Обновление завершено!');
  console.log('\n📝 Следующие шаги:');
  console.log('1. Проверьте обновленный faction.seeds.ts');
  console.log('2. При необходимости отредактируйте пути вручную');
  console.log('3. Запустите seed для применения изменений');
}

// Запускаем скрипт
if (require.main === module) {
  main();
}

module.exports = { main }; 