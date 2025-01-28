import React, { useState, useRef } from 'react';
import axios from 'axios';

interface NodImgProps {
  nodeImg?: string; // 초기 프로필 이미지
  nodeId: number; // 부모 컴포넌트에서 전달받은 node_id
  onImageUpload: (newImageUrl: string) => void; // 업로드 완료 시 콜백
}

const NodImg: React.FC<NodImgProps> = ({ nodeImg, nodeId, onImageUpload }) => {
  const [currentImg, setCurrentImg] = useState(nodeImg);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      console.log('선택된 파일:', selectedFile);

      const formData = new FormData();
      formData.append('image', selectedFile); // 서버의 요구 사항에 따라 설정
      formData.append('node_id', nodeId.toString()); // node_id를 문자열로 추가
      console.log('FormData 내용:', Array.from(formData.entries()));

      try {
        console.log('이미지 업로드 요청 시작...');
        const response = await axios.post(
          'http://localhost:8000/node/add-image',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        console.log('서버 응답:', response.data);

        const uploadedImageUrl = response.data.image_url; // 서버에서 반환된 이미지 URL
        setCurrentImg(uploadedImageUrl); // 로컬 상태 업데이트
        onImageUpload(uploadedImageUrl); // 부모 컴포넌트에 전달
        console.log('업로드된 이미지 URL:', uploadedImageUrl);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('서버 응답 에러:', error.response?.data || error.message); // 서버 에러 디버깅
        } else if (error instanceof Error) {
          console.error('요청 중 일반 에러 발생:', error.message); // 기타 에러 디버깅
        } else {
          console.error('알 수 없는 에러:', error);
        }
      }
    } else {
      console.log('파일이 선택되지 않았습니다.');
    }
  };

  const handleImageClick = () => {
    console.log('이미지 클릭됨. 파일 선택 창 열기...');
    if (fileInputRef.current) {
      fileInputRef.current.click(); // input type="file" 클릭 트리거
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="flex items-center justify-center overflow-hidden bg-gray-300 border-4 rounded-full cursor-pointer h-36 w-36"
        onClick={handleImageClick} // 이미지를 클릭하면 파일 선택 창 열기
      >
        {currentImg ? (
          <img src={currentImg} alt={`${nodeId} Profile`} className="object-cover w-full h-full" />
        ) : (
          <img src="/path/to/default-image.png" alt="Default Profile" className="object-cover w-full h-full" />
        )}
      </div>
      {/* 숨겨진 파일 선택 input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef} // ref를 이용해 제어
        style={{ display: 'none' }} // input 숨김
      />
    </div>
  );
};

export default NodImg;
