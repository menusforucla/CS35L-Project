import React from "react";
import { Bar } from "react-chartjs-2";

import "chart.js/auto";

export default function DiningHallActivity() {
  const activityData = [22, 56, 97, 82];

  const barColors = activityData.map((level) => {
    if (level < 33) return "green";
    else if (level < 66) return "orange";
    else return "red";
  });

  const data = {
    labels: ["5 PM", "6 PM", "7 PM", "8 PM"],
    datasets: [
      {
        label: "Activity Level (%)",
        data: activityData,
        backgroundColor: barColors,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return <Bar data={data} options={options} />;
}
