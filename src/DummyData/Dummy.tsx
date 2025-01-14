type DummyItem = {
  profile: string
  name: string
  memo: string
  time: string
  category: string[] // 카테고리를 배열로 정의
}

const dummyData: DummyItem[] = [
  {
    profile: 'https://via.placeholder.com/50',
    name: '이연규',
    memo: '누구누구랑 밥을 먹었다. 맛있었다. 근데 지금도 배가 고프다',
    time: '2025-01-13 10:00',
    category: ['프론트앤드', '리더', '친구', '테커'],
  },
  {
    profile: 'https://via.placeholder.com/50',
    name: '김기수',
    memo: 'Had a meeting with Jane about project updates.',
    time: '2025-01-13 12:30',
    category: ['백앤드', '친구'],
  },
  {
    profile: 'https://via.placeholder.com/50',
    name: '김지민',
    memo: 'Discussed marketing strategies with Alice.',
    time: '2025-01-12 15:00',
    category: ['백앤드', '친구'],
  },
  {
    profile: 'https://via.placeholder.com/50',
    name: '이윤서',
    memo: 'Lunch with Bob at the new Italian restaurant.',
    time: '2025-01-12 13:00',
    category: ['백앤드', 'DevOps', '친구', '테커'],
  },
  {
    profile: 'https://via.placeholder.com/50',
    name: '정병권',
    memo: 'Reviewed the design drafts Emily sent over.',
    time: '2025-01-11 16:45',
    category: ['프론트앤드', '친구'],
  },
  {
    profile: 'https://via.placeholder.com/50',
    name: '최우민',
    memo: 'Reviewed the design drafts Emily sent over.',
    time: '2025-01-11 16:45',
    category: ['백앤드', '친구'],
  },
]

export default dummyData
