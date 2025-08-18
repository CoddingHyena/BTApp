// Библиотека имен и фамилий для пилотов BattleTech по культурам фракций
import { getFactionThemedCallsign } from './callsigns';

// Типы для пола и культур
export type Gender = 'male' | 'female';
export type CultureKey = keyof typeof PILOT_NAMES;

// Конфигурация культур с указанием половых различий
export const CULTURE_CONFIG = {
  GERMAN: { hasGenderDifferences: false, lastNameTransformation: false },
  JAPANESE: { hasGenderDifferences: false, lastNameTransformation: false },
  CHINESE: { hasGenderDifferences: false, lastNameTransformation: false },
  ANGLO_SAXON: { hasGenderDifferences: false, lastNameTransformation: false },
  MEDITERRANEAN: { hasGenderDifferences: false, lastNameTransformation: false },
  RUSSIAN: { hasGenderDifferences: true, lastNameTransformation: true },
  INDIAN: { hasGenderDifferences: false, lastNameTransformation: false },
  SCANDINAVIAN: { hasGenderDifferences: false, lastNameTransformation: false },
  CLAN: { hasGenderDifferences: false, lastNameTransformation: false }
} as const;

export const PILOT_NAMES = {
  // Немецкие/Европейские имена (House Steiner/Lyran Commonwealth)
  GERMAN: {
    firstNames: [
      'Hans', 'Klaus', 'Wolfgang', 'Heinrich', 'Friedrich', 'Otto', 'Wilhelm', 'Karl',
      'Gustav', 'Ludwig', 'Ernst', 'Franz', 'Rudolf', 'Adolf', 'Hermann', 'Werner',
      'Anna', 'Greta', 'Helena', 'Ingrid', 'Katarina', 'Liesel', 'Marta', 'Nina',
      'Petra', 'Rosa', 'Sofia', 'Theresa', 'Ursula', 'Vera', 'Wanda', 'Zelda'
    ],
    lastNames: [
      'Mueller', 'Schmidt', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffman',
      'Schaefer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schroeder', 'Neumann',
      'Schwarz', 'Zimmermann', 'Braun', 'Krueger', 'Hofmann', 'Hartmann', 'Lange',
      'Schmitt', 'Werner', 'Krause', 'Meier', 'Lehmann', 'Schmid', 'Schulze', 'Maier'
    ]
  },

  // Японские имена (House Kurita/Draconis Combine)
  JAPANESE: {
    firstNames: [
      'Takeshi', 'Kenji', 'Hiroshi', 'Yuki', 'Akira', 'Daisuke', 'Kazuki', 'Ryo',
      'Shinji', 'Taro', 'Yoshi', 'Akio', 'Daichi', 'Eiji', 'Fumio', 'Goro',
      'Akiko', 'Aya', 'Chie', 'Eiko', 'Fumiko', 'Haruka', 'Ichika', 'Junko',
      'Kaori', 'Mai', 'Nami', 'Reiko', 'Sachiko', 'Tomoko', 'Yumi', 'Yuki'
    ],
    lastNames: [
      'Yamamoto', 'Tanaka', 'Sato', 'Watanabe', 'Ito', 'Takahashi', 'Suzuki', 'Kato',
      'Yamada', 'Sasaki', 'Yamaguchi', 'Saito', 'Matsumoto', 'Inoue', 'Kimura', 'Hayashi',
      'Shimizu', 'Yamazaki', 'Mori', 'Abe', 'Ikeda', 'Hashimoto', 'Yamashita', 'Ishikawa',
      'Nakajima', 'Maeda', 'Fujita', 'Ogawa', 'Goto', 'Okada', 'Hasegawa', 'Murakami'
    ]
  },

  // Китайские имена (House Liao/Capellan Confederation)
  CHINESE: {
    firstNames: [
      'Wei', 'Li', 'Zhang', 'Wang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu',
      'Zhou', 'Sun', 'Ma', 'Zhu', 'Hu', 'Guo', 'Lin', 'He', 'Gao', 'Luo',
      'Xia', 'Ling', 'Mei', 'Hui', 'Jing', 'Lan', 'Ping', 'Qing', 'Rong', 'Shu',
      'Ting', 'Wen', 'Xia', 'Yan', 'Zhen', 'Ai', 'Bai', 'Cai', 'Dan', 'E'
    ],
    lastNames: [
      'Li', 'Wang', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou',
      'Sun', 'Ma', 'Zhu', 'Hu', 'Guo', 'Lin', 'He', 'Gao', 'Luo', 'Zheng',
      'Liang', 'Xie', 'Song', 'Tang', 'Han', 'Feng', 'Yu', 'Dong', 'Cao', 'Yuan',
      'Deng', 'Xu', 'Cai', 'Peng', 'Pan', 'Jiang', 'Bao', 'Fang', 'Gong', 'Hou'
    ]
  },

  // Англо-саксонские имена (House Davion/Federated Suns)
  ANGLO_SAXON: {
    firstNames: [
      'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph',
      'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald',
      'Sarah', 'Jennifer', 'Jessica', 'Amanda', 'Melissa', 'Nicole', 'Stephanie', 'Ashley',
      'Elizabeth', 'Michelle', 'Kimberly', 'Lisa', 'Angela', 'Heather', 'Amy', 'Rebecca'
    ],
    lastNames: [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
      'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
      'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
      'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young'
    ]
  },

  // Средиземноморские имена (House Marik/Free Worlds League)
  MEDITERRANEAN: {
    firstNames: [
      'Marco', 'Giuseppe', 'Antonio', 'Luca', 'Alessandro', 'Matteo', 'Giovanni', 'Roberto',
      'Andrea', 'Stefano', 'Daniele', 'Paolo', 'Mario', 'Luigi', 'Carlo', 'Vincenzo',
      'Sofia', 'Giulia', 'Alessia', 'Martina', 'Chiara', 'Valentina', 'Elisa', 'Federica',
      'Laura', 'Silvia', 'Elena', 'Anna', 'Maria', 'Cristina', 'Monica', 'Paola'
    ],
    lastNames: [
      'Rossi', 'Ferrari', 'Russo', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino',
      'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano',
      'Rizzo', 'Lombardi', 'Moretti', 'Fontana', 'Caruso', 'Ferrara', 'Galli', 'Rinaldi',
      'Leone', 'Longo', 'Gentile', 'Martinelli', 'Vitale', 'Lombardo', 'Coppola', 'Parisi'
    ]
  },

  // Русские/Славянские имена (Periphery/Outer Worlds) - с половыми различиями
  RUSSIAN: {
    male: {
      firstNames: [
        'Ivan', 'Dmitri', 'Sergei', 'Vladimir', 'Nikolai', 'Andrei', 'Alexei', 'Mikhail',
        'Pavel', 'Konstantin', 'Viktor', 'Yuri', 'Boris', 'Anatoli', 'Valeri', 'Oleg',
        'Vasili', 'Igor', 'Roman', 'Denis', 'Anton', 'Artem', 'Maxim', 'Daniil',
        'Artyom', 'Kirill', 'Timur', 'Ruslan', 'Egor', 'Matvei', 'Nikita', 'Vladislav'
      ],
      lastNames: [
        'Ivanov', 'Petrov', 'Sidorov', 'Smirnov', 'Popov', 'Sokolov', 'Lebedev', 'Kozlov',
        'Novikov', 'Morozov', 'Volkov', 'Alekseev', 'Semenov', 'Egorov', 'Pavlov', 'Stepanov',
        'Nikolaev', 'Orlov', 'Andreev', 'Makarov', 'Nikitin', 'Zakharov', 'Zaitsev', 'Kuznetsov',
        'Mikhailov', 'Grigoriev', 'Titov', 'Polyakov', 'Rakov', 'Savin', 'Belyaev', 'Komarov'
      ]
    },
    female: {
      firstNames: [
        'Natasha', 'Elena', 'Olga', 'Irina', 'Tatiana', 'Svetlana', 'Maria', 'Anna',
        'Natalia', 'Yulia', 'Ekaterina', 'Ludmila', 'Galina', 'Valentina', 'Raisa', 'Zinaida',
        'Anastasia', 'Daria', 'Ksenia', 'Viktoria', 'Alina', 'Polina', 'Kristina', 'Angelina',
        'Veronika', 'Margarita', 'Elizaveta', 'Sofia', 'Arina', 'Varvara', 'Milana', 'Alisa'
      ],
      lastNames: [
        'Ivanova', 'Petrova', 'Sidorova', 'Smirnova', 'Popova', 'Sokolova', 'Lebedeva', 'Kozlova',
        'Novikova', 'Morozova', 'Volkova', 'Alekseeva', 'Semenova', 'Egorova', 'Pavlova', 'Stepanova',
        'Nikolaeva', 'Orlova', 'Andreeva', 'Makarova', 'Nikitina', 'Zakharova', 'Zaitseva', 'Kuznetsova',
        'Mikhailova', 'Grigorieva', 'Titova', 'Polyakova', 'Rakova', 'Savina', 'Belyaeva', 'Komarova'
      ]
    }
  },

  // Индийские имена (Clan/Deep Periphery)
  INDIAN: {
    firstNames: [
      'Arjun', 'Vikram', 'Raj', 'Amit', 'Sanjay', 'Rahul', 'Priya', 'Meera',
      'Anjali', 'Kavita', 'Sunita', 'Rekha', 'Lakshmi', 'Sita', 'Radha', 'Gita',
      'Dev', 'Krishna', 'Rama', 'Shiva', 'Vishnu', 'Brahma', 'Indra', 'Varuna',
      'Durga', 'Kali', 'Saraswati', 'Parvati', 'Lakshmi', 'Ganga', 'Yamuna', 'Narmada'
    ],
    lastNames: [
      'Patel', 'Singh', 'Kumar', 'Sharma', 'Verma', 'Gupta', 'Malhotra', 'Kapoor',
      'Chopra', 'Reddy', 'Rao', 'Mehta', 'Joshi', 'Yadav', 'Kaur', 'Kaur',
      'Bhatt', 'Chauhan', 'Gill', 'Dhillon', 'Sidhu', 'Sandhu', 'Mann', 'Brar',
      'Grewal', 'Randhawa', 'Dhaliwal', 'Cheema', 'Bajwa', 'Saini', 'Kang', 'Aulakh'
    ]
  },

SCANDINAVIAN: {  
  firstNames: [  
    'Erik', 'Bjorn', 'Leif', 'Olaf', 'Sven', 'Gunnar', 'Torsten', 'Lars',  
    'Anders', 'Magnus', 'Sten', 'Ragnar', 'Harald', 'Sigurd', 'Ivar', 'Hakon',  
    'Freya', 'Astrid', 'Ingrid', 'Sigrid', 'Helga', 'Gudrun', 'Solveig', 'Thyra',  
    'Liv', 'Hilda', 'Eira', 'Saga', 'Runa', 'Ylva', 'Alva', 'Tora'  
  ],  
  lastNames: [  
    'Andersen', 'Johansson', 'Nilsson', 'Eriksson', 'Svensson', 'Gustafsson',  
    'Olsson', 'Pettersson', 'Berg', 'Lund', 'Hansen', 'Pedersen', 'Jensen',  
    'Karlsen', 'Larsen', 'Nilsen', 'Solberg', 'Haugen', 'Kristiansen',  
    'Iversen', 'Amundsen', 'Bjornstad', 'Eide', 'Foss', 'Holm', 'Moen',  
    'Nygaard', 'Strand', 'Vik', 'Aas', 'Dahl', 'Engen'  
  ]  
},

  // Клановые имена (Clans) - имена из других культур, фамилии только для воинов
  CLAN: {
    firstNames: [], // Пустой - имена берутся из других культур
    lastNames: [
      // Воинские фамилии теперь берутся из seed файла
      // Этот список используется только как fallback
      'Kerensky', 'Ward', 'Wolf', 'Falcon', 'Bear', 'Tiger'
    ]
  }
};



