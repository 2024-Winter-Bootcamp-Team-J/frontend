import React, { useState, useRef } from 'react';
import axios from 'axios';
import generalP from '../../../assets/generalP.png'


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

      // 1. 파일을 로컬 미리보기 URL로 변환
      const previewUrl = URL.createObjectURL(selectedFile);
      setCurrentImg(previewUrl); // 미리보기 이미지 설정
      console.log('미리보기 이미지 URL:', previewUrl);

      // 2. FormData 생성
      const formData = new FormData();
      formData.append('node_id', nodeId.toString());
      formData.append('node_img', selectedFile);

      try {
        console.log('이미지 업로드 요청 시작...');
        const response = await axios.post(
          'http://localhost:8000/node/add-image', // API URL
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        // 3. 서버 응답 처리
        const uploadedImageUrl = response.data.image_url;
        if (uploadedImageUrl) {
          setCurrentImg(uploadedImageUrl); // 서버에서 반환된 이미지로 교체
          onImageUpload(uploadedImageUrl); // 부모 컴포넌트에 알림
          console.log('업로드된 이미지 URL:', uploadedImageUrl);
        } else {
          console.error('서버에서 image_url을 반환하지 않았습니다.');
        }
      } catch (error) {
        console.error('이미지 업로드 중 오류 발생:', error);
      } finally {
        // 4. 미리보기 URL 메모리에서 해제 (선택)
        URL.revokeObjectURL(previewUrl);
      }
    } else {
      console.log('파일이 선택되지 않았습니다.');
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 파일 선택창 열기
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="flex items-center justify-center overflow-hidden bg-gray-300 border-4 rounded-full cursor-pointer h-36 w-36"
        onClick={handleImageClick}
      >
        {currentImg ? (
          <img
            src={currentImg} // 미리보기 또는 서버 이미지 URL
            alt={`${nodeId} Profile`}
            className="object-cover w-full h-full"
            onError={() => console.error('이미지 로드 실패:', currentImg)}
          />
        ) : (
          <img
            src={generalP} // 기본 이미지
            alt="Default Profile"
            className="object-cover w-full h-full"
          />
        )}
      </div>
      {/* 숨겨진 파일 선택 input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default NodImg;
