// 개인 정보 — 이곳을 수정하면 홈 화면 소개가 바뀝니다.
export const profile = {
  name: 'Jang Dae Han',

  // 소개 문단 (Dario Amodei 사이트처럼 서술형 소개)
  intro: [
    '안녕하세요. 저는 AI를 활용한 제품을 만드는 데 관심이 많습니다. AI가 더 유용하고 신뢰할 수 있는 방향으로 나아가기 위해, 평가와 통제의 방법을 공부하고 있습니다.',
    '현재 우아한테크코스에서 학습하며, JVM의 동작 원리부터 객체지향 설계, 페어 프로그래밍과 코드 리뷰까지 개발자로서의 기본기를 다지고 있습니다.',
    '유명한 슬로건에 기대어 생각을 멈추기보다, 맥락과 근거를 스스로 고민하는 태도를 지키려 합니다.',
  ],

  // 이력 / 학력 / 자격증 — 필요에 맞게 수정하세요.
  facts: [
    { label: '교육', value: '우아한테크코스 (Backend)' },
    { label: '관심 분야', value: 'AI 제품 · 평가 · 통제' },
    { label: '경험', value: '안드로이드 프로젝트, 페어 프로그래밍' },
  ],

  awards: [
    {
      title: '교내 해커톤 우수상',
      event: '2025 교내 해커톤',
      summary: 'MCP로 금융 정보를 연동하고, 음성 제어로 금융 접근성을 높이려는 아이디어를 시도했습니다.',
      href: 'https://news.unn.net/news/articleView.html?idxno=579686',
    },
  ],

  // 외부 링크 섹션 (선택). href를 채우면 홈에 "Links" 섹션이 노출됩니다.
  links: [
    { label: 'GitHub', href: 'https://github.com/aksworns22' },
    // { label: 'Email', href: 'mailto:wkdeogks17@gmail.com' },
  ],
}