// Функция для генерации случайного пола
export function generateRandomGender(): Gender {
  return Math.random() < 0.5 ? 'male' : 'female';
}

// Функция для получения имени с учетом пола
export function getRandomNameWithGender(
  culture: CultureKey, 
  gender: Gender
): { firstName: string; lastName: string; gender: Gender } {
  const cultureConfig = CULTURE_CONFIG[culture];
  
  if (cultureConfig.hasGenderDifferences) {
    // Для культур с половыми различиями (например, русские)
    const names = PILOT_NAMES[culture] as any;
    const genderNames = names[gender];
    
    const firstName = genderNames.firstNames[Math.floor(Math.random() * genderNames.firstNames.length)];
    const lastName = genderNames.lastNames[Math.floor(Math.random() * genderNames.lastNames.length)];
    
    return { firstName, lastName, gender };
  } else {
    // Для культур без половых различий
    const names = PILOT_NAMES[culture] as any;
    const firstName = names.firstNames[Math.floor(Math.random() * names.firstNames.length)];
    const lastName = names.lastNames[Math.floor(Math.random() * names.lastNames.length)];
    
    return { firstName, lastName, gender };
  }
}

// Функция для получения смешанного имени (разные культуры для имени и фамилии)
export function getMixedNameWithGender(
  firstNameCulture: CultureKey,
  lastNameCulture: CultureKey,
  gender: Gender
): { firstName: string; lastName: string; gender: Gender } {
  const firstNameConfig = CULTURE_CONFIG[firstNameCulture];
  const lastNameConfig = CULTURE_CONFIG[lastNameCulture];
  
  let firstName: string;
  let lastName: string;
  
  // Получаем имя из первой культуры
  if (firstNameConfig.hasGenderDifferences) {
    const names = PILOT_NAMES[firstNameCulture] as any;
    const genderNames = names[gender];
    firstName = genderNames.firstNames[Math.floor(Math.random() * genderNames.firstNames.length)];
  } else {
    const names = PILOT_NAMES[firstNameCulture] as any;
    firstName = names.firstNames[Math.floor(Math.random() * names.firstNames.length)];
  }
  
  // Получаем фамилию из второй культуры
  if (lastNameConfig.hasGenderDifferences) {
    const names = PILOT_NAMES[lastNameCulture] as any;
    const genderNames = names[gender];
    lastName = genderNames.lastNames[Math.floor(Math.random() * genderNames.lastNames.length)];
  } else {
    const names = PILOT_NAMES[lastNameCulture] as any;
    lastName = names.lastNames[Math.floor(Math.random() * names.lastNames.length)];
  }
  
  return { firstName, lastName, gender };
}

