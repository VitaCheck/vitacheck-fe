// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Tesseract from "tesseract.js";
// import mainalbum from "../assets/mainalbum.svg";
// import maincamera from "../assets/maincamera.svg";
// import mainwrite from "../assets/mainwrite.svg";
// import camerabutton from "../assets/camerabutton.svg";

// interface SearchOptionsModalProps {
//   onClose: () => void;
// }

// const SearchOptionsModal = ({ onClose }: SearchOptionsModalProps) => {
//   const navigate = useNavigate();
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [showCameraFullScreen, setShowCameraFullScreen] = useState(false);
//   const [stream, setStream] = useState<MediaStream | null>(null);
//   const [recognizedText, setRecognizedText] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, []);

//   useEffect(() => {
//     if (showCameraFullScreen && videoRef.current && stream) {
//       videoRef.current.srcObject = stream;
//     }
//   }, [showCameraFullScreen, stream]);

//   const handleDirectInput = () => {
//     navigate("/search");
//     onClose();
//   };

//   const handleCameraClick = async () => {
//     try {
//       const mediaStream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: "environment" },
//       });
//       setStream(mediaStream);
//       setShowCameraFullScreen(true);
//     } catch (err) {
//       console.error("카메라 접근 오류:", err);
//       alert("카메라에 접근할 수 없습니다.");
//     }
//   };

//   const handleCaptureAndRecognize = async () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");
//     if (!context) return;

//     const scale = 2.5;
//     const width = video.videoWidth;
//     const height = video.videoHeight;

//     canvas.width = width * scale;
//     canvas.height = height * scale;
//     context.scale(scale, scale);
//     context.drawImage(video, 0, 0, width, height);

//     const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
//     const data = imageData.data;
//     for (let i = 0; i < data.length; i += 4) {
//       const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
//       const contrast = gray > 128 ? gray + 50 : gray - 50;
//       const value = Math.max(0, Math.min(contrast, 255));
//       data[i] = data[i + 1] = data[i + 2] = value;
//     }
//     context.putImageData(imageData, 0, 0);

//     const imageDataUrl = canvas.toDataURL("image/png");

//     setIsLoading(true);
//     setRecognizedText(null);

//     try {
//       const { data } = await Tesseract.recognize(imageDataUrl, "kor", {
//         logger: (m) => console.log(m),
//       });

//       // 정확한 구조로 lines 추출
//       const allLines: string[] = [];
//       data.blocks?.forEach((block) => {
//         block.paragraphs?.forEach((para) => {
//           para.lines?.forEach((line) => {
//             const text = line.words?.map((w) => w.text).join(" ");
//             if (text) allLines.push(text);
//           });
//         });
//       });

//       const maxLine = allLines.reduce(
//         (a, b) => (b.length > a.length ? b : a),
//         ""
//       );
//       setRecognizedText(maxLine || data.text.trim());
//     } catch (err) {
//       console.error("OCR 실패:", err);
//       alert("문자 인식에 실패했습니다.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const renderCameraView = () => (
//     <div className="fixed inset-0 bg-black z-50 flex flex-col">
//       <div className="flex justify-between items-center px-4 py-3 text-white text-sm">
//         <span>카메라</span>
//         <button
//           onClick={() => {
//             setShowCameraFullScreen(false);
//             setRecognizedText(null);
//             stream?.getTracks().forEach((track) => track.stop());
//           }}
//           className="text-2xl"
//         >
//           ✕
//         </button>
//       </div>

//       <div className="relative flex-1">
//         <video
//           ref={videoRef}
//           autoPlay
//           playsInline
//           className="absolute inset-0 w-full h-full object-cover"
//         />
//         <canvas ref={canvasRef} className="hidden" />
//       </div>

//       <div className="flex flex-col items-center gap-3 py-4 bg-black">
//         <img
//           src={camerabutton}
//           alt="촬영"
//           className="w-[70px] h-[70px] cursor-pointer"
//           onClick={handleCaptureAndRecognize}
//         />
//         {isLoading && (
//           <p className="text-white text-sm animate-pulse">문자 인식 중...</p>
//         )}
//         {recognizedText && (
//           <p className="text-white text-sm text-center px-4 whitespace-pre-wrap">
//             {recognizedText}
//           </p>
//         )}
//       </div>
//     </div>
//   );

//   if (showCameraFullScreen) return renderCameraView();

//   return (
//     <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
//       <div className="bg-white w-full rounded-t-2xl px-6 pt-6 pb-6 animate-slide-up">
//         <h2 className="text-[20px] font-semibold mb-6">제품 검색하기</h2>

//         <div className="space-y-4">
//           <div
//             className="flex items-center space-x-4 cursor-pointer"
//             onClick={handleCameraClick}
//           >
//             <img src={maincamera} alt="카메라" className="w-[35px] h-[35px]" />
//             <span className="text-[15px] text-black">카메라로 촬영하기</span>
//           </div>

//           <div className="flex items-center space-x-4">
//             <img src={mainalbum} alt="앨범" className="w-[35px] h-[35px]" />
//             <span className="text-[15px] text-black">
//               사진 앨범에서 선택하기
//             </span>
//           </div>

