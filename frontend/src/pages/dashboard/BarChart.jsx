import React from "react";
import { Pie } from "react-chartjs-2";

const labels = ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"];

const pieData = {
  labels,
  datasets: [
    {
      label: "Pie Chart Detailed Data",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "#FF6384",
        "#36A2EB",
        "#FFCE56",
        "#4BC0C0",
        "#9966FF",
        "#FF9F40",
      ],
      hoverOffset: 10,
    },
  ],
};

export default function BarChart() {
  return (
    <div className="p-4 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Pie Chart Details</h2>
      <Pie data={pieData} />
    </div>
  );
}