// Функция для получения случайного имени из категории (обратная совместимость)
export function getRandomName(culture: CultureKey): { firstName: string; lastName: string } {
  const gender = generateRandomGender();
  const result = getRandomNameWithGender(culture, gender);
  return { firstName: result.firstName, lastName: result.lastName };
}

// Функция для получения имени по фракции с учетом пола
export function getFactionThemedNameWithGender(
  factionName: string, 
  gender?: Gender
): { firstName: string; lastName: string; gender: Gender } {
  const factionLower = factionName.toLowerCase();
  const pilotGender = gender || generateRandomGender();
  
  let culture: CultureKey;
  
  if (factionLower.includes('steiner') || factionLower.includes('lyran')) {
    culture = 'GERMAN';
  } else if (factionLower.includes('davion') || factionLower.includes('federated')) {
    culture = 'ANGLO_SAXON';
  } else if (factionLower.includes('kurita') || factionLower.includes('draconis')) {
    culture = 'JAPANESE';
  } else if (factionLower.includes('liao') || factionLower.includes('capellan')) {
    culture = 'CHINESE';
  } else if (factionLower.includes('marik') || factionLower.includes('free worlds')) {
    culture = 'MEDITERRANEAN';
  } else if (factionLower.includes('periphery') || factionLower.includes('bandit')) {
    culture = 'RUSSIAN';
  } else if (factionLower.includes('clan') || factionLower.includes('wolf')) {
    culture = 'INDIAN';
  } else {
    // По умолчанию - смешанные культуры
    const cultures = Object.keys(PILOT_NAMES) as CultureKey[];
    culture = cultures[Math.floor(Math.random() * cultures.length)];
  }
  
  return getRandomNameWithGender(culture, pilotGender);
}