//           <div
//             className="flex items-center space-x-4 cursor-pointer sm:hidden"
//             onClick={handleDirectInput}
//           >
//             <img src={mainwrite} alt="직접입력" className="w-[35px] h-[35px]" />
//             <span className="text-[15px] text-black">직접 입력하기</span>
//           </div>
//         </div>
//       </div>

//       <div className="absolute inset-0 z-[-1]" onClick={onClose}></div>
//     </div>
//   );
// };

// export default SearchOptionsModal;

// import Tesseract from "tesseract.js";

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import mainalbum from "../assets/mainalbum.svg";
import maincamera from "../assets/maincamera.svg";
import mainwrite from "../assets/mainwrite.svg";
import camerabutton from "../assets/camerabutton.svg";

const OCR_URL = import.meta.env.VITE_CLOVA_OCR_URL as string;
const OCR_SECRET = import.meta.env.VITE_CLOVA_OCR_SECRET as string;

interface SearchOptionsModalProps {
  onClose: () => void;
}

const SearchOptionsModal = ({ onClose }: SearchOptionsModalProps) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCameraFullScreen, setShowCameraFullScreen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (showCameraFullScreen && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [showCameraFullScreen, stream]);

  const handleDirectInput = () => {
    navigate("/search");
    onClose();
  };

  const handleCameraClick = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(mediaStream);
      setShowCameraFullScreen(true);
    } catch (err) {
      console.error("카메라 접근 오류:", err);
      alert("카메라에 접근할 수 없습니다.");
    }
  };

  // CLOVA OCR 호출 함수
  const callClovaOcr = async (base64Png: string) => {
    // dataURL -> base64 본문만 추출
    const pureBase64 = base64Png.split(",")[1];

    const payload = {
      version: "V2",
      requestId: crypto.randomUUID(),
      timestamp: Date.now(),
      lang: "ko",
      images: [
        {
          format: "png",
          name: "shot",
          data: pureBase64,
        },
      ],
    };

    const res = await fetch(OCR_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-OCR-SECRET": OCR_SECRET,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`CLOVA OCR 실패: ${res.status} ${text}`);
    }

    type OcrField = { inferText: string };
    type OcrResponse = {
      images?: Array<{
        fields?: OcrField[];
      }>;
    };

    const json: OcrResponse = await res.json();
    const fields = json.images?.[0]?.fields ?? [];
    // 줄 단위로 합치고 가장 긴 줄이나 전체 합치기 등 필요 시 조정
    const joined = fields
      .map((f) => f.inferText)
      .join(" ")
      .trim();
    return joined;
  };

  const handleCaptureAndRecognize = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    // 전처리(그레이/콘트라스트)는 그대로 유지
    const scale = 2.5;
    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width * scale;
    canvas.height = height * scale;
    context.scale(scale, scale);
    context.drawImage(video, 0, 0, width, height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const contrast = gray > 128 ? gray + 50 : gray - 50;
      const value = Math.max(0, Math.min(contrast, 255));
      data[i] = data[i + 1] = data[i + 2] = value;
    }
    context.putImageData(imageData, 0, 0);

    const imageDataUrl = canvas.toDataURL("image/png");

    setIsLoading(true);
    setRecognizedText(null);

    try {
      const text = await callClovaOcr(imageDataUrl);
      setRecognizedText(text);
    } catch (err) {
      console.error("OCR 실패:", err);
      alert("문자 인식에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderCameraView = () => (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex justify-between items-center px-4 py-3 text-white text-sm">
        <span>카메라</span>
        <button
          onClick={() => {
            setShowCameraFullScreen(false);
            setRecognizedText(null);
            stream?.getTracks().forEach((track) => track.stop());
          }}
          className="text-2xl"
        >
          ✕
        </button>
      </div>

      <div className="relative flex-1">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex flex-col items-center gap-3 py-4 bg-black">
        <img
          src={camerabutton}
          alt="촬영"
          className="w-[70px] h-[70px] cursor-pointer"
          onClick={handleCaptureAndRecognize}
        />
        {isLoading && (
          <p className="text-white text-sm animate-pulse">문자 인식 중...</p>
        )}
        {recognizedText && (
          <p className="text-white text-sm text-center px-4 whitespace-pre-wrap">
            {recognizedText}
          </p>
        )}
      </div>
    </div>
  );

  if (showCameraFullScreen) return renderCameraView();

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="bg-white w-full rounded-t-2xl px-6 pt-6 pb-6 animate-slide-up">
        <h2 className="text-[20px] font-semibold mb-6">제품 검색하기</h2>

        <div className="space-y-4">
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={handleCameraClick}
          >
            <img src={maincamera} alt="카메라" className="w-[35px] h-[35px]" />
            <span className="text-[15px] text-black">카메라로 촬영하기</span>
          </div>

          <div className="flex items-center space-x-4">
            <img src={mainalbum} alt="앨범" className="w-[35px] h-[35px]" />
            <span className="text-[15px] text-black">
              사진 앨범에서 선택하기
            </span>
          </div>

          <div
            className="flex items-center space-x-4 cursor-pointer sm:hidden"
            onClick={handleDirectInput}
          >
            <img src={mainwrite} alt="직접입력" className="w-[35px] h-[35px]" />
            <span className="text-[15px] text-black">직접 입력하기</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-[-1]" onClick={onClose}></div>
    </div>
  );
};

export default SearchOptionsModal;
