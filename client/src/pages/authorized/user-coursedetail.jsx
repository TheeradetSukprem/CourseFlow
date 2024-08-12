import SectionCourseDetail from "../../components/coursedetail/section-coursedetail";
import SectionOtherCourse from "../../components/coursedetail/section-othercourse";
import StickybarCoursedetail from "../../components/coursedetail/stickybar-coursedetail";
import NavbarUser from "../../components/homepage/navbar-user";
import Footer from "../../components/homepage/footer";

function UserCoursedetail() {
  return (
    <div>
      <NavbarUser />
      <SectionCourseDetail />
      <SectionOtherCourse />
      <Footer />
      <StickybarCoursedetail />
    </div>
  );
}

export default UserCoursedetail;
