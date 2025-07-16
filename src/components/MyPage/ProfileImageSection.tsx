import ProfileCat from "../../assets/ProfileCat.svg";
import CameraIcon from "../../assets/camera.svg";

function ProfileImageSection() {
  return (
    <div className="flex justify-center my-10">
      <div className="relative w-[150px] h-[150px]">
        <img
          src={ProfileCat}
          alt="profile"
          className="w-full h-full rounded-full object-cover"
        />
        <button className="absolute bottom-1 right-0 ">
          <img src={CameraIcon} alt="camera" className="w-[32px] h-[32px]" />
        </button>
      </div>
    </div>
  );
}

export default ProfileImageSection;
