import React from "react";
import { Bar } from "react-chartjs-2";

import "chart.js/auto";

export default function DiningHallActivity() {
  const activityData = [22, 31, 44, 56, 78, 97, 82, 67];

  const barColors = activityData.map((level) => {
    if (level < 33) return "#6fc276";
    else if (level < 66) return "#ff964f";
    else return "red";
  });

  const data = {
    labels: ["5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM"],
    datasets: [
      {
        label: "Activity Level (%)",
        data: activityData,
        backgroundColor: barColors,
        borderRadius: 10,
        categoryPercentage: .75,
        
      },
    ],
    
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: 'black',
          font: {
            size: 17, // Set font size for x-axis ticks
          },
        }
      },
      x: {
        ticks: {
          color: 'black', // Set font color for x-axis ticks
          font: {
            size: 17, // Set font size for x-axis ticks
          },    // Set font size for x-axis ticks
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: 'black', // Set font color for legend labels
          font: {
            size: 17, // Set font size for x-axis ticks
          },
        },
      },
    },
    responsive: true, // Ensure that the chart is responsive
    maintainAspectRatio: false,
  };
  return <Bar data={data} options={options}/>;
}
