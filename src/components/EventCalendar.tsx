"use client";

import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type EventItem = {
  id: number;
  title: string;
  description: string;
  startTime: string | Date;
  endTime: string | Date;
};

const EventCalendar = ({ events }: { events: EventItem[] }) => {
  const [value, onChange] = useState<Value>(new Date());
  const selected = value instanceof Date ? value : new Date();

  const filtered = events.filter((event) => {
    const d = new Date(event.startTime);
    return (
      d.getFullYear() === selected.getFullYear() &&
      d.getMonth() === selected.getMonth() &&
      d.getDate() === selected.getDate()
    );
  });

  const shown = filtered.length ? filtered : events.slice(0, 3);

  return (
    <div className="bg-white p-4 rounded-md">
      <Calendar onChange={onChange} value={value} />
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold my-4">Events</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        {shown.map((event) => (
          <div
            className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-sky even:border-t-purple"
            key={event.id}
          >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-gray-600">{event.title}</h1>
              <span className="text-gray-300 text-xs">
                {new Date(event.startTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}{" "}
                -{" "}
                {new Date(event.endTime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })}
              </span>
            </div>
            <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
          </div>
        ))}
        {!events.length && (
          <p className="text-sm text-gray-400">No upcoming events.</p>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
