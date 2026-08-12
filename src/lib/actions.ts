"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import prisma from "./prisma";
import {
  announcementSchema,
  assignmentSchema,
  attendanceSchema,
  classSchema,
  eventSchema,
  examSchema,
  lessonSchema,
  parentSchema,
  resultSchema,
  studentSchema,
  subjectSchema,
  teacherSchema,
} from "./formValidationSchemas";

type ActionState = { success: boolean; error: boolean; message?: string };

const ok = (): ActionState => ({ success: true, error: false });
const fail = (message?: string): ActionState => ({
  success: false,
  error: true,
  message,
});

const emptyToNull = (v?: string | null) =>
  v && v.trim() !== "" ? v : null;

// ---------- TEACHER ----------
export async function createTeacher(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = teacherSchema.parse({
      username: formData.get("username"),
      email: formData.get("email") || "",
      password: formData.get("password") || undefined,
      name: formData.get("name"),
      surname: formData.get("surname"),
      phone: formData.get("phone") || undefined,
      address: formData.get("address"),
      bloodType: formData.get("bloodType"),
      birthday: formData.get("birthday"),
      sex: formData.get("sex"),
      subjects: formData.getAll("subjects"),
    });

    await prisma.teacher.create({
      data: {
        id: randomUUID(),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: emptyToNull(data.email),
        phone: emptyToNull(data.phone),
        address: data.address,
        bloodType: data.bloodType,
        birthday: data.birthday,
        sex: data.sex,
        subjects: data.subjects?.length
          ? { connect: data.subjects.map((id) => ({ id: parseInt(id) })) }
          : undefined,
      },
    });
    revalidatePath("/list/teachers");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to create teacher");
  }
}

export async function updateTeacher(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = teacherSchema.parse({
      id: formData.get("id"),
      username: formData.get("username"),
      email: formData.get("email") || "",
      name: formData.get("name"),
      surname: formData.get("surname"),
      phone: formData.get("phone") || undefined,
      address: formData.get("address"),
      bloodType: formData.get("bloodType"),
      birthday: formData.get("birthday"),
      sex: formData.get("sex"),
      subjects: formData.getAll("subjects"),
    });
    if (!data.id) return fail("Missing id");

    await prisma.teacher.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: emptyToNull(data.email),
        phone: emptyToNull(data.phone),
        address: data.address,
        bloodType: data.bloodType,
        birthday: data.birthday,
        sex: data.sex,
        subjects: data.subjects
          ? { set: data.subjects.map((id) => ({ id: parseInt(id) })) }
          : undefined,
      },
    });
    revalidatePath("/list/teachers");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to update teacher");
  }
}

export async function deleteTeacher(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const id = formData.get("id") as string;
    await prisma.teacher.delete({ where: { id } });
    revalidatePath("/list/teachers");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to delete teacher");
  }
}

// ---------- STUDENT ----------
export async function createStudent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = studentSchema.parse({
      username: formData.get("username"),
      email: formData.get("email") || "",
      name: formData.get("name"),
      surname: formData.get("surname"),
      phone: formData.get("phone") || undefined,
      address: formData.get("address"),
      bloodType: formData.get("bloodType"),
      birthday: formData.get("birthday"),
      sex: formData.get("sex"),
      gradeId: formData.get("gradeId"),
      classId: formData.get("classId"),
      parentId: formData.get("parentId"),
    });

    await prisma.student.create({
      data: {
        id: randomUUID(),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: emptyToNull(data.email),
        phone: emptyToNull(data.phone),
        address: data.address,
        bloodType: data.bloodType,
        birthday: data.birthday,
        sex: data.sex,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });
    revalidatePath("/list/students");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to create student");
  }
}

export async function updateStudent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = studentSchema.parse({
      id: formData.get("id"),
      username: formData.get("username"),
      email: formData.get("email") || "",
      name: formData.get("name"),
      surname: formData.get("surname"),
      phone: formData.get("phone") || undefined,
      address: formData.get("address"),
      bloodType: formData.get("bloodType"),
      birthday: formData.get("birthday"),
      sex: formData.get("sex"),
      gradeId: formData.get("gradeId"),
      classId: formData.get("classId"),
      parentId: formData.get("parentId"),
    });
    if (!data.id) return fail("Missing id");

    await prisma.student.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: emptyToNull(data.email),
        phone: emptyToNull(data.phone),
        address: data.address,
        bloodType: data.bloodType,
        birthday: data.birthday,
        sex: data.sex,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId: data.parentId,
      },
    });
    revalidatePath("/list/students");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to update student");
  }
}

