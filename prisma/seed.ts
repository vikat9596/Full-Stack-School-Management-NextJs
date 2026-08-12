import { Day, PrismaClient, UserSex } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.result.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.event.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.student.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.class.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.admin.deleteMany();

  await prisma.admin.create({ data: { id: "admin1", username: "admin1" } });
  await prisma.admin.create({ data: { id: "admin2", username: "admin2" } });

  const grades = [];
  for (let i = 1; i <= 6; i++) {
    grades.push(await prisma.grade.create({ data: { level: i } }));
  }

  const classes = [];
  for (let i = 0; i < 6; i++) {
    classes.push(
      await prisma.class.create({
        data: {
          name: `${grades[i].level}A`,
          gradeId: grades[i].id,
          capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
        },
      })
    );
  }

  const subjectData = [
    "Mathematics",
    "Science",
    "English",
    "History",
    "Geography",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Art",
  ];

  const subjects = [];
  for (const name of subjectData) {
    subjects.push(await prisma.subject.create({ data: { name } }));
  }

  const teachers = [];
  for (let i = 1; i <= 15; i++) {
    teachers.push(
      await prisma.teacher.create({
        data: {
          id: `teacher${i}`,
          username: `teacher${i}`,
          name: `TName${i}`,
          surname: `TSurname${i}`,
          email: `teacher${i}@example.com`,
          phone: `100-456-78${String(i).padStart(2, "0")}`,
          address: `Address${i}`,
          bloodType: "A+",
          sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
          subjects: { connect: [{ id: subjects[(i - 1) % subjects.length].id }] },
          classes: { connect: [{ id: classes[(i - 1) % classes.length].id }] },
          birthday: new Date(
            new Date().setFullYear(new Date().getFullYear() - 30)
          ),
        },
      })
    );
  }

  for (let i = 0; i < classes.length; i++) {
    await prisma.class.update({
      where: { id: classes[i].id },
      data: { supervisorId: teachers[i].id },
    });
  }

  const lessons = [];
  const days = Object.values(Day);
  for (let i = 1; i <= 30; i++) {
    lessons.push(
      await prisma.lesson.create({
        data: {
          name: `Lesson${i}`,
          day: days[Math.floor(Math.random() * days.length)],
          startTime: new Date(new Date().setHours(8 + (i % 8), 0, 0, 0)),
          endTime: new Date(new Date().setHours(9 + (i % 8), 0, 0, 0)),
          subjectId: subjects[(i - 1) % subjects.length].id,
          classId: classes[(i - 1) % classes.length].id,
          teacherId: teachers[(i - 1) % teachers.length].id,
        },
      })
    );
  }

  const parents = [];
  for (let i = 1; i <= 25; i++) {
    parents.push(
      await prisma.parent.create({
        data: {
          id: `parentId${i}`,
          username: `parentId${i}`,
          name: `PName ${i}`,
          surname: `PSurname ${i}`,
          email: `parent${i}@example.com`,
          phone: `200-456-78${String(i).padStart(2, "0")}`,
          address: `Address${i}`,
        },
      })
    );
  }

  const students = [];
  for (let i = 1; i <= 50; i++) {
    const classIndex = (i - 1) % classes.length;
    students.push(
      await prisma.student.create({
        data: {
          id: `student${i}`,
          username: `student${i}`,
          name: `SName${i}`,
          surname: `SSurname ${i}`,
          email: `student${i}@example.com`,
          phone: `300-654-32${String(i).padStart(2, "0")}`,
          address: `Address${i}`,
          bloodType: "O-",
          sex: i % 2 === 0 ? UserSex.MALE : UserSex.FEMALE,
          parentId: parents[(i - 1) % parents.length].id,
          gradeId: grades[classIndex].id,
          classId: classes[classIndex].id,
          birthday: new Date(
            new Date().setFullYear(new Date().getFullYear() - 10)
          ),
        },
      })
    );
  }

  const exams = [];
  for (let i = 1; i <= 10; i++) {
    exams.push(
      await prisma.exam.create({
        data: {
          title: `Exam ${i}`,
          startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
          endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
          lessonId: lessons[(i - 1) % lessons.length].id,
        },
      })
    );
  }

  const assignments = [];
  for (let i = 1; i <= 10; i++) {
    assignments.push(
      await prisma.assignment.create({
        data: {
          title: `Assignment ${i}`,
          startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
          dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
          lessonId: lessons[(i - 1) % lessons.length].id,
        },
      })
    );
  }

  for (let i = 1; i <= 10; i++) {
    await prisma.result.create({
      data: {
        score: 70 + i,
        studentId: students[i - 1].id,
        ...(i <= 5
          ? { examId: exams[i - 1].id }
          : { assignmentId: assignments[i - 6].id }),
      },
    });
  }

  const monday = new Date();
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff);
  monday.setHours(9, 0, 0, 0);

  for (let i = 1; i <= 50; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + (i % 5));
    await prisma.attendance.create({
      data: {
        date,
        present: i % 4 !== 0,
        studentId: students[(i - 1) % students.length].id,
        lessonId: lessons[(i - 1) % lessons.length].id,
      },
    });
  }

  for (let i = 1; i <= 5; i++) {
    const start = new Date();
    start.setDate(start.getDate() + i - 2);
    start.setHours(10, 0, 0, 0);
    const end = new Date(start);
    end.setHours(12, 0, 0, 0);
    await prisma.event.create({
      data: {
        title: `Event ${i}`,
        description: `Description for Event ${i}`,
        startTime: start,
        endTime: end,
        classId: classes[(i - 1) % classes.length].id,
      },
    });
  }

  for (let i = 1; i <= 5; i++) {
    await prisma.announcement.create({
      data: {
        title: `Announcement ${i}`,
        description: `Description for Announcement ${i}`,
        date: new Date(),
        classId: classes[(i - 1) % classes.length].id,
      },
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
