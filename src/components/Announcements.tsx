import prisma from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

const Announcements = async () => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;

  const roleConditions: Record<string, any> = {
    teacher: { lessons: { some: { teacherId: userId! } } },
    student: { students: { some: { id: userId! } } },
    parent: { students: { some: { parentId: userId! } } },
  };

  const data = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: "desc" },
    where:
      role !== "admin"
        ? {
            OR: [
              { classId: null },
              { class: roleConditions[role || ""] || {} },
            ],
          }
        : undefined,
  });

  const colors = ["bg-skyLight", "bg-purpleLight", "bg-yellowLight"];

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <Link href="/list/announcements" className="text-xs text-gray-400">
          View All
        </Link>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data.map((item, i) => (
          <div key={item.id} className={`${colors[i % colors.length]} rounded-md p-4`}>
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{item.title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-CA").format(item.date)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{item.description}</p>
          </div>
        ))}
        {!data.length && (
          <p className="text-sm text-gray-400">No announcements yet.</p>
        )}
      </div>
    </div>
  );
};

export default Announcements;
