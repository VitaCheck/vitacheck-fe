// import ProfileCat from "../../assets/ProfileCat.svg";
// import CameraIcon from "../../assets/camera.svg";

// function ProfileImageSection() {
//   return (
//     <div className="flex justify-center my-10">
//       <div className="relative w-[150px] h-[150px]">
//         <img
//           src={ProfileCat}
//           alt="profile"
//           className="w-full h-full rounded-full object-cover"
//         />
//         <button className="absolute bottom-1 right-0 ">
//           <img src={CameraIcon} alt="camera" className="w-[32px] h-[32px]" />
//         </button>
//       </div>
//     </div>
//   );
// }

// export default ProfileImageSection;

import { useEffect, useRef, useState } from "react";
import { getUserInfo, updateProfileImageUrl } from "@/apis/user";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import ProfileCat from "../../assets/ProfileCat.svg";
import CameraIcon from "../../assets/camera.svg";

function ProfileImageSection() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // 최초 로드시 현재 프로필 이미지 가져오기
  useEffect(() => {
    const load = async () => {
      try {
        const me = await getUserInfo();
        setCurrentUrl(me.profileImageUrl ?? null);
      } catch (e) {
        // 사용자 정보 실패해도 기본 이미지 사용
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

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const err = validateFile(file);
    if (err) {
      alert(err);
      e.target.value = "";
      return;
    }

    // 미리보기
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    try {
      setLoading(true);
      // 1) Cloudinary 업로드
      const secureUrl = await uploadImageToCloudinary(file);
      // 2) 백엔드에 URL PATCH
      await updateProfileImageUrl(secureUrl);
      // 3) UI 반영
      setCurrentUrl(secureUrl);
      alert("프로필 사진이 변경되었습니다.");
    } catch (error) {
      console.error("프로필 이미지 업데이트 실패:", error);
      alert("이미지 업로드 또는 저장에 실패했습니다.");
      setPreviewUrl(null);
    } finally {
      setLoading(false);
      // 메모리 누수 방지
      URL.revokeObjectURL(localUrl);
      e.target.value = "";
    }
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

        {/* 로딩 오버레이 */}
        {loading && (
          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white text-sm">
            업로드 중...
          </div>
        )}

        <button
          type="button"
          onClick={openFilePicker}
          className="absolute bottom-1 right-0 bg-white rounded-full shadow p-1"
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
