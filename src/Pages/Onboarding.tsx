import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Login from '../Modal/userModal/Login';
import Register from '../Modal/userModal/Register';

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
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="mb-4 text-4xl font-bold text-blue-600">온보딩 페이지</h1>
      <div className="flex flex-col items-center justify-center gap-4">
        {/* 로그인 버튼 */}
        <button onClick={openLoginModal} className="px-4 py-2 text-white bg-blue-500 rounded">
          로그인
        </button>
        {/* 회원가입 버튼 */}
        <button onClick={openRegisterModal} className="px-4 py-2 text-white bg-blue-500 rounded">
          회원가입
        </button>
        <button onClick={() => navigate('/main')} className="px-4 py-2 text-white bg-blue-500 rounded">
          메인페이지
        </button>
      </div>

      {/* 로그인 모달 */}
      {isLoginModalOpen && <Login onClose={closeLoginModal} onOpenRegister={openRegisterModal} />}

      {/* 회원가입 모달 */}
      {isRegisterModalOpen && <Register onClose={closeRegisterModal} />}
    </div>
  )
}

export default OnboardingPage
