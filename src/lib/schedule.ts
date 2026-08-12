export const adjustScheduleToCurrentWeek = (
  lessons: { title: string; start: Date; end: Date }[]
): { title: string; start: Date; end: Date }[] => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  return lessons.map((lesson) => {
    const lessonDay = lesson.start.getDay();
    const daysFromMonday = lessonDay === 0 ? 6 : lessonDay - 1;

    const start = new Date(monday);
    start.setDate(monday.getDate() + daysFromMonday);
    start.setHours(lesson.start.getHours(), lesson.start.getMinutes(), 0, 0);

    const end = new Date(monday);
    end.setDate(monday.getDate() + daysFromMonday);
    end.setHours(lesson.end.getHours(), lesson.end.getMinutes(), 0, 0);

    return { title: lesson.title, start, end };
  });
};
