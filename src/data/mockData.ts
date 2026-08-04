import type { Exam, Experience, CityStreetList, UsefulArticle } from '@/types';

export const mockExams: Exam[] = [
  {
    id: 'ex-001',
    date: '2026-08-12',
    city: 'Владивосток',
    examType: 'Теория',
    officialUrl: 'https://www.gibdd.ru',
    status: 'upcoming',
  },
  {
    id: 'ex-002',
    date: '2026-08-15',
    city: 'Артём',
    examType: 'Практика (город)',
    officialUrl: 'https://www.gibdd.ru',
    status: 'upcoming',
  },
  {
    id: 'ex-003',
    date: '2026-08-20',
    city: 'Владивосток',
    examType: 'Практика (город)',
    officialUrl: 'https://www.gibdd.ru',
    status: 'upcoming',
  },
  {
    id: 'ex-004',
    date: '2026-08-25',
    city: 'Уссурийск',
    examType: 'Теория',
    officialUrl: 'https://www.gibdd.ru',
    status: 'upcoming',
  },
  {
    id: 'ex-005',
    date: '2026-08-28',
    city: 'Находка',
    examType: 'Практика (площадка)',
    officialUrl: 'https://www.gibdd.ru',
    status: 'upcoming',
  },
  {
    id: 'ex-006',
    date: '2026-09-02',
    city: 'Владивосток',
    examType: 'Теория',
    officialUrl: 'https://www.gibdd.ru',
    status: 'upcoming',
  },
];

export const mockExperiences: Experience[] = [
  {
    id: 'exp-001',
    city: 'Владивосток',
    examDate: '2026-07-18',
    category: 'B',
    result: 'passed',
    experience:
      'Сдавал в районе Океанского проспекта. Инспектор был спокойный, маршрут оказался проще, чем ожидал.',
    comment: 'Главное — не торопиться на разворотах.',
    createdAt: '2026-07-19',
  },
  {
    id: 'exp-002',
    city: 'Артём',
    examDate: '2026-07-15',
    category: 'B',
    result: 'failed',
    experience:
      'Не сдал из-за непристёгнутого ремня на парковке. Остальное прошло нормально, но эта ошибка стоила экзамена.',
    comment: 'Проверяйте ремень даже на коротких манёврах.',
    createdAt: '2026-07-16',
  },
  {
    id: 'exp-003',
    city: 'Владивосток',
    examDate: '2026-07-10',
    category: 'A',
    result: 'passed',
    experience:
      'Экзамен на площадке. Все упражнения выполнил без ошибок. Упражнения были стандартные — «змейка» и «габаритный коридор».',
    createdAt: '2026-07-11',
  },
  {
    id: 'exp-004',
    city: 'Уссурийск',
    examDate: '2026-07-05',
    category: 'B',
    result: 'failed',
    experience:
      'Заглох на подъёме. Вторая попытка через неделю. Совет: отрабатывайте эстакаду до автоматизма.',
    createdAt: '2026-07-06',
  },
  {
    id: 'exp-005',
    city: 'Находка',
    examDate: '2026-06-28',
    category: 'C',
    result: 'passed',
    experience:
      'Сдавал на грузовой. Маршрут был по объездной дороге. Инспектор обращал внимание на перестроения и зеркала.',
    comment: 'Следите за зеркалами каждые 5–7 секунд.',
    createdAt: '2026-06-29',
  },
  {
    id: 'exp-006',
    city: 'Владивосток',
    examDate: '2026-06-22',
    category: 'B',
    result: 'passed',
    experience:
      'Сдал с третьей попытки. Каждый раз ошибки были мелкие, но критичные. В этот раз был максимально сосредоточен.',
    createdAt: '2026-06-23',
  },
];

export const cityStreetLists: CityStreetList[] = [
  {
    id: 'static-vl',
    city: 'Владивосток',
    title: 'Перечень улиц — Владивосток',
    url: 'https://www.gibdd.ru',
  },
  {
    id: 'static-art',
    city: 'Артём',
    title: 'Перечень улиц — Артём',
    url: 'https://www.gibdd.ru',
  },
  {
    id: 'static-other',
    city: 'Другие города',
    title: 'Перечень улиц — другие города',
    url: 'https://www.gibdd.ru',
  },
];

export const usefulArticles: UsefulArticle[] = [
  {
    slug: 'exam-process',
    title: 'Как проходит экзамен',
    description: 'Этапы экзамена: теория, площадка и город.',
    icon: 'ClipboardList',
  },
  {
    slug: 'what-to-bring',
    title: 'Что взять с собой',
    description: 'Документы и вещи, без которых не допустят.',
    icon: 'Briefcase',
  },
  {
    slug: 'before-exam',
    title: 'Что делать перед экзаменом',
    description: 'Подготовка, отдых и настрой за день до сдачи.',
    icon: 'Sunrise',
  },
  {
    slug: 'common-mistakes',
    title: 'Частые ошибки',
    description: 'За что чаще всего не сдают с первого раза.',
    icon: 'AlertTriangle',
  },
  {
    slug: 'failed-exam',
    title: 'Что делать после несдачи',
    description: 'Как не опустить руки и подготовиться заново.',
    icon: 'RotateCcw',
  },
  {
    slug: 'medical',
    title: 'Медкомиссия',
    description: 'Где проходить и какие документы нужны.',
    icon: 'Stethoscope',
  },
  {
    slug: 'faq',
    title: 'Частые вопросы',
    description: 'Ответы на популярные вопросы сдающих.',
    icon: 'HelpCircle',
  },
  {
    slug: 'how-to-choose-school',
    title: 'Как выбрать автошколу',
    description: 'Правильный выбор автошколы — фундамент безопасности.',
    icon: 'School',
  },
  {
    slug: 'how-to-choose-instructor',
    title: 'Как выбрать инструктора по вождению',
    description: 'Как найти инструктора, с которым комфортно учиться.',
    icon: 'UserCheck',
  },
];