// Функция для получения имени по фракции (обратная совместимость)
export function getFactionThemedName(factionName: string): { firstName: string; lastName: string } {
  const result = getFactionThemedNameWithGender(factionName);
  return { firstName: result.firstName, lastName: result.lastName };
}

// Функция для генерации полного имени с позывным
export function generateFullPilotName(
  firstName: string, 
  lastName: string, 
  callsign: string, 
  rank?: string
): string {
  // Если позывной пустой, не добавляем кавычки
  if (!callsign || callsign.trim() === '') {
    if (rank) {
      return `${rank} ${firstName} ${lastName}`.trim();
    }
    return `${firstName} ${lastName}`.trim();
  }
  
  // Если есть позывной, размещаем его между именем и фамилией
  if (rank) {
    return `${rank} ${firstName} '${callsign}' ${lastName}`.trim();
  }
  return `${firstName} '${callsign}' ${lastName}`.trim();
}

// Функция для генерации полного пилота с именем и позывным
export function generateCompletePilot(factionName: string, culture?: CultureKey, callsign?: string) {
  const gender = generateRandomGender();
  const { firstName, lastName } = culture 
    ? getRandomNameWithGender(culture, gender)
    : getFactionThemedNameWithGender(factionName, gender);
  const pilotCallsign = callsign || getFactionThemedCallsign(factionName);
  
  return {
    firstName,
    lastName,
    gender,
    callsign: pilotCallsign,
    fullName: generateFullPilotName(firstName, lastName, pilotCallsign)
  };
}

