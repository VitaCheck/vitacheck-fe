import EditProfileHeader from "../components/MyPage/EditProfileHeader";
import ProfileImageSection from "../components/MyPage/ProfileImageSection";
import ProfileForm from "../components/MyPage/ProfileForm";

function EditProfilePage() {
  return (
    <div className="min-h-screen px-6 py-6">
      <EditProfileHeader />
      <ProfileImageSection />
      <ProfileForm />
    </div>
  );
}

export default EditProfilePage;
