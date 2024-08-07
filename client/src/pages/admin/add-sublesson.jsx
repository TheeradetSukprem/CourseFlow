import AddSubLessonFrom from "../../components/admin/form/add-sublesson-form";
import Sidebar from "../../components/admin/sidebar";

function AddSubLesson() {
  return (
    <div>
      <div className="flex flex-row bg-[#F6F7FC]">
        <Sidebar />
        <main className="flex-1">
          <AddSubLessonFrom />
        </main>
      </div>
    </div>
  );
}

export default AddSubLesson;
