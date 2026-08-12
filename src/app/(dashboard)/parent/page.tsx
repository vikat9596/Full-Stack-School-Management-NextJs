import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

const ParentPage = async () => {
  const { userId } = auth();

  const students = await prisma.student.findMany({
    where: { parentId: userId! },
  });

  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
      <div className="w-full xl:w-2/3">
        {students.length ? (
          students.map((student) => (
            <div className="h-full bg-white p-4 rounded-md mb-4" key={student.id}>
              <h1 className="text-xl font-semibold">
                Schedule ({student.name} {student.surname})
              </h1>
              <BigCalendarContainer type="classId" id={student.classId} />
            </div>
          ))
        ) : (
          <div className="bg-white p-4 rounded-md">
            <h1 className="text-xl font-semibold">Schedule</h1>
            <p className="text-sm text-gray-400 mt-4">
              No students linked to this parent account yet.
            </p>
          </div>
        )}
      </div>
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcements />
      </div>
    </div>
  );
};

export default ParentPage;
