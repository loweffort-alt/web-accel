import { useEffect, useState } from "react";
import { fetchDataFromFirebase } from "../../fetchData/fetchDataFromFirebase";
import { LineChart } from "../../components/lineChart";

export const FirebaseData = () => {
  const [showData, setShowData] = useState(false);
  const [sensorData, setSensorData] = useState([]);
  const [maxValues, setMaxValues] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [diffTime, setDiffTime] = useState([]);
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [{}],
  });
  const [grahpAccuracy, setGraphAccuracy] = useState({
    labels: [],
    datasets: [{}],
  });

  useEffect(() => {
    fetchDataFromFirebase().then(
      ({ sensorData, maxValues, startTime, difMilSec }) => {
        setSensorData(sensorData);
        setMaxValues(maxValues);
        setStartTime(startTime);
        setDiffTime(difMilSec);
      },
    );
  }, []);

  useEffect(() => {
    setGraphData({
      labels: sensorData.map((e) => e.currentTime),
      datasets: [
        {
          label: "Eje X",
          data: sensorData.map((e) => e.dataX),
          borderColor: "#27ae60",
          borderWidth: 1,
          pointRadius: 2,
        },
        {
          label: "Eje Y",
          data: sensorData.map((e) => e.dataY),
          borderColor: "#c0392b",
          borderWidth: 1,
          pointRadius: 2,
        },
        {
          label: "Eje Z",
          data: sensorData.map((e) => e.dataZ),
          borderColor: "#2980b9",
          borderWidth: 1,
          pointRadius: 2,
        },
      ],
    });
    setGraphAccuracy({
      labels: sensorData.map((e) => e.numberData),
      datasets: [
        {
          label: "Diferencia de tiempo entre cada dato",
          data: diffTime,
          borderColor: "#34a853",
          pointBackgroundColor: "#34a853",
          pointRadius: 2,
          showLine: false,
        },
      ],
    });
  }, [sensorData]);

  return (
    <>
      <div className="border-white border-2 rounded-xl p-3 flex flex-col gap-2 m-auto">
        <h2 className="text-lg font-bold text-center">
          Información sobre el registro
        </h2>
        <p>Hora de inicio (UTC-0): {startTime}</p>
        <p>Número de datos: {sensorData.length}</p>
        <p>Unidad: cm/s2</p>
        <p>
          Aceleraciones máximas: {maxValues[0]} {maxValues[1]} {maxValues[2]}
        </p>
      </div>

      <div className="p-3 flex flex-col gap-10 items-center m-auto">
        <div>
          <h2 className="text-lg font-bold text-center mb-5">
            Datos del registro
          </h2>
          <div className="w-[1000px] h-full bg-white m-auto p-5 rounded-3xl">
            <LineChart chartData={graphData} />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold text-center mb-5">
            Precisión del registro
          </h2>
          <div className="w-[1000px] h-full bg-white m-auto p-5 rounded-3xl">
            <LineChart chartData={grahpAccuracy} />
          </div>
        </div>

        <div className="mt-5 flex flex-col">
          <button
            type="button"
            className="mb-10 text-white hover:text-white border border-white hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
            onClick={() => setShowData(!showData)}
          >
            Mostrar Datos
          </button>

          {showData && (
            <div>
              <table className="border-separate border-spacing-x-10 border-spacing-y-3 border border-white rounded-lg p-5 text-center">
                <thead>
                  <tr>
                    <th className="border-2 border-red-500">Eje X</th>
                    <th className="border-2 border-red-500">Eje Y</th>
                    <th className="border-2 border-red-500">Eje Z</th>
                    <th className="border-2 border-red-500">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {sensorData.map((entry, index) => (
                    <tr key={index}>
                      <td>{entry.dataX}</td>
                      <td>{entry.dataY}</td>
                      <td>{entry.dataZ}</td>
                      <td>{entry.currentTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
