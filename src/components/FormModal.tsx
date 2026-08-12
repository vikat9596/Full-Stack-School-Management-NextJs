"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import {
  deleteAnnouncement,
  deleteAssignment,
  deleteAttendance,
  deleteClass,
  deleteEvent,
  deleteExam,
  deleteLesson,
  deleteParent,
  deleteResult,
  deleteStudent,
  deleteSubject,
  deleteTeacher,
} from "@/lib/actions";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});

type TableName =
  | "teacher"
  | "student"
  | "parent"
  | "subject"
  | "class"
  | "lesson"
  | "exam"
  | "assignment"
  | "result"
  | "attendance"
  | "event"
  | "announcement";

const deleteActionMap: Record<TableName, any> = {
  teacher: deleteTeacher,
  student: deleteStudent,
  parent: deleteParent,
  subject: deleteSubject,
  class: deleteClass,
  lesson: deleteLesson,
  exam: deleteExam,
  assignment: deleteAssignment,
  result: deleteResult,
  attendance: deleteAttendance,
  event: deleteEvent,
  announcement: deleteAnnouncement,
};

function DeleteForm({
  table,
  id,
  setOpen,
}: {
  table: TableName;
  id: number | string;
  setOpen: (open: boolean) => void;
}) {
  const [state, formAction] = useFormState(deleteActionMap[table], {
    success: false,
    error: false,
    message: undefined as string | undefined,
  });
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      setOpen(false);
      router.refresh();
    }
  }, [state, router, setOpen]);

  return (
    <form action={formAction} className="p-4 flex flex-col gap-4">
      <input type="hidden" name="id" value={id} />
      <span className="text-center font-medium">
        All data will be lost. Are you sure you want to delete this {table}?
      </span>
      {state.error && (
        <span className="text-red-500 text-sm text-center">
          {state.message || "Failed to delete"}
        </span>
      )}
      <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
        Delete
      </button>
    </form>
  );
}

function SimpleFormSwitcher({
  table,
  type,
  data,
  relatedData,
  setOpen,
}: {
  table: TableName;
  type: "create" | "update";
  data?: any;
  relatedData: any;
  setOpen: (open: boolean) => void;
}) {
  const [Forms, setForms] = useState<any>(null);

  useEffect(() => {
    import("./forms/SimpleForms").then((mod) => setForms(mod.default));
  }, []);

  if (!Forms) return <h1>Loading...</h1>;

  const map: Record<string, any> = {
    parent: Forms.ParentForm,
    subject: Forms.SubjectForm,
    class: Forms.ClassForm,
    lesson: Forms.LessonForm,
    exam: Forms.ExamForm,
    assignment: Forms.AssignmentForm,
    result: Forms.ResultForm,
    attendance: Forms.AttendanceForm,
    event: Forms.EventForm,
    announcement: Forms.AnnouncementForm,
  };

  const Comp = map[table];
  if (!Comp) return <div>Form not found!</div>;
  return (
    <Comp type={type} data={data} relatedData={relatedData} setOpen={setOpen} />
  );
}

function LoadedEntityForm({
  table,
  type,
  data,
  relatedData,
  setOpen,
}: {
  table: TableName;
  type: "create" | "update";
  data?: any;
  relatedData: any;
  setOpen: (open: boolean) => void;
}) {
  const common = { type, data, relatedData, setOpen };

  if (table === "teacher") return <TeacherForm {...common} />;
  if (table === "student") return <StudentForm {...common} />;
  return <SimpleFormSwitcher table={table} {...common} />;
}

const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table: TableName;
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create" ? "bg-yellow" : type === "update" ? "bg-sky" : "bg-purple";

  const [open, setOpen] = useState(false);
  const [relatedData, setRelatedData] = useState<any>({});

  useEffect(() => {
    if (!open || type === "delete") return;
    const load = async () => {
      try {
        const res = await fetch(`/api/form-related?table=${table}`);
        if (res.ok) setRelatedData(await res.json());
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [open, table, type]);

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] max-h-[90vh] overflow-y-auto">
            {type === "delete" && id ? (
              <DeleteForm table={table} id={id} setOpen={setOpen} />
            ) : type === "create" || type === "update" ? (
              <LoadedEntityForm
                table={table}
                type={type}
                data={data}
                relatedData={relatedData}
                setOpen={setOpen}
              />
            ) : (
              "Form not found!"
            )}
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
