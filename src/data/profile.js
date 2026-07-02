// 개인 정보 — 이곳을 수정하면 홈 화면 소개가 바뀝니다.
export const profile = {
  name: 'Jang Dae Han',

  // 소개 문단 (Dario Amodei 사이트처럼 서술형 소개)
  intro: [
    '장대한은 더 나은 코드와 더 나은 협업을 고민하는 백엔드/소프트웨어 개발자입니다. 언어의 문법을 아는 데서 멈추지 않고, 코드가 **어떻게** 동작하고 **왜** 그렇게 써야 하는지를 파고드는 것을 좋아합니다.',
    '현재 우아한테크코스에서 학습하며, JVM의 동작 원리부터 객체지향 설계, 페어 프로그래밍과 코드 리뷰까지 개발자로서의 기본기를 다지고 있습니다.',
    '유명한 슬로건에 기대어 생각을 멈추기보다, 맥락과 근거를 스스로 고민하는 태도를 지키려 합니다.',
  ],

  // 이력 / 학력 / 자격증 — 필요에 맞게 수정하세요.
  facts: [
    { label: '교육', value: '우아한테크코스 (Backend)' },
    { label: '관심 분야', value: '객체지향 설계 · 협업 · 코드 리뷰' },
    { label: '경험', value: '안드로이드 프로젝트, 페어 프로그래밍' },
  ],

  awards: [
    {
      title: '교내 해커톤 우수상',
      event: 'The Pay언한 핀테크 서비스 해커톤',
      date: '2025',
      summary:
        'MCP 초기 생태계에서 이체 정보 등 금융 정보를 연결하고, 음성 기반 제어로 사회취약계층의 금융 접근성을 높이는 서비스를 만들었습니다.',
      href: 'https://news.unn.net/news/articleView.html?idxno=579686',
    },
  ],

  // 외부 링크 섹션 (선택). href를 채우면 홈에 "Links" 섹션이 노출됩니다.
  links: [
    { label: 'GitHub', href: 'https://github.com/aksworns22' },
    // { label: 'Email', href: 'mailto:wkdeogks17@gmail.com' },
  ],
}
