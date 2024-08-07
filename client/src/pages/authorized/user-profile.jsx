import NavbarUser from "../../components/homepage/navbar-user";
import Footer from "../../components/homepage/footer";
import Background from "../../components/user-profile/background";
import ProfileFrom from "../../components/user-profile/profile-form";

function EditProfileForm() {
  return (
    <>
      <div className="sticky top-0 bg-white z-40">
        <NavbarUser />
      </div>
      <header className="text-black font-medium text-Headline3 pt-[3rem] md:text-Headline2 md:pb-[3rem] flex flex-col justify-center items-center">
        Profile
      </header>
      <div className="flex flex-col md:flex-row justify-center items-center md:gap-[3rem] mb-[14rem]">
        <ProfileFrom />
      </div>
      <Footer />
      <Background />
    </>
  );
}

export default EditProfileForm;
