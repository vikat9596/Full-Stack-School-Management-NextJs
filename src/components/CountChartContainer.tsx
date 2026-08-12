import CountChart from "./CountChart";
import prisma from "@/lib/prisma";

const CountChartContainer = async () => {
  const [boys, girls] = await Promise.all([
    prisma.student.count({ where: { sex: "MALE" } }),
    prisma.student.count({ where: { sex: "FEMALE" } }),
  ]);

  return <CountChart boys={boys} girls={girls} />;
};

export default CountChartContainer;