export async function deleteStudent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const id = formData.get("id") as string;
    await prisma.student.delete({ where: { id } });
    revalidatePath("/list/students");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to delete student");
  }
}

// ---------- PARENT ----------
export async function createParent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = parentSchema.parse({
      username: formData.get("username"),
      name: formData.get("name"),
      surname: formData.get("surname"),
      email: formData.get("email") || "",
      phone: formData.get("phone"),
      address: formData.get("address"),
    });
    await prisma.parent.create({
      data: {
        id: randomUUID(),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: emptyToNull(data.email),
        phone: data.phone,
        address: data.address,
      },
    });
    revalidatePath("/list/parents");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to create parent");
  }
}

export async function updateParent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = parentSchema.parse({
      id: formData.get("id"),
      username: formData.get("username"),
      name: formData.get("name"),
      surname: formData.get("surname"),
      email: formData.get("email") || "",
      phone: formData.get("phone"),
      address: formData.get("address"),
    });
    if (!data.id) return fail("Missing id");
    await prisma.parent.update({
      where: { id: data.id },
      data: {
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: emptyToNull(data.email),
        phone: data.phone,
        address: data.address,
      },
    });
    revalidatePath("/list/parents");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to update parent");
  }
}

export async function deleteParent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await prisma.parent.delete({ where: { id: formData.get("id") as string } });
    revalidatePath("/list/parents");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to delete parent");
  }
}

// ---------- SUBJECT ----------
export async function createSubject(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = subjectSchema.parse({
      name: formData.get("name"),
      teachers: formData.getAll("teachers"),
    });
    await prisma.subject.create({
      data: {
        name: data.name,
        teachers: data.teachers?.length
          ? { connect: data.teachers.map((id) => ({ id })) }
          : undefined,
      },
    });
    revalidatePath("/list/subjects");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to create subject");
  }
}

export async function updateSubject(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = subjectSchema.parse({
      id: formData.get("id"),
      name: formData.get("name"),
      teachers: formData.getAll("teachers"),
    });
    if (!data.id) return fail("Missing id");
    await prisma.subject.update({
      where: { id: data.id },
      data: {
        name: data.name,
        teachers: data.teachers
          ? { set: data.teachers.map((id) => ({ id })) }
          : undefined,
      },
    });
    revalidatePath("/list/subjects");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to update subject");
  }
}

export async function deleteSubject(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await prisma.subject.delete({
      where: { id: parseInt(formData.get("id") as string) },
    });
    revalidatePath("/list/subjects");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to delete subject");
  }
}

// ---------- CLASS ----------
export async function createClass(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = classSchema.parse({
      name: formData.get("name"),
      capacity: formData.get("capacity"),
      gradeId: formData.get("gradeId"),
      supervisorId: formData.get("supervisorId") || "",
    });
    await prisma.class.create({
      data: {
        name: data.name,
        capacity: data.capacity,
        gradeId: data.gradeId,
        supervisorId: emptyToNull(data.supervisorId),
      },
    });
    revalidatePath("/list/classes");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to create class");
  }
}

export async function updateClass(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = classSchema.parse({
      id: formData.get("id"),
      name: formData.get("name"),
      capacity: formData.get("capacity"),
      gradeId: formData.get("gradeId"),
      supervisorId: formData.get("supervisorId") || "",
    });
    if (!data.id) return fail("Missing id");
    await prisma.class.update({
      where: { id: data.id },
      data: {
        name: data.name,
        capacity: data.capacity,
        gradeId: data.gradeId,
        supervisorId: emptyToNull(data.supervisorId),
      },
    });
    revalidatePath("/list/classes");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to update class");
  }
}

export async function deleteClass(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await prisma.class.delete({
      where: { id: parseInt(formData.get("id") as string) },
    });
    revalidatePath("/list/classes");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to delete class");
  }
}

