import EditSubLessonFrom from "../../components/admin/form/edit-sublesson-form";
import Sidebar from "../../components/admin/sidebar";

function EditSubLesson() {
  return (
    <div>
      <div className="flex flex-row bg-[#F6F7FC] ">
        <Sidebar />
        <main className="flex-1">
          <EditSubLessonFrom />
        </main>
      </div>
    </div>
  );
}

export default EditSubLesson;
