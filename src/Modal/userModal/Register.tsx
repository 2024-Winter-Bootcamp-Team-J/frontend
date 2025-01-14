import React, { useState } from "react";

interface RegisterProps {
  onClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ onClose }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // 이미지 업로드 핸들러
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-customColor bg-opacity-70">
      <div className="bg-black rounded-[40px] shadow-lg w-[700px] h-[460px] p-8 flex flex-col relative">
        {/* 엑스 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-[20px] right-[20px] text-sm text-white hover:text-white"
        >
          ✖︎
        </button>

        {/* 모달 제목 */}
        <h2 className="absolute top-[80px] left-[160px] text-xl font-bold text-white">로고</h2>

        {/* 메인 컨텐츠: 입력 폼과 프로필 사진 영역을 포함 */}
        <div className="flex flex-row gap-8">
          {/* 왼쪽: 입력 폼 */}
          <div className="w-1/2 flex flex-col items-center">
            <form className="flex flex-col items-center w-full">
              {/* 이메일 입력 */}
              <div className="mb-4 w-full">
                <input
                  type="email"
                  id="email"
                  placeholder="email"
                  className="absolute top-[165px] left-[50px] w-[280px] h-[40px] p-4 rounded-[20px] bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              {/* 비밀번호 입력 */}
              <div className="mb-4 w-full">
                <input
                  type="password"
                  id="password"
                  placeholder="password"
                  className="absolute top-[230px] left-[50px] w-[280px] h-[40px] p-4 rounded-[20px] bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              {/* 비밀번호 확인 */}
              <div className="mb-6 w-full">
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="repeat"
                  className="absolute top-[280px] left-[50px] w-[280px] h-[40px] p-4 rounded-[20px] bg-customColor2 focus:outline-none focus:ring focus:ring-blue-300"
                />
              </div>

              {/* 회원가입 버튼 */}
              <button
                type="submit"
                className="absolute top-[390px] left-[160px] text-white"
              >
                회원가입
              </button>
            </form>
          </div>

          {/* 오른쪽: 프로필 사진 업로드 영역 */}
          <div className="w-1/2 flex flex-col items-center justify-center">
            {/* 동그란 이미지 미리보기 */}
            <div className="relative top-[90px] left-[10px] w-[180px] h-[180px] mb-4 mt-2">
              {/* 이미지가 있으면 미리보기, 없으면 기본 텍스트 */}
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-500 bg-gray-400">
              </div>
            </div>

            {/* 사진 첨부 버튼 */}
            <label
              htmlFor="profileUpload"
              className="absolute top-[390px] left-[500px] text-white rounded cursor-pointer"
            >
              사진 첨부
            </label>
            {/* 실제 파일 업로드 입력 (숨김 처리) */}
            <input
              id="profileUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
