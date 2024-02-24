import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export const LineChart = ({ chartData }) => {
  return (
    <>
      <Line data={chartData} />
    </>
  );
};