// ---------- LESSON ----------
export async function createLesson(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = lessonSchema.parse({
      name: formData.get("name"),
      day: formData.get("day"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      subjectId: formData.get("subjectId"),
      classId: formData.get("classId"),
      teacherId: formData.get("teacherId"),
    });
    await prisma.lesson.create({ data });
    revalidatePath("/list/lessons");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to create lesson");
  }
}

export async function updateLesson(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = lessonSchema.parse({
      id: formData.get("id"),
      name: formData.get("name"),
      day: formData.get("day"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      subjectId: formData.get("subjectId"),
      classId: formData.get("classId"),
      teacherId: formData.get("teacherId"),
    });
    if (!data.id) return fail("Missing id");
    await prisma.lesson.update({
      where: { id: data.id },
      data: {
        name: data.name,
        day: data.day,
        startTime: data.startTime,
        endTime: data.endTime,
        subjectId: data.subjectId,
        classId: data.classId,
        teacherId: data.teacherId,
      },
    });
    revalidatePath("/list/lessons");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to update lesson");
  }
}

export async function deleteLesson(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await prisma.lesson.delete({
      where: { id: parseInt(formData.get("id") as string) },
    });
    revalidatePath("/list/lessons");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to delete lesson");
  }
}

// ---------- EXAM ----------
export async function createExam(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = examSchema.parse({
      title: formData.get("title"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      lessonId: formData.get("lessonId"),
    });
    await prisma.exam.create({ data });
    revalidatePath("/list/exams");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to create exam");
  }
}

export async function updateExam(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = examSchema.parse({
      id: formData.get("id"),
      title: formData.get("title"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      lessonId: formData.get("lessonId"),
    });
    if (!data.id) return fail("Missing id");
    await prisma.exam.update({
      where: { id: data.id },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime: data.endTime,
        lessonId: data.lessonId,
      },
    });
    revalidatePath("/list/exams");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to update exam");
  }
}

export async function deleteExam(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await prisma.exam.delete({
      where: { id: parseInt(formData.get("id") as string) },
    });
    revalidatePath("/list/exams");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to delete exam");
  }
}

// ---------- ASSIGNMENT ----------
export async function createAssignment(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = assignmentSchema.parse({
      title: formData.get("title"),
      startDate: formData.get("startDate"),
      dueDate: formData.get("dueDate"),
      lessonId: formData.get("lessonId"),
    });
    await prisma.assignment.create({ data });
    revalidatePath("/list/assignments");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to create assignment");
  }
}

export async function updateAssignment(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = assignmentSchema.parse({
      id: formData.get("id"),
      title: formData.get("title"),
      startDate: formData.get("startDate"),
      dueDate: formData.get("dueDate"),
      lessonId: formData.get("lessonId"),
    });
    if (!data.id) return fail("Missing id");
    await prisma.assignment.update({
      where: { id: data.id },
      data: {
        title: data.title,
        startDate: data.startDate,
        dueDate: data.dueDate,
        lessonId: data.lessonId,
      },
    });
    revalidatePath("/list/assignments");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to update assignment");
  }
}

export async function deleteAssignment(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await prisma.assignment.delete({
      where: { id: parseInt(formData.get("id") as string) },
    });
    revalidatePath("/list/assignments");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to delete assignment");
  }
}

// ---------- RESULT ----------
export async function createResult(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const examIdRaw = formData.get("examId") as string;
    const assignmentIdRaw = formData.get("assignmentId") as string;
    const data = resultSchema.parse({
      score: formData.get("score"),
      studentId: formData.get("studentId"),
      examId: examIdRaw || undefined,
      assignmentId: assignmentIdRaw || undefined,
    });
    await prisma.result.create({
      data: {
        score: data.score,
        studentId: data.studentId,
        examId: examIdRaw ? Number(examIdRaw) : null,
        assignmentId: assignmentIdRaw ? Number(assignmentIdRaw) : null,
      },
    });
    revalidatePath("/list/results");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to create result");
  }
}

