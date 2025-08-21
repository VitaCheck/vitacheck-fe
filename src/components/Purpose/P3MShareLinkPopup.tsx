import React, { useState } from 'react';
import ShareModal from './P3DShareModal';

interface ShareLinkPopupProps {
  onClose: () => void;
  supplementUrl: string;
}

const ShareLinkPopup: React.FC<ShareLinkPopupProps> = ({ onClose, supplementUrl }) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(supplementUrl)
      .then(() => {
        setIsShareModalOpen(true);
      })
      .catch((err) => {
        console.error('링크 복사 실패:', err);
        alert('링크 복사에 실패했습니다.');
      });
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false); // 모달을 닫고
    onClose(); // ShareLinkPopup도 닫습니다.
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
    <>
      <div
        className="fixed inset-0 flex items-end justify-center z-50 bg-gray-800/50"
        onClick={handleBackgroundClick} // 배경 클릭 이벤트
      >
        <div
          className="bg-white rounded-t-4xl shadow-lg relative w-full text-center"
          onClick={handlePopupClick} // 팝업 내부 클릭 이벤트 버블링 방지
        >
          <div className="flex flex-col items-start">
            <div className='ml-[32px]'>
              <h2 className="text-[22px] mt-[20px] font-semibold mb-[4px]">공유하기</h2>
            </div>
            <div className='ml-[32px]'>
              <button
              onClick={handleCopyLink}
              className="w-full py-2 flex items-center h-[90px] gap-[22px] text-black cursor-pointer"
            >
              <img
                src="/images/PNG/MainPurpose/kakaotalk.png"
                alt="카카오톡이미지"
                className="rounded-full w-[50px] h-[50px]"
              />
              <span className="text-[18px] font-medium">카카오톡으로 공유하기</span>
            </button>
            </div>

            <div className='border-[#C7C7C7] w-full border-[0.3px]' />

            <div className='ml-[32px]'>
              <button
                onClick={handleCopyLink}
                className="w-full py-2 flex items-center h-[90px] gap-[22px] text-black cursor-pointer"
              >
                <img
                  src="/images/PNG/성분 2-1/link.png"
                  alt="링크이미지"
                  className="rounded-full w-[50px] h-[50px]"
                />
                <span className="text-[18px] font-medium">링크 복사하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <ShareModal isOpen={isShareModalOpen} onClose={handleCloseShareModal} />
    </>
  );
};

export default ShareLinkPopup;
