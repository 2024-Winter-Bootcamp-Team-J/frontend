import React from "react";

interface LoginProps {
  onClose: () => void;
  onOpenRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onClose, onOpenRegister }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-customColor bg-opacity-70">
      <div className="bg-black rounded-[30px] shadow-lg w-[350px] h-[402px] p-8 flex flex-col relative">
        <h2 className="mb-4 text-xl font-bold text-white text-center mt-8">로고</h2>
        <button
          onClick={onClose}
          className="absolute top-[20px] right-[20px] text-sm text-white hover:text-white"
        >
          ✖︎
        </button>
        <form className="flex flex-col items-center justify-center mt-20">

          {/* 이메일 */}
          <div className="mb-4">
            <input
              type="email"
              id="email"
              placeholder="email"
              className="absolute top-[150px] left-[40px] w-[280px] h-[40px] p-4 rounded-[20px] bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          {/* 비밀번호 */}
          <div className="mb-4">
            <input
              type="password"
              id="password"
              placeholder="password"
              className="absolute top-[210px] left-[40px] w-[280px] h-[40px] p-4 rounded-[20px] bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
        </form>

        {/* 아이디/비번 찾기 */}
        <div className="bottom-[20px] right-[20px]">
          <button
            onClick={() => alert("아이디/비번 찾기")}
            className="absolute top-[260px] left-[220px] text-xs text-gray-500 cursor-pointer"
          >
            아이디/비번 찾기 〉
          </button>
        </div>
        {/* 회원가입 버튼 */}
        <div className="bottom-[20px] left-[20px]">
          <button
            onClick={onOpenRegister}
            className="absolute top-[340px] left-[150px] text-white text-center cursor-pointer"
          >
            회원가입
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default Login;