export async function updateResult(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const examIdRaw = formData.get("examId") as string;
    const assignmentIdRaw = formData.get("assignmentId") as string;
    const data = resultSchema.parse({
      id: formData.get("id"),
      score: formData.get("score"),
      studentId: formData.get("studentId"),
      examId: examIdRaw || undefined,
      assignmentId: assignmentIdRaw || undefined,
    });
    if (!data.id) return fail("Missing id");
    await prisma.result.update({
      where: { id: data.id },
      data: {
        score: data.score,
        studentId: data.studentId,
        examId: examIdRaw ? Number(examIdRaw) : null,
        assignmentId: assignmentIdRaw ? Number(assignmentIdRaw) : null,
      },
    });
    revalidatePath("/list/results");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to update result");
  }
}

export async function deleteResult(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await prisma.result.delete({
      where: { id: parseInt(formData.get("id") as string) },
    });
    revalidatePath("/list/results");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to delete result");
  }
}

// ---------- ATTENDANCE ----------
export async function createAttendance(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = attendanceSchema.parse({
      date: formData.get("date"),
      present: formData.get("present") === "true",
      studentId: formData.get("studentId"),
      lessonId: formData.get("lessonId"),
    });
    await prisma.attendance.create({ data });
    revalidatePath("/list/attendance");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to create attendance");
  }
}

export async function updateAttendance(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const data = attendanceSchema.parse({
      id: formData.get("id"),
      date: formData.get("date"),
      present: formData.get("present") === "true",
      studentId: formData.get("studentId"),
      lessonId: formData.get("lessonId"),
    });
    if (!data.id) return fail("Missing id");
    await prisma.attendance.update({
      where: { id: data.id },
      data: {
        date: data.date,
        present: data.present,
        studentId: data.studentId,
        lessonId: data.lessonId,
      },
    });
    revalidatePath("/list/attendance");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to update attendance");
  }
}

export async function deleteAttendance(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await prisma.attendance.delete({
      where: { id: parseInt(formData.get("id") as string) },
    });
    revalidatePath("/list/attendance");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to delete attendance");
  }
}

// ---------- EVENT ----------
export async function createEvent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const classIdRaw = formData.get("classId") as string;
    const data = eventSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      classId: classIdRaw || undefined,
    });
    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: classIdRaw ? Number(classIdRaw) : null,
      },
    });
    revalidatePath("/list/events");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to create event");
  }
}

export async function updateEvent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const classIdRaw = formData.get("classId") as string;
    const data = eventSchema.parse({
      id: formData.get("id"),
      title: formData.get("title"),
      description: formData.get("description"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      classId: classIdRaw || undefined,
    });
    if (!data.id) return fail("Missing id");
    await prisma.event.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        classId: classIdRaw ? Number(classIdRaw) : null,
      },
    });
    revalidatePath("/list/events");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to update event");
  }
}

export async function deleteEvent(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await prisma.event.delete({
      where: { id: parseInt(formData.get("id") as string) },
    });
    revalidatePath("/list/events");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to delete event");
  }
}

// ---------- ANNOUNCEMENT ----------
export async function createAnnouncement(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const classIdRaw = formData.get("classId") as string;
    const data = announcementSchema.parse({
      title: formData.get("title"),
      description: formData.get("description"),
      date: formData.get("date"),
      classId: classIdRaw || undefined,
    });
    await prisma.announcement.create({
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        classId: classIdRaw ? Number(classIdRaw) : null,
      },
    });
    revalidatePath("/list/announcements");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to create announcement");
  }
}

export async function updateAnnouncement(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const classIdRaw = formData.get("classId") as string;
    const data = announcementSchema.parse({
      id: formData.get("id"),
      title: formData.get("title"),
      description: formData.get("description"),
      date: formData.get("date"),
      classId: classIdRaw || undefined,
    });
    if (!data.id) return fail("Missing id");
    await prisma.announcement.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        date: data.date,
        classId: classIdRaw ? Number(classIdRaw) : null,
      },
    });
    revalidatePath("/list/announcements");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to update announcement");
  }
}

export async function deleteAnnouncement(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    await prisma.announcement.delete({
      where: { id: parseInt(formData.get("id") as string) },
    });
    revalidatePath("/list/announcements");
    return ok();
  } catch (e) {
    console.error(e);
    return fail("Failed to delete announcement");
  }
}
