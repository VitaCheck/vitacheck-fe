import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tesseract from "tesseract.js";
import mainalbum from "../assets/mainalbum.svg";
import maincamera from "../assets/maincamera.svg";
import mainwrite from "../assets/mainwrite.svg";
import camerabutton from "../assets/camerabutton.svg";

interface SearchOptionsModalProps {
  onClose: () => void;
}

/** ──────────────── Tesseract 결과 최소 타입 정의 ──────────────── */
interface BBox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}
interface Word {
  text: string;
  bbox?: BBox;
}
interface Line {
  words?: Word[];
  bbox?: BBox;
}
interface Paragraph {
  lines?: Line[];
}
interface Block {
  paragraphs?: Paragraph[];
}
interface OcrData {
  text: string;
  blocks?: Block[];
}
interface LogMessage {
  status: string;
  progress: number;
}

const SearchOptionsModal = ({ onClose }: SearchOptionsModalProps) => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const albumInputRef = useRef<HTMLInputElement>(null);

  const [showCameraFullScreen, setShowCameraFullScreen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recognizedText, setRecognizedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 스크롤 잠금
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "auto";
    };
  }, []);

  // 비디오에 스트림 주입
  useEffect(() => {
    if (showCameraFullScreen && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [showCameraFullScreen, stream]);

  // 언마운트 시 스트림 정리
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [stream]);

  const handleDirectInput = () => {
    navigate("/searchresult");
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

  /** ──────────────── 공통 텍스트 후처리 및 후보 선택 ──────────────── */
  function normalizeText(input: string) {
    const cleaned = input.replace(/[^가-힣A-Za-z0-9\s]/g, " ");
    return cleaned.replace(/\s+/g, " ").trim();
  }

  // 가장 큰 글씨(평균 단어 bbox 높이 최대) 라인 선택
  function pickLargestFontLine(data: OcrData): string | null {
    const candidates: { text: string; avgHeight: number }[] = [];

    data.blocks?.forEach((block) => {
      block.paragraphs?.forEach((para) => {
        para.lines?.forEach((line) => {
          const words = line.words ?? [];
          if (words.length === 0) return;

          const heights: number[] = [];
          const parts: string[] = [];

          words.forEach((w) => {
            if (w.text) parts.push(w.text);
            const bb = w.bbox;
            if (bb && typeof bb.y0 === "number" && typeof bb.y1 === "number") {
              heights.push(Math.abs(bb.y1 - bb.y0));
            }
          });

          const text = parts.join(" ").trim();
          if (!text) return;

          let avgHeight = 0;
          if (heights.length) {
            avgHeight = heights.reduce((a, b) => a + b, 0) / heights.length;
          } else if (line.bbox) {
            const bb = line.bbox;
            avgHeight = Math.abs(bb.y1 - bb.y0);
          }

          if (avgHeight > 0) {
            candidates.push({ text, avgHeight });
          }
        });
      });
    });

    if (!candidates.length) return null;
    candidates.sort((a, b) => b.avgHeight - a.avgHeight);
    return normalizeText(candidates[0].text);
  }

  // OCR 공통 실행 유틸 (이미지 URL/DataURL 입력)
  async function recognizeFromImage(imageSrc: string): Promise<string> {
    const { data } = await Tesseract.recognize(imageSrc, "kor+eng", {
      logger: (m: LogMessage) => console.log(m),
    } as { logger?: (m: LogMessage) => void } & Record<string, string | number | boolean>);

    const ocr = data as unknown as OcrData;

    const biggest = pickLargestFontLine(ocr);

    // 백업: 가장 긴 라인
    let fallback = "";
    const fullText = ocr?.text;
    if (fullText) {
      const lines = fullText
        .split(/\r?\n/)
        .map((s) => normalizeText(s))
        .filter(Boolean);
      fallback = lines.reduce((a, b) => (b.length > a.length ? b : a), "");
    }

    return biggest || fallback || "";
  }

  /** ──────────────── 카메라 촬영 → OCR ──────────────── */
  const handleCaptureAndRecognize = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const scale = 2.5;
    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width * scale;
    canvas.height = height * scale;

    // 스무딩 끄기
    (context as CanvasRenderingContext2D).imageSmoothingEnabled = false;

    context.scale(scale, scale);
    context.drawImage(video, 0, 0, width, height);

    // 간단 전처리(그레이스케일+대비)
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const buf = imageData.data;
    for (let i = 0; i < buf.length; i += 4) {
      const gray = 0.299 * buf[i] + 0.587 * buf[i + 1] + 0.114 * buf[i + 2];
      const contrast = gray > 128 ? gray + 50 : gray - 50;
      const v = Math.max(0, Math.min(contrast, 255));
      buf[i] = buf[i + 1] = buf[i + 2] = v;
    }
    context.putImageData(imageData, 0, 0);

    const imageDataUrl = canvas.toDataURL("image/png");

    setIsLoading(true);
    setRecognizedText(null);

    try {
      const finalText = await recognizeFromImage(imageDataUrl);
      if (!finalText) {
        setRecognizedText(null);
        alert("큰 글씨를 찾지 못했습니다. 빛 반사/흔들림을 줄여 다시 시도해 주세요.");
        return;
      }

      setRecognizedText(finalText);
      navigate(`/searchresult?query=${encodeURIComponent(finalText)}`);

      // 모달 닫기 및 스트림 정리
      onClose();
      stream?.getTracks().forEach((t) => t.stop());
      setShowCameraFullScreen(false);
      setStream(null);
    } catch (err) {
      console.error("OCR 실패:", err);
      alert("문자 인식에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  /** ──────────────── 앨범 선택 → OCR ──────────────── */
  const openAlbumPicker = () => {
    albumInputRef.current?.click();
  };

  const handleAlbumChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    // 같은 파일 재선택 가능하도록 즉시 초기화
    e.currentTarget.value = "";
    if (!file) return;

    // 모바일 EXIF 회전 문제는 브라우저가 대부분 처리하지만,
    // Tesseract는 Object URL/DataURL 모두 입력 가능하므로 URL 사용
    const objectUrl = URL.createObjectURL(file);

    setIsLoading(true);
    setRecognizedText(null);
    try {
      const finalText = await recognizeFromImage(objectUrl);
      if (!finalText) {
        alert("문자 인식 결과가 비어 있습니다. 글자가 뚜렷한 사진으로 다시 시도해 주세요.");
        return;
      }
      setRecognizedText(finalText);
      navigate(`/searchresult?query=${encodeURIComponent(finalText)}`);
      onClose();
    } catch (err) {
      console.error("앨범 OCR 실패:", err);
      alert("앨범 이미지에서 문자 인식에 실패했습니다.");
    } finally {
      setIsLoading(false);
      URL.revokeObjectURL(objectUrl);
    }
  };

  /** ──────────────── 카메라 전체 화면 뷰 ──────────────── */
  const renderCameraView = () => (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex justify-between items-center px-4 py-3 text-white text-sm">
        <span>카메라</span>
        <button
          onClick={() => {
            setShowCameraFullScreen(false);
            setRecognizedText(null);
            stream?.getTracks().forEach((track) => track.stop());
            setStream(null);
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
      {/* 숨겨진 파일 입력 (앨범용) */}
      <input
        ref={albumInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAlbumChange}
      />

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

          {/* 앨범에서 선택 → 파일 업로드 → OCR */}
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={openAlbumPicker}
          >
            <img src={mainalbum} alt="앨범" className="w-[35px] h-[35px]" />
            <span className="text-[15px] text-black">사진 앨범에서 선택하기</span>
          </div>

          <div
            className="flex items-center space-x-4 cursor-pointer sm:hidden"
            onClick={handleDirectInput}
          >
            <img src={mainwrite} alt="직접입력" className="w-[35px] h-[35px]" />
            <span className="text-[15px] text-black">직접 입력하기</span>
          </div>
        </div>

        {isLoading && (
          <p className="text-sm text-gray-500 mt-4">문자 인식 중...</p>
        )}
      </div>

      <div className="absolute inset-0 z-[-1]" onClick={onClose}></div>
    </div>
  );
};

export default SearchOptionsModal;






// // import Tesseract from "tesseract.js";

// import { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import mainalbum from "../assets/mainalbum.svg";
// import maincamera from "../assets/maincamera.svg";
// import mainwrite from "../assets/mainwrite.svg";
// import camerabutton from "../assets/camerabutton.svg";

// const OCR_URL = import.meta.env.VITE_CLOVA_OCR_URL as string;
// const OCR_SECRET = import.meta.env.VITE_CLOVA_OCR_SECRET as string;

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

//   // CLOVA OCR 호출 함수
//   const callClovaOcr = async (base64Png: string) => {
//     // dataURL -> base64 본문만 추출
//     const pureBase64 = base64Png.split(",")[1];

//     const payload = {
//       version: "V2",
//       requestId: crypto.randomUUID(),
//       timestamp: Date.now(),
//       lang: "ko",
//       images: [
//         {
//           format: "png",
//           name: "shot",
//           data: pureBase64,
//         },
//       ],
//     };

//     const res = await fetch(OCR_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "X-OCR-SECRET": OCR_SECRET,
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       const text = await res.text();
//       throw new Error(`CLOVA OCR 실패: ${res.status} ${text}`);
//     }

//     type OcrField = { inferText: string };
//     type OcrResponse = {
//       images?: Array<{
//         fields?: OcrField[];
//       }>;
//     };

//     const json: OcrResponse = await res.json();
//     const fields = json.images?.[0]?.fields ?? [];
//     // 줄 단위로 합치고 가장 긴 줄이나 전체 합치기 등 필요 시 조정
//     const joined = fields
//       .map((f) => f.inferText)
//       .join(" ")
//       .trim();
//     return joined;
//   };

//   const handleCaptureAndRecognize = async () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");
//     if (!context) return;

//     // 전처리(그레이/콘트라스트)는 그대로 유지
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
//       const text = await callClovaOcr(imageDataUrl);
//       setRecognizedText(text);
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
