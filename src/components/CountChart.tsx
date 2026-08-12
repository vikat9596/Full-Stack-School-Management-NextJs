"use client";

import Image from "next/image";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";

const CountChart = ({ boys, girls }: { boys: number; girls: number }) => {
  const total = boys + girls || 1;
  const data = [
    { name: "Total", count: total, fill: "white" },
    { name: "Girls", count: girls, fill: "#FAE27C" },
    { name: "Boys", count: boys, fill: "#C3EBFA" },
  ];

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={30}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/maleFemale.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      <div className="flex justify-evenly gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-sky rounded-full" />
          <h1 className="font-bold">{boys}</h1>
          <h2 className="text-xs text-gray-300">
            Boys ({Math.round((boys / total) * 100)}%)
          </h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-yellow rounded-full" />
          <h1 className="font-bold">{girls}</h1>
          <h2 className="text-xs text-gray-300">
            Girls ({Math.round((girls / total) * 100)}%)
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
