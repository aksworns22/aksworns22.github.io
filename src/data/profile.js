// 개인 정보 — 이곳을 수정하면 홈 화면 소개가 바뀝니다.
export const profile = {
  name: 'Jang Dae Han',

  // 소개 문단 (Dario Amodei 사이트처럼 서술형 소개)
  intro: [
    '저는 AI를 활용한 제품을 만드는 데 관심이 많습니다. AI가 더 유용하고 신뢰할 수 있는 방향으로 나아가기 위한 좋은 평가와 검증 방법을 공부하고 있습니다.',
  ],

  education: [
    { label: '광운대학교', value: '컴퓨터정보공학과 · 3.82/4.5' },
    { label: '우아한테크코스 8기', value: '안드로이드' },
    { label: '신세계리테일테크 코딩교실', value: '2024 · 6개월 교육봉사 활동' },
  ],

  awards: [
    {
      title: '교내 해커톤 우수상',
      event: 'The Pay언한 핀테크 서비스 해커톤',
      summary: 'MCP로 금융 정보를 연동하고, 음성 제어로 금융 접근성을 높이려는 아이디어를 시도',
      href: 'https://news.unn.net/news/articleView.html?idxno=579686',
    },
  ],

  // 외부 링크 섹션 (선택). href를 채우면 홈에 "Links" 섹션이 노출됩니다.
  links: [
    { label: 'GitHub', href: 'https://github.com/aksworns22' },
    // { label: 'Email', href: 'mailto:wkdeogks17@gmail.com' },
  ],
}
