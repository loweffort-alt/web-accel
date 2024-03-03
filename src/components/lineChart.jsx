import {
  Chart as ChartJS,
  LineElement,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js/auto";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
);

const weaObject = {
  // Turn off animations and data parsing for performance
  interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false,
  },
  plugins: {
    legend: {
      labels: {
        font: {
          size: 14,
        },
      },
    },
    subtitle: {
      display: true,
      text: "mamavinga",
    },
    decimation: {
      enable: true,
      algorithm: "lttb",
      samples: "50",
    },
  },
  scales: {
    x: {
      //type: "time",
      //time: {
      //minUnit: "milisecond",
      //},
      ticks: {
        source: "auto",
        // Disabled rotation for performance
        maxRotation: 0,
        autoSkip: true,
      },
    },
  },
};

export const LineChart = ({ chartData }) => {
  return (
    <>
      <Line data={chartData} options={weaObject} />
    </>
  );
};
