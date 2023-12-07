"use client";

import React from "react";
import Link from "next/link";
import { Text } from "@radix-ui/themes";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";

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
  const color = getAvailabilityColor(availability);

  return (
    // https://flowbite.com/docs/components/card/
    <Link href={{ pathname: "/dining-hall", query: { title: title, restaurantId: id } }}>
      <div className="hover:scale-102 mx-2 mt-8 max-w-sm overflow-hidden rounded-lg border-2 border-violet-800/30 bg-white bg-white/40 shadow-lg backdrop-blur transition ease-in-out hover:-translate-y-1 hover:shadow-sky-100">
        <img className="w-full rounded-t-lg" src={imageUrl} alt={title} />
        <div className="px-4 py-4">
          <Text weight="medium" as="div" size="8" align="center">
            {title}
          </Text>
          <div className="mt-5">
            <Text weight="medium" as="div" size="6" align="center" color="gray">
              Availability:
            </Text>
            <CircularProgressbar
              className="mt-4 flex h-28 items-center justify-center"
              value={availability}
              text={`${availability}%`}
              strokeWidth={5}
              styles={buildStyles({
                pathColor: color,
                textColor: color,
                trailColor: "#d6d6d6",
                backgroundColor: color,
              })}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

function getAvailabilityColor(availability: number): string {
  if (availability <= 33) {
    return "#008000"; // Green
  } else if (availability <= 66) {
    return "#FFA500"; // Orange
  } else {
    return "#FF0000"; // Red
  }
}
