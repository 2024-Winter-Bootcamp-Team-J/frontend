

import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Login from '../Modal/userModal/Login';
import Register from '../Modal/userModal/Register';

import OnboardingImage from '../assets/온보딩2.png'

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);


  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const openRegisterModal = () => {
    setIsLoginModalOpen(false); // 로그인 모달 닫기
    setIsRegisterModalOpen(true); // 회원가입 모달 열기
  };
  const closeRegisterModal = () => setIsRegisterModalOpen(false);


  return (
    <div className="flex h-screen">
      {/* 왼쪽 섹션 */}
      <div className="flex flex-col justify-center items-center w-[550px] bg-black">
        {/* 로고 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">로고</h1>
        </div>
        {/* 버튼 섹션 */}
        <div className="flex flex-col gap-4 items-center">

          {/* 가로로 정렬된 로그인/회원가입 버튼 */}
          <div className="flex gap-4 mb-4">

          {/* 회원가입 버튼 */}
          <button
            onClick={openRegisterModal}
            className="px-6 py-3 text-white"
          >
            회원가입
          </button>

          {/* 작대기*/}
          <div className="py-3 text-white">|</div>

          {/* 로그인 버튼 */}
          <button
            onClick={openLoginModal}
            className="px-6 py-3 text-white"
          >
            로그인
          </button>
        </div>
          {/* 메인 페이지 이동 버튼 */}
          <button
            onClick={() => navigate('/main')}
            className="px-6 py-3 text-white"
          >
            메인페이지
          </button>
        </div>
      </div>

      {/* 오른쪽 섹션 */} <div className="w-full relative">
       <div className="h-full bg-cover bg-center relative" 
            style={{ backgroundImage: ` linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 1) 100%), url(${OnboardingImage})`, }} ></div> {/* 아래 추가 섹션 */} 
       <div className="absolute bottom-0 left-0 h-[230px] w-full flex flex-col items-start justify-center z-10"
            style={{paddingLeft:"50px"}}
       >

        <h2 className="text-white text-5xl mb-2">한눈에 보이는 나만의 관계도</h2> <br />
        <h1 className="text-white text-xl">노드 간의 연결을 통해 관계를 시각적으로 표현합니다.<br />잊기 쉬운 사람도 한눈에 기억하세요.</h1>

       </div> 
       </div>

      {/* 로그인 모달 */}
      {isLoginModalOpen && (
        <Login onClose={closeLoginModal} onOpenRegister={openRegisterModal} />
      )}

      {/* 회원가입 모달 */}
      {isRegisterModalOpen && <Register onClose={closeRegisterModal} />}
    </div>
  );
};

export default OnboardingPage;