// Функция для генерации полного пилота с заданным полом
export function generateCompletePilotWithGender(
  factionName: string, 
  gender: Gender, 
  culture?: CultureKey,
  callsign?: string
) {
  const { firstName, lastName } = culture 
    ? getRandomNameWithGender(culture, gender)
    : getFactionThemedNameWithGender(factionName, gender);
  const pilotCallsign = callsign || getFactionThemedCallsign(factionName);
  
  return {
    firstName,
    lastName,
    gender,
    callsign: pilotCallsign,
    fullName: generateFullPilotName(firstName, lastName, pilotCallsign)
  };
}

// Функция для генерации пилота со смешанными культурами
export function generateCompletePilotWithMixedCultures(
  factionName: string, 
  firstNameCulture: CultureKey, 
  lastNameCulture: CultureKey, 
  callsign?: string
) {
  const gender = generateRandomGender();
  const { firstName, lastName } = getMixedNameWithGender(firstNameCulture, lastNameCulture, gender);
  
  const pilotCallsign = callsign || getFactionThemedCallsign(factionName);
  
  return {
    firstName,
    lastName,
    gender,
    callsign: pilotCallsign,
    fullName: generateFullPilotName(firstName, lastName, pilotCallsign)
  };
}

// Функция для генерации пилота со смешанными культурами и заданным полом
export function generateCompletePilotWithMixedCulturesAndGender(
  factionName: string, 
  firstNameCulture: CultureKey, 
  lastNameCulture: CultureKey, 
  gender: Gender,
  callsign?: string
) {
  const { firstName, lastName } = getMixedNameWithGender(firstNameCulture, lastNameCulture, gender);
  
  const pilotCallsign = callsign || getFactionThemedCallsign(factionName);
  
  return {
    firstName,
    lastName,
    gender,
    callsign: pilotCallsign,
    fullName: generateFullPilotName(firstName, lastName, pilotCallsign)
  };
}

// Функция для перегенерации пилота (новый пол, новое имя)
export function regeneratePilot(factionName: string, culture?: CultureKey, callsign?: string) {
  return generateCompletePilot(factionName, culture, callsign);
}

