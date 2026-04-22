export const languages = {
  ko: '한국어',
} as const;

export type Language = keyof typeof languages;

export const defaultLang = 'ko';

export const ui = {
  ko: {
    '404.desc': '관련된 문서를 찾을 수 없습니다.',
    'nav.title': '나의 공간',
    'nav.writing': '개발 일기',
    'nav.writing.desc': '개발하면서 겪은 일과 배운 것',
    'nav.note': '회고',
    'nav.note.desc': '경험한 일들과 생각',
    'nav.craft': '프로젝트',
    'nav.craft.desc': '재밌게 만들어본 것',
    'footer.time': '2023-현재',
    'footer.source': '소스코드',
    'index.name': '장대한',
    'index.desc':
      `<p>웅장하고 <b>장대한</b> 프로그램을 만들고 싶습니다.</p>` +
      `<p>개발을 하면서 겪었던 일들과 경험을 틈틈이 기록하려 합니다.</p>`,
    'index.currentWork': `      <p>
      현재 <b>조그만 원룸</b>에 누워 (넷플릭스를 보며) <b>장대한 미래</b>를 그리고 있습니다.
    </p>`,
    wip: '제작 중입니다...',
  },
} satisfies Record<Language, { [key: string]: string }>;
