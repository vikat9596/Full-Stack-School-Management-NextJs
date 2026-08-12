"use client";

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import {
  createAnnouncement,
  createAssignment,
  createAttendance,
  createClass,
  createEvent,
  createExam,
  createLesson,
  createParent,
  createResult,
  createSubject,
  updateAnnouncement,
  updateAssignment,
  updateAttendance,
  updateClass,
  updateEvent,
  updateExam,
  updateLesson,
  updateParent,
  updateResult,
  updateSubject,
} from "@/lib/actions";
import { toDateInput, toDateTimeLocal } from "./formUtils";

type FormProps = {
  type: "create" | "update";
  data?: any;
  relatedData?: any;
  setOpen?: (open: boolean) => void;
};

function useActionForm(
  createAction: any,
  updateAction: any,
  type: "create" | "update",
  setOpen?: (open: boolean) => void
) {
  const [state, formAction] = useFormState(
    type === "create" ? createAction : updateAction,
    { success: false, error: false, message: undefined as string | undefined }
  );
  const router = useRouter();
  useEffect(() => {
    if (state.success) {
      setOpen?.(false);
      router.refresh();
    }
  }, [state, router, setOpen]);
  return { state, formAction };
}

const field =
  "ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full md:w-[48%]";
const label = "text-xs text-gray-500";

export function ParentForm({ type, data, setOpen }: FormProps) {
  const { state, formAction } = useActionForm(createParent, updateParent, type, setOpen);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{type === "create" ? "Create parent" : "Update parent"}</h1>
      {data?.id && <input type="hidden" name="id" value={data.id} />}
      <div className="flex flex-wrap gap-4">
        <input className={field} name="username" placeholder="Username" defaultValue={data?.username} required />
        <input className={field} name="name" placeholder="First name" defaultValue={data?.name} required />
        <input className={field} name="surname" placeholder="Last name" defaultValue={data?.surname} required />
        <input className={field} name="email" placeholder="Email" defaultValue={data?.email || ""} />
        <input className={field} name="phone" placeholder="Phone" defaultValue={data?.phone} required />
        <input className={field} name="address" placeholder="Address" defaultValue={data?.address} required />
      </div>
      {state.error && <span className="text-red-500 text-sm">{state.message || "Error"}</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
    </form>
  );
}

export function SubjectForm({ type, data, relatedData, setOpen }: FormProps) {
  const { state, formAction } = useActionForm(createSubject, updateSubject, type, setOpen);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{type === "create" ? "Create subject" : "Update subject"}</h1>
      {data?.id && <input type="hidden" name="id" value={data.id} />}
      <input className={field} name="name" placeholder="Subject name" defaultValue={data?.name} required />
      <div className="flex flex-col gap-2">
        <label className={label}>Teachers</label>
        <select multiple name="teachers" className={field} defaultValue={data?.teachers?.map((t: any) => t.id)}>
          {(relatedData?.teachers || []).map((t: any) => (
            <option key={t.id} value={t.id}>{t.name} {t.surname}</option>
          ))}
        </select>
      </div>
      {state.error && <span className="text-red-500 text-sm">{state.message || "Error"}</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
    </form>
  );
}

export function ClassForm({ type, data, relatedData, setOpen }: FormProps) {
  const { state, formAction } = useActionForm(createClass, updateClass, type, setOpen);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{type === "create" ? "Create class" : "Update class"}</h1>
      {data?.id && <input type="hidden" name="id" value={data.id} />}
      <div className="flex flex-wrap gap-4">
        <input className={field} name="name" placeholder="Class name" defaultValue={data?.name} required />
        <input className={field} name="capacity" type="number" placeholder="Capacity" defaultValue={data?.capacity} required />
        <select className={field} name="gradeId" defaultValue={data?.gradeId} required>
          <option value="">Select grade</option>
          {(relatedData?.grades || []).map((g: any) => (
            <option key={g.id} value={g.id}>{g.level}</option>
          ))}
        </select>
        <select className={field} name="supervisorId" defaultValue={data?.supervisorId || ""}>
          <option value="">No supervisor</option>
          {(relatedData?.teachers || []).map((t: any) => (
            <option key={t.id} value={t.id}>{t.name} {t.surname}</option>
          ))}
        </select>
      </div>
      {state.error && <span className="text-red-500 text-sm">{state.message || "Error"}</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
    </form>
  );
}