// Функция для перегенерации только имени (сохранение пола)
export function regeneratePilotName(factionName: string, currentGender: Gender, culture?: CultureKey, callsign?: string) {
  return generateCompletePilotWithGender(factionName, currentGender, culture, callsign);
}

// Функция для валидации комбинации пола и имени
export function validateGenderNameCombination(
  firstName: string, 
  lastName: string, 
  gender: Gender, 
  culture: CultureKey
): boolean {
  const cultureConfig = CULTURE_CONFIG[culture];
  
  if (!cultureConfig.hasGenderDifferences) {
    return true; // Для культур без различий всегда корректно
  }
  
  // Для русских фамилий проверяем окончания
  if (culture === 'RUSSIAN') {
    const names = PILOT_NAMES[culture] as any;
    const genderNames = names[gender];
    
    const isValidFirstName = genderNames.firstNames.includes(firstName);
    const isValidLastName = genderNames.lastNames.includes(lastName);
    
    return isValidFirstName && isValidLastName;
  }
  
  return true;
}

// Функция для определения пола по имени (приблизительно)
export function getGenderFromName(firstName: string, culture: CultureKey): Gender | null {
  const cultureConfig = CULTURE_CONFIG[culture];
  
  if (!cultureConfig.hasGenderDifferences) {
    return null; // Не можем определить для культур без различий
  }
  
  if (culture === 'RUSSIAN') {
    const names = PILOT_NAMES[culture] as any;
    
    if (names.male.firstNames.includes(firstName)) {
      return 'male';
    } else if (names.female.firstNames.includes(firstName)) {
      return 'female';
    }
  }
  
  return null;
}

// Функция для генерации кланового пилота
export function generateClanPilot(
  factionName: string,
  firstNameCulture: CultureKey,
  warriorNameChance: number = 0.2,
  warriorNames: string[] = [],
  callsignChance: number = 0.15,
  callsign?: string
) {
  const gender = generateRandomGender();
  
  // Генерируем имя из указанной культуры
  const { firstName } = getRandomNameWithGender(firstNameCulture, gender);
  
  // Определяем, будет ли у пилота воинская фамилия
  const hasWarriorName = Math.random() < warriorNameChance;
  const lastName = hasWarriorName && warriorNames.length > 0 
    ? warriorNames[Math.floor(Math.random() * warriorNames.length)]
    : '';
  
  // Определяем, будет ли у пилота позывной (15% шанс)
  const hasCallsign = Math.random() < callsignChance;
  const pilotCallsign = hasCallsign ? (callsign || getFactionThemedCallsign(factionName)) : '';
  
  return {
    firstName,
    lastName,
    gender,
    callsign: pilotCallsign,
    fullName: generateFullPilotName(firstName, lastName, pilotCallsign)
  };
}

// Функция для генерации кланового пилота с заданным полом
export function generateClanPilotWithGender(
  factionName: string,
  firstNameCulture: CultureKey,
  gender: Gender,
  warriorNameChance: number = 0.2,
  warriorNames: string[] = [],
  callsignChance: number = 0.15,
  callsign?: string
) {
  // Генерируем имя из указанной культуры
  const { firstName } = getRandomNameWithGender(firstNameCulture, gender);
  
  // Определяем, будет ли у пилота воинская фамилия
  const hasWarriorName = Math.random() < warriorNameChance;
  const lastName = hasWarriorName && warriorNames.length > 0 
    ? warriorNames[Math.floor(Math.random() * warriorNames.length)]
    : '';
  
  // Определяем, будет ли у пилота позывной (15% шанс)
  const hasCallsign = Math.random() < callsignChance;
  const pilotCallsign = hasCallsign ? (callsign || getFactionThemedCallsign(factionName)) : '';
  
  return {
    firstName,
    lastName,
    gender,
    callsign: pilotCallsign,
    fullName: generateFullPilotName(firstName, lastName, pilotCallsign)
  };
}

