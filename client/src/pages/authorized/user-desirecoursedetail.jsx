import SectionDesireCourseDetail from "../../components/coursedetail/section-desire-coursedetail";
import StickybarRemoveDesire from "../../components/coursedetail/stickybar-removedesire";
import NavbarUser from "../../components/homepage/navbar-user";
import Footer from "../../components/homepage/footer";

function UserDesireCoursedetail() {
  return (
    <div>
      <NavbarUser />
      <SectionDesireCourseDetail />
      <Footer />
      <StickybarRemoveDesire />
    </div>
  );
}

export default UserDesireCoursedetail;
