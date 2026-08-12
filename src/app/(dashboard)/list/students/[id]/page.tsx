import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import FormModal from "@/components/FormModal";
import Performance from "@/components/Performance";
import prisma from "@/lib/prisma";
import { getRole } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const SingleStudentPage = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const role = getRole();
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      class: { include: { _count: { select: { lessons: true } } } },
      grade: true,
      _count: { select: { attendances: true, results: true } },
    },
  });

  if (!student) return notFound();

  const presentCount = await prisma.attendance.count({
    where: { studentId: student.id, present: true },
  });
  const attendancePct =
    student._count.attendances > 0
      ? Math.round((presentCount / student._count.attendances) * 100)
      : 0;

  const avgResult = await prisma.result.aggregate({
    where: { studentId: student.id },
    _avg: { score: true },
  });
  const performanceScore = ((avgResult._avg.score || 0) / 100) * 10;

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      <div className="w-full xl:w-2/3">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="bg-sky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={student.img || "/noAvatar.png"}
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {student.name} {student.surname}
                </h1>
                {role === "admin" && (
                  <FormModal table="student" type="update" data={student} />
                )}
              </div>
              <p className="text-sm text-gray-500">{student.address}</p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{student.bloodType}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>
                    {new Intl.DateTimeFormat("en-GB").format(student.birthday)}
                  </span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{student.email || "-"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{student.phone || "-"}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleAttendance.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">{attendancePct}%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleBranch.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">{student.grade.level}th</h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleLesson.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">{student.class._count.lessons}</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image src="/singleClass.png" alt="" width={24} height={24} className="w-6 h-6" />
              <div>
                <h1 className="text-xl font-semibold">{student.class.name}</h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Student&apos;s Schedule</h1>
          <BigCalendarContainer type="classId" id={student.classId} />
        </div>
      </div>
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-purpleLight" href={`/list/lessons?classId=${student.classId}`}>
              Student&apos;s Lessons
            </Link>
            <Link className="p-3 rounded-md bg-yellowLight" href={`/list/teachers?classId=${student.classId}`}>
              Student&apos;s Teachers
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href={`/list/exams?classId=${student.classId}`}>
              Student&apos;s Exams
            </Link>
            <Link className="p-3 rounded-md bg-skyLight" href={`/list/assignments?classId=${student.classId}`}>
              Student&apos;s Assignments
            </Link>
            <Link className="p-3 rounded-md bg-purpleLight" href={`/list/results?studentId=${student.id}`}>
              Student&apos;s Results
            </Link>
          </div>
        </div>
        <Performance score={performanceScore || 0} />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
