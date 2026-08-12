import EventCalendar from "./EventCalendar";
import prisma from "@/lib/prisma";

const EventCalendarContainer = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const dateParam = searchParams.date;
  const selected = dateParam ? new Date(dateParam) : new Date();
  const start = new Date(selected);
  start.setHours(0, 0, 0, 0);
  const end = new Date(selected);
  end.setHours(23, 59, 59, 999);

  const events = await prisma.event.findMany({
    where: {
      startTime: {
        gte: start,
        lte: end,
      },
    },
    take: 10,
    orderBy: { startTime: "asc" },
  });

  // Also fetch a few upcoming if none on selected day
  const fallback =
    events.length > 0
      ? events
      : await prisma.event.findMany({
          take: 5,
          orderBy: { startTime: "asc" },
        });

  return (
    <EventCalendar
      events={fallback.map((e) => ({
        ...e,
        startTime: e.startTime.toISOString(),
        endTime: e.endTime.toISOString(),
      }))}
    />
  );
};

export default EventCalendarContainer;
