import React, { useState, useEffect } from 'react';
import ShareModal from './P3DShareModal';
import link from "@/assets/link/link.png";
import kakaolink from "@/assets/link/kakaolink.png";

interface ShareLinkPopupProps {
  onClose: () => void;
  supplementUrl: string;
  supplementImageUrl?: string;
  supplementName?: string;
}

const ShareLinkPopup: React.FC<ShareLinkPopupProps> = ({
  onClose,
  supplementUrl,
  supplementImageUrl,
  supplementName
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  // Kakao SDK 초기화
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init("2d08e54fea8b27677dfe77d5719f8d23");
        console.log("Kakao SDK initialized:", window.Kakao.isInitialized());
        setKakaoLoaded(true);
      }
    };
    document.body.appendChild(script);
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(supplementUrl)
      .then(() => setIsShareModalOpen(true))
      .catch(err => alert("링크 복사에 실패했습니다."));
  };

  const handleCloseShareModal = () => {
    setIsShareModalOpen(false);
    onClose();
  };

  // 카카오톡 공유
  const handleKakaoShare = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      alert("카카오 SDK가 준비되지 않았습니다.");
      return;
    }

    try {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: supplementName || "추천 영양제",
          description: "이 영양제를 VitaCheck에서 확인해보세요!",
          imageUrl: supplementImageUrl || "https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png",
          link: {
            mobileWebUrl: supplementUrl,
            webUrl: supplementUrl,
          },
        },
        buttons: [
          {
            title: "자세히 보기",
            link: {
              mobileWebUrl: supplementUrl,
              webUrl: supplementUrl,
            },
          },
        ],
      });
    } catch (err) {
      console.error(err);
      alert("공유 실패: 데스크탑 브라우저에서는 카카오톡 앱을 열 수 없습니다.");
    }
  };

  const handleBackgroundClick = () => onClose();
  const handlePopupClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <>
      <div
        className="fixed inset-0 flex items-end justify-center z-50 bg-gray-800/50"
        onClick={handleBackgroundClick}
      >
        <div
          className="bg-white rounded-t-4xl shadow-lg relative w-full text-center"
          onClick={handlePopupClick}
        >
          <div className="flex flex-col items-start">
            <div className="ml-[32px]">
              <h2 className="text-[22px] mt-[20px] font-semibold mb-[4px]">공유하기</h2>
            </div>

            {/* 카카오톡 공유 */}
            <div className="ml-[32px]">
              <button
                onClick={handleKakaoShare}
                className="w-full py-2 flex items-center h-[90px] gap-[22px] text-black cursor-pointer"
              >
                <img src={kakaolink} alt="카카오톡" className="rounded-full w-[50px] h-[50px]" />
                <span className="text-[18px] font-medium">카카오톡으로 공유하기</span>
              </button>
            </div>

            <div className="border-[#C7C7C7] w-full border-[0.3px]" />

            {/* 링크 복사 */}
            <div className="ml-[32px]">
              <button
                onClick={handleCopyLink}
                className="w-full py-2 flex items-center h-[90px] gap-[22px] text-black cursor-pointer"
              >
                <img src={link} alt="링크 복사" className="rounded-full w-[50px] h-[50px]" />
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
