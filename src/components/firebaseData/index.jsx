import { useEffect, useState } from "react";
import { fetchDataFromFirebase } from "../../fetchData/fetchDataFromFirebase";
import { LineChart } from "../../components/lineChart";

export const FirebaseData = () => {
  const [sensorData, setSensorData] = useState([]);
  const [maxValues, setMaxValues] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [{}],
  });

  useEffect(() => {
    fetchDataFromFirebase().then(({ sensorData, maxValues, startTime }) => {
      setSensorData(sensorData);
      setMaxValues(maxValues);
      setStartTime(startTime);
    });
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

      <div className="rounded-xl p-3 flex flex-col gap-2 items-center m-auto">
        <h2 className="text-lg font-bold text-center">Datos del registro</h2>

        <div className="w-[1000px] h-full bg-white m-auto p-5">
          <LineChart chartData={graphData} />
        </div>

        <div className="olas hidden">
          <table>
            <thead>
              <tr>
                <th>Eje X</th>
                <th>Eje Y</th>
                <th>Eje Z</th>
                <th>Time</th>
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
      </div>
    </>
  );
};
