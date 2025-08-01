import EditProfileHeader from "../components/MyPage/EditProfileHeader";
import ProfileImageSection from "../components/MyPage/ProfileImageSection";
import ProfileForm from "../components/MyPage/ProfileForm";

function EditProfilePage() {
  return (
    <div className="min-h-screen bg-white sm:bg-[#F3F3F3] px-4 py-6 flex justify-center items-start sm:mt-5 sm:mb-5">
      {" "}
      <div className="w-full sm:max-w-[700px] sm:bg-white sm:rounded-2xl sm:p-10 sm:shadow-md">
        <EditProfileHeader />
        <ProfileImageSection />
        <ProfileForm />
      </div>
    </div>
  );
}

export default EditProfilePage;
