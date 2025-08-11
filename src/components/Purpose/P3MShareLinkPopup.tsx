import React from 'react';

interface ShareLinkPopupProps {
  onClose: () => void;
  supplementUrl: string;
}

const ShareLinkPopup: React.FC<ShareLinkPopupProps> = ({ onClose, supplementUrl }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(supplementUrl)
      .then(() => {
        alert('링크가 클립보드에 복사되었습니다.');
        onClose();
      })
      .catch((err) => {
        console.error('링크 복사 실패:', err);
        alert('링크 복사에 실패했습니다.');
      });
  };

  // 배경 클릭 시 팝업 닫기
  const handleBackgroundClick = () => {
    onClose();
  };

  // 팝업 내부 클릭 시 이벤트 버블링 방지
  const handlePopupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 flex items-end justify-center z-50 bg-gray-800/50"
      onClick={handleBackgroundClick} // 배경 클릭 이벤트
    >
      <div
        className="bg-white h-[250px] rounded-t-4xl shadow-lg relative w-full text-center"
        onClick={handlePopupClick} // 팝업 내부 클릭 이벤트 버블링 방지
      >
        <div className="px-[50px] flex flex-col items-start">
          <h2 className="text-[22px] mt-[20px] ml-[32px] font-semibold mb-[4px]">공유하기</h2>
          <button
            onClick={handleCopyLink}
            className="w-full py-2 flex justify-center  text-black cursor-pointer"
          >
            <img
              src="/images/PNG/MainPurpose/kakaotalk.png"
              alt="카카오톡이미지"
              className="rounded-full w-[50px] h-[50px]"
            />
            <span className="text-[18px] font-medium">카카오톡으로 공유하기</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="w-full py-2 flex justify-center text-black cursor-pointer"
          >
            <img
              src="dd"
              alt="링크"
              className="rounded-full w-[50px] h-[50px]"
            />
            <span className="text-[18px] font-medium">링크 복사하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareLinkPopup;
