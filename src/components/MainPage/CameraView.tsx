import { useEffect, useRef } from "react";

interface CameraViewProps {
  onClose: () => void;
}

const CameraView = ({ onClose }: CameraViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        alert("카메라 접근에 실패했습니다.");
        console.error(err);
      }
    };

    startCamera();

    return () => {
      // 종료 시 카메라 정지
      const tracks =
        videoRef.current?.srcObject &&
        (videoRef.current.srcObject as MediaStream).getTracks();
      tracks?.forEach((track) => track.stop());
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col justify-between items-center">
      {/* 상단 바 */}
      <div className="w-full text-white text-sm py-2 px-4 flex justify-between items-center">
        <span>카메라</span>
        <button
          onClick={onClose}
          className="text-2xl leading-none cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* 비디오 프리뷰 */}
      <div className="w-full h-full flex-1 flex justify-center items-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* 하단 버튼 */}
      <div className="w-full flex justify-center items-center gap-10 pb-6">
        {/* <button className="text-white text-2xl">📷</button> */}

        <button className="w-[70px] h-[70px] rounded-full border-4 border-white bg-yellow-400" />

        {/* <button className="text-white text-2xl">🔄</button> */}
      </div>
    </div>
  );
};

export default CameraView;