// Функция для генерации пилота с смешанными правилами (как для Rasalhague Dominion)
export function generateMixedRulesPilot(
  factionName: string,
  scandinavianChance: number = 0.4,
  clanChance: number = 0.6,
  warriorNameChance: number = 0.2,
  warriorNames: string[] = [],
  callsignChance: number = 0.15,
  callsign?: string
) {
  const gender = generateRandomGender();
  
  // Определяем, какие правила применять
  const useClanRules = Math.random() < clanChance;
  
  if (useClanRules) {
    // Клановые правила: имя из европейских культур, редкие фамилии и позывные
    const europeanCultures: CultureKey[] = ['ANGLO_SAXON', 'GERMAN', 'SCANDINAVIAN', 'MEDITERRANEAN'];
    const firstNameCulture = europeanCultures[Math.floor(Math.random() * europeanCultures.length)];
    
    const { firstName } = getRandomNameWithGender(firstNameCulture, gender);
    
    // Определяем, будет ли у пилота воинская фамилия
    const hasWarriorName = Math.random() < warriorNameChance;
    const lastName = hasWarriorName && warriorNames.length > 0 
      ? warriorNames[Math.floor(Math.random() * warriorNames.length)]
      : '';
    
    // Определяем, будет ли у пилота позывной
    const hasCallsign = Math.random() < callsignChance;
    const pilotCallsign = hasCallsign ? (callsign || getFactionThemedCallsign(factionName)) : '';
    
    return {
      firstName,
      lastName,
      gender,
      callsign: pilotCallsign,
      fullName: generateFullPilotName(firstName, lastName, pilotCallsign)
    };
  } else {
    // Скандинавские правила: скандинавское имя, всегда фамилия, всегда позывной
    const { firstName, lastName } = getRandomNameWithGender('SCANDINAVIAN', gender);
    const pilotCallsign = callsign || getFactionThemedCallsign(factionName);
    
    return {
      firstName,
      lastName,
      gender,
      callsign: pilotCallsign,
      fullName: generateFullPilotName(firstName, lastName, pilotCallsign)
    };
  }
}

// Функция для генерации пилота с смешанными правилами и заданным полом
export function generateMixedRulesPilotWithGender(
  factionName: string,
  gender: Gender,
  scandinavianChance: number = 0.4,
  clanChance: number = 0.6,
  warriorNameChance: number = 0.2,
  warriorNames: string[] = [],
  callsignChance: number = 0.15,
  callsign?: string
) {
  // Определяем, какие правила применять
  const useClanRules = Math.random() < clanChance;
  
  if (useClanRules) {
    // Клановые правила: имя из европейских культур, редкие фамилии и позывные
    const europeanCultures: CultureKey[] = ['ANGLO_SAXON', 'GERMAN', 'SCANDINAVIAN', 'MEDITERRANEAN'];
    const firstNameCulture = europeanCultures[Math.floor(Math.random() * europeanCultures.length)];
    
    const { firstName } = getRandomNameWithGender(firstNameCulture, gender);
    
    // Определяем, будет ли у пилота воинская фамилия
    const hasWarriorName = Math.random() < warriorNameChance;
    const lastName = hasWarriorName && warriorNames.length > 0 
      ? warriorNames[Math.floor(Math.random() * warriorNames.length)]
      : '';
    
    // Определяем, будет ли у пилота позывной
    const hasCallsign = Math.random() < callsignChance;
    const pilotCallsign = hasCallsign ? (callsign || getFactionThemedCallsign(factionName)) : '';
    
    return {
      firstName,
      lastName,
      gender,
      callsign: pilotCallsign,
      fullName: generateFullPilotName(firstName, lastName, pilotCallsign)
    };
  } else {
    // Скандинавские правила: скандинавское имя, всегда фамилия, всегда позывной
    const { firstName, lastName } = getRandomNameWithGender('SCANDINAVIAN', gender);
    const pilotCallsign = callsign || getFactionThemedCallsign(factionName);
    
    return {
      firstName,
      lastName,
      gender,
      callsign: pilotCallsign,
      fullName: generateFullPilotName(firstName, lastName, pilotCallsign)
    };
  }
}
