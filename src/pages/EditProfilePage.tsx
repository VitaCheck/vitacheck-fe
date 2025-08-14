import { useState } from "react";
import EditProfileHeader from "../components/MyPage/EditProfileHeader";
import ProfileImageSection from "../components/MyPage/ProfileImageSection";
import ProfileForm from "../components/MyPage/ProfileForm";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { updateProfileImageUrl } from "@/apis/user";

function EditProfilePage() {
  const [pendingImage, setPendingImage] = useState<File | null>(null);

  const handleSaveExtra = async () => {
    if (!pendingImage) return; // 이미지 변경 안 했으면 아무 것도 안 함
    const secureUrl = await uploadImageToCloudinary(pendingImage);
    await updateProfileImageUrl(secureUrl);
    setPendingImage(null); // 저장 후 초기화
  };

  return (
    <div className="min-h-screen bg-white sm:bg-[#F3F3F3] px-4 py-6 flex justify-center items-start sm:mt-5 sm:mb-5">
      <div className="w-full sm:max-w-[700px] sm:bg-white sm:rounded-2xl sm:p-10 sm:shadow-md">
        <EditProfileHeader />
        {/* 파일 선택 시 부모 state에 넣기 */}
        <ProfileImageSection onSelectFile={setPendingImage} />
        {/* 저장 버튼 눌릴 때 이미지 저장까지 한 번에 */}
        <ProfileForm onSaveExtra={handleSaveExtra} />
      </div>
    </div>
  );
}

export default EditProfilePage;