export function LessonForm({ type, data, relatedData, setOpen }: FormProps) {
  const { state, formAction } = useActionForm(createLesson, updateLesson, type, setOpen);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{type === "create" ? "Create lesson" : "Update lesson"}</h1>
      {data?.id && <input type="hidden" name="id" value={data.id} />}
      <div className="flex flex-wrap gap-4">
        <input className={field} name="name" placeholder="Lesson name" defaultValue={data?.name} required />
        <select className={field} name="day" defaultValue={data?.day || "MONDAY"} required>
          {["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY"].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <input className={field} name="startTime" type="datetime-local" defaultValue={toDateTimeLocal(data?.startTime)} required />
        <input className={field} name="endTime" type="datetime-local" defaultValue={toDateTimeLocal(data?.endTime)} required />
        <select className={field} name="subjectId" defaultValue={data?.subjectId} required>
          <option value="">Subject</option>
          {(relatedData?.subjects || []).map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select className={field} name="classId" defaultValue={data?.classId} required>
          <option value="">Class</option>
          {(relatedData?.classes || []).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className={field} name="teacherId" defaultValue={data?.teacherId} required>
          <option value="">Teacher</option>
          {(relatedData?.teachers || []).map((t: any) => <option key={t.id} value={t.id}>{t.name} {t.surname}</option>)}
        </select>
      </div>
      {state.error && <span className="text-red-500 text-sm">{state.message || "Error"}</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
    </form>
  );
}

export function ExamForm({ type, data, relatedData, setOpen }: FormProps) {
  const { state, formAction } = useActionForm(createExam, updateExam, type, setOpen);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{type === "create" ? "Create exam" : "Update exam"}</h1>
      {data?.id && <input type="hidden" name="id" value={data.id} />}
      <div className="flex flex-wrap gap-4">
        <input className={field} name="title" placeholder="Title" defaultValue={data?.title} required />
        <input className={field} name="startTime" type="datetime-local" defaultValue={toDateTimeLocal(data?.startTime)} required />
        <input className={field} name="endTime" type="datetime-local" defaultValue={toDateTimeLocal(data?.endTime)} required />
        <select className={field} name="lessonId" defaultValue={data?.lessonId} required>
          <option value="">Lesson</option>
          {(relatedData?.lessons || []).map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>
      {state.error && <span className="text-red-500 text-sm">{state.message || "Error"}</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
    </form>
  );
}

export function AssignmentForm({ type, data, relatedData, setOpen }: FormProps) {
  const { state, formAction } = useActionForm(createAssignment, updateAssignment, type, setOpen);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{type === "create" ? "Create assignment" : "Update assignment"}</h1>
      {data?.id && <input type="hidden" name="id" value={data.id} />}
      <div className="flex flex-wrap gap-4">
        <input className={field} name="title" placeholder="Title" defaultValue={data?.title} required />
        <input className={field} name="startDate" type="datetime-local" defaultValue={toDateTimeLocal(data?.startDate)} required />
        <input className={field} name="dueDate" type="datetime-local" defaultValue={toDateTimeLocal(data?.dueDate)} required />
        <select className={field} name="lessonId" defaultValue={data?.lessonId} required>
          <option value="">Lesson</option>
          {(relatedData?.lessons || []).map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>
      {state.error && <span className="text-red-500 text-sm">{state.message || "Error"}</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
    </form>
  );
}

export function ResultForm({ type, data, relatedData, setOpen }: FormProps) {
  const { state, formAction } = useActionForm(createResult, updateResult, type, setOpen);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{type === "create" ? "Create result" : "Update result"}</h1>
      {data?.id && <input type="hidden" name="id" value={data.id} />}
      <div className="flex flex-wrap gap-4">
        <input className={field} name="score" type="number" placeholder="Score" defaultValue={data?.score} required />
        <select className={field} name="studentId" defaultValue={data?.studentId} required>
          <option value="">Student</option>
          {(relatedData?.students || []).map((s: any) => <option key={s.id} value={s.id}>{s.name} {s.surname}</option>)}
        </select>
        <select className={field} name="examId" defaultValue={data?.examId || ""}>
          <option value="">Exam (optional)</option>
          {(relatedData?.exams || []).map((e: any) => <option key={e.id} value={e.id}>{e.title}</option>)}
        </select>
        <select className={field} name="assignmentId" defaultValue={data?.assignmentId || ""}>
          <option value="">Assignment (optional)</option>
          {(relatedData?.assignments || []).map((a: any) => <option key={a.id} value={a.id}>{a.title}</option>)}
        </select>
      </div>
      {state.error && <span className="text-red-500 text-sm">{state.message || "Error"}</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
    </form>
  );
}

export function AttendanceForm({ type, data, relatedData, setOpen }: FormProps) {
  const { state, formAction } = useActionForm(createAttendance, updateAttendance, type, setOpen);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{type === "create" ? "Create attendance" : "Update attendance"}</h1>
      {data?.id && <input type="hidden" name="id" value={data.id} />}
      <div className="flex flex-wrap gap-4">
        <input className={field} name="date" type="date" defaultValue={toDateInput(data?.date) || toDateInput(new Date())} required />
        <select className={field} name="present" defaultValue={String(data?.present ?? true)}>
          <option value="true">Present</option>
          <option value="false">Absent</option>
        </select>
        <select className={field} name="studentId" defaultValue={data?.studentId} required>
          <option value="">Student</option>
          {(relatedData?.students || []).map((s: any) => <option key={s.id} value={s.id}>{s.name} {s.surname}</option>)}
        </select>
        <select className={field} name="lessonId" defaultValue={data?.lessonId} required>
          <option value="">Lesson</option>
          {(relatedData?.lessons || []).map((l: any) => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      </div>
      {state.error && <span className="text-red-500 text-sm">{state.message || "Error"}</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
    </form>
  );
}

export function EventForm({ type, data, relatedData, setOpen }: FormProps) {
  const { state, formAction } = useActionForm(createEvent, updateEvent, type, setOpen);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{type === "create" ? "Create event" : "Update event"}</h1>
      {data?.id && <input type="hidden" name="id" value={data.id} />}
      <div className="flex flex-wrap gap-4">
        <input className={field} name="title" placeholder="Title" defaultValue={data?.title} required />
        <input className={field} name="description" placeholder="Description" defaultValue={data?.description} required />
        <input className={field} name="startTime" type="datetime-local" defaultValue={toDateTimeLocal(data?.startTime)} required />
        <input className={field} name="endTime" type="datetime-local" defaultValue={toDateTimeLocal(data?.endTime)} required />
        <select className={field} name="classId" defaultValue={data?.classId || ""}>
          <option value="">All classes</option>
          {(relatedData?.classes || []).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      {state.error && <span className="text-red-500 text-sm">{state.message || "Error"}</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
    </form>
  );
}

export function AnnouncementForm({ type, data, relatedData, setOpen }: FormProps) {
  const { state, formAction } = useActionForm(createAnnouncement, updateAnnouncement, type, setOpen);
  return (
    <form action={formAction} className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold">{type === "create" ? "Create announcement" : "Update announcement"}</h1>
      {data?.id && <input type="hidden" name="id" value={data.id} />}
      <div className="flex flex-wrap gap-4">
        <input className={field} name="title" placeholder="Title" defaultValue={data?.title} required />
        <input className={field} name="description" placeholder="Description" defaultValue={data?.description} required />
        <input className={field} name="date" type="date" defaultValue={toDateInput(data?.date) || toDateInput(new Date())} required />
        <select className={field} name="classId" defaultValue={data?.classId || ""}>
          <option value="">All classes</option>
          {(relatedData?.classes || []).map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      {state.error && <span className="text-red-500 text-sm">{state.message || "Error"}</span>}
      <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
    </form>
  );
}

const SimpleForms = {
  ParentForm,
  SubjectForm,
  ClassForm,
  LessonForm,
  ExamForm,
  AssignmentForm,
  ResultForm,
  AttendanceForm,
  EventForm,
  AnnouncementForm,
};

export default SimpleForms;
