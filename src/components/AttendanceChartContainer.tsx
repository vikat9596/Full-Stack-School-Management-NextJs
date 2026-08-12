import AttendanceChart from "./AttendanceChart";
import prisma from "@/lib/prisma";

const AttendanceChartContainer = async () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysSinceMonday);
  lastMonday.setHours(0, 0, 0, 0);

  const resData = await prisma.attendance.findMany({
    where: {
      date: { gte: lastMonday },
    },
    select: { date: true, present: true },
  });

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const attendanceMap: Record<string, { present: number; absent: number }> = {
    Mon: { present: 0, absent: 0 },
    Tue: { present: 0, absent: 0 },
    Wed: { present: 0, absent: 0 },
    Thu: { present: 0, absent: 0 },
    Fri: { present: 0, absent: 0 },
  };

  resData.forEach((item) => {
    const day = item.date.getDay();
    if (day >= 1 && day <= 5) {
      const dayName = daysOfWeek[day - 1];
      if (item.present) attendanceMap[dayName].present += 1;
      else attendanceMap[dayName].absent += 1;
    }
  });

  const data = daysOfWeek.map((name) => ({
    name,
    present: attendanceMap[name].present,
    absent: attendanceMap[name].absent,
  }));

  return <AttendanceChart data={data} />;
};

export default AttendanceChartContainer;
