import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const table = req.nextUrl.searchParams.get("table");

  try {
    switch (table) {
      case "teacher": {
        const subjects = await prisma.subject.findMany({
          select: { id: true, name: true },
        });
        return NextResponse.json({ subjects });
      }
      case "student": {
        const [grades, classes, parents] = await Promise.all([
          prisma.grade.findMany({ select: { id: true, level: true } }),
          prisma.class.findMany({ select: { id: true, name: true } }),
          prisma.parent.findMany({
            select: { id: true, name: true, surname: true },
          }),
        ]);
        return NextResponse.json({ grades, classes, parents });
      }
      case "subject": {
        const teachers = await prisma.teacher.findMany({
          select: { id: true, name: true, surname: true },
        });
        return NextResponse.json({ teachers });
      }
      case "class": {
        const [grades, teachers] = await Promise.all([
          prisma.grade.findMany({ select: { id: true, level: true } }),
          prisma.teacher.findMany({
            select: { id: true, name: true, surname: true },
          }),
        ]);
        return NextResponse.json({ grades, teachers });
      }
      case "lesson": {
        const [subjects, classes, teachers] = await Promise.all([
          prisma.subject.findMany({ select: { id: true, name: true } }),
          prisma.class.findMany({ select: { id: true, name: true } }),
          prisma.teacher.findMany({
            select: { id: true, name: true, surname: true },
          }),
        ]);
        return NextResponse.json({ subjects, classes, teachers });
      }
      case "exam":
      case "assignment": {
        const lessons = await prisma.lesson.findMany({
          select: { id: true, name: true },
        });
        return NextResponse.json({ lessons });
      }
      case "result": {
        const [students, exams, assignments] = await Promise.all([
          prisma.student.findMany({
            select: { id: true, name: true, surname: true },
          }),
          prisma.exam.findMany({ select: { id: true, title: true } }),
          prisma.assignment.findMany({ select: { id: true, title: true } }),
        ]);
        return NextResponse.json({ students, exams, assignments });
      }
      case "attendance": {
        const [students, lessons] = await Promise.all([
          prisma.student.findMany({
            select: { id: true, name: true, surname: true },
          }),
          prisma.lesson.findMany({ select: { id: true, name: true } }),
        ]);
        return NextResponse.json({ students, lessons });
      }
      case "event":
      case "announcement": {
        const classes = await prisma.class.findMany({
          select: { id: true, name: true },
        });
        return NextResponse.json({ classes });
      }
      default:
        return NextResponse.json({});
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load related data" }, { status: 500 });
  }
}
