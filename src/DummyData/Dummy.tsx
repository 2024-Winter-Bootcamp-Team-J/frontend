import UserIcon from '../../src/assets/UserIcon.png' // UserIcon.png 이미지 경로를 import

type DummyItem = {
  profile: string
  name: string
  memo: string
  time: string
  category: string[] // 카테고리를 배열로 정의
}

const dummyData: DummyItem[] = [
  {
    profile: UserIcon,
    name: '바비',
    memo: '누구누구랑 밥을 먹었다. 맛있었다. 근데 지금도 배가 고프다',
    time: '2025-01-13 12:30',
    category: ['친구'],
  },
  {
    profile: UserIcon,
    name: '연규',
    memo: '누구누구랑 밥을 먹었다. 맛있었다. 근데 지금도 배가 고프다',
    time: '2025-01-12 15:00',
    category: ['게임', '친구'],
  },
  {
    profile: UserIcon,
    name: '우민',
    memo: '누구누구랑 밥을 먹었다. 맛있었다. 근데 지금도 배가 고프다',
    time: '2025-01-12 13:00',
    category: ['친구'],
  },
  {
    profile: UserIcon,
    name: '홍길동',
    memo: '오늘 홍길동과 PC방에 가서 게임을 하고 같이 육회 비빔밥을 먹었다.',
    time: '2025-01-11 16:45',
    category: ['게임', '친구'],
  },
  {
    profile: UserIcon,
    name: '얼룩이',
    memo: '누구누구랑 밥을 먹었다. 맛있었다. 근데 지금도 배가 고프다',
    time: '2025-01-11 16:45',
    category: ['직장', '친구'],
  },
  {
    profile: UserIcon,
    name: '철수',
    memo: '누구누구랑 밥을 먹었다. 맛있었다. 근데 지금도 배가 고프다',
    time: '2025-01-11 16:45',
    category: ['직장', '친구'],
  },
  {
    profile: UserIcon,
    name: '영희',
    memo: '누구누구랑 밥을 먹었다. 맛있었다. 근데 지금도 배가 고프다',
    time: '2025-01-11 16:45',
    category: ['대학교', '게임'],
  },
]

export default dummyData
