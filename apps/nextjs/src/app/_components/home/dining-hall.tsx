"use client";

import React from "react";
import Link from "next/link";
import { CircularProgressbar } from "react-circular-progressbar";

interface DiningHallProps {
  title: string;
  imageUrl: string;
  availability: number;
  id: number;
}
export const DiningHall: React.FC<DiningHallProps> = ({
  title,
  imageUrl,
  availability,
  id,
}) => {
  return (
    // https://flowbite.com/docs/components/card/
    <Link href={{ pathname: "/dining-hall", query: { title: title, id: id } }}>
      <div className="mx-2 mt-8 max-w-sm overflow-hidden rounded-lg border-2 border-violet-800/30 bg-white bg-white/40 shadow-lg backdrop-blur transition ease-in-out hover:-translate-y-1 hover:scale-110 hover:shadow-sky-100">
        <img className="w-full rounded-t-lg" src={imageUrl} alt={title} />
        <div className="px-6 py-4">
          <h1 className="mb-2 text-center text-4xl font-bold">{title}</h1>
          <h2 className=" mt-4 text-center text-xl font-bold text-gray-700">
            Availability:
          </h2>
          <CircularProgressbar
            className="mt-4 flex h-28 items-center justify-center"
            value={availability}
            text={`${availability}%`}
            strokeWidth={5}
          />
        </div>
      </div>
    </Link>
  );
};
