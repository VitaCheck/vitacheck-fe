import { useEffect, useRef, useState } from "react";
import { getMyProfileImageUrl } from "@/apis/user";
import ProfileCat from "../../assets/ProfileCat.svg";
import CameraIcon from "../../assets/camera.svg";

interface ProfileImageSectionProps {
  onSelectFile: (file: File | null) => void;
}

function ProfileImageSection({ onSelectFile }: ProfileImageSectionProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const url = await getMyProfileImageUrl();
        setCurrentUrl(url ?? null);
      } catch (e) {
        console.error("프로필 이미지 불러오기 실패:", e);
      }
    };
    load();
  }, []);

  const openFilePicker = () => fileRef.current?.click();

  const validateFile = (file: File): string | null => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxMB = 5;
    if (!validTypes.includes(file.type))
      return "JPEG/PNG/WEBP 형식만 가능합니다.";
    if (file.size > maxMB * 1024 * 1024)
      return `파일 용량은 ${maxMB}MB 이하만 가능합니다.`;
    return null;
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) {
      setPreviewUrl(null);
      onSelectFile(null);
      return;
    }
    const err = validateFile(file);
    if (err) {
      alert(err);
      e.target.value = "";
      return;
    }
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    onSelectFile(file);
  };

  const showingUrl = previewUrl ?? currentUrl ?? ProfileCat;

  return (
    <div className="flex justify-center my-10">
      <div className="relative w-[150px] h-[150px]">
        <img
          src={showingUrl}
          alt="profile"
          className="w-full h-full rounded-full object-cover border border-gray-200"
        />
        <button
          type="button"
          onClick={openFilePicker}
          className="absolute bottom-1 right-0 rounded-full p-1 cursor-pointer"
          aria-label="프로필 사진 변경"
        >
          <img src={CameraIcon} alt="camera" className="w-[32px] h-[32px]" />
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onFileChange}
        />
      </div>
    </div>
  );
}

export default ProfileImageSection;
