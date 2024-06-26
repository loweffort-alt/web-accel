import { useEffect, useState } from "react";
import { getAccelDataFromFirebase } from "../../fetchData/fetchDataFromFirebase";
import { LineChart } from "../../components/lineChart";

export const FirebaseData = ({ selectedDevice }) => {
  const [showData, setShowData] = useState(false);
  const [sensorData, setSensorData] = useState([]);
  const [maxValues, setMaxValues] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
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
    try {
      getAccelDataFromFirebase(selectedDevice).then(
        ({ sensorData, maxValues, startTime, endTime, difMilSec }) => {
          setSensorData(sensorData);
          setMaxValues(maxValues);
          setStartTime(startTime);
          setEndTime(endTime);
          setDiffTime(difMilSec);
        },
      );
    } catch (error) {
      console.log(error);
    }
  }, [selectedDevice]);

  useEffect(() => {
    setGraphData({
      labels: sensorData.map((e, i) => i),
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
          borderColor: "#8A2BE2",
          pointBackgroundColor: "#8A2BE2",
          pointRadius: 1,
          showLine: false,
        },
      ],
    });
  }, [selectedDevice, sensorData]);

  function generateBlob() {
    const csvLines = [];
    if (sensorData[0]) {
      const accelDataCSV = sensorData;
      //const devicesDataCSV = dev
      const headers = Object.keys(accelDataCSV[0]).join(",");
      csvLines.push(headers);

      accelDataCSV.forEach((obj) => {
        const row = Object.values(obj).join(",");
        csvLines.push(row);
      });

      const csvString = csvLines.join("\n");

      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });

      return blob;
    } else {
      console.log("no hay datos");
      return null;
    }
  }

  function downLoadDataCSV() {
    const blob = generateBlob();
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "datosAccel.csv"); // Nombre del archivo
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No data on device");
    }
  }

  const noData = "No data on device";

  return (
    <>
      <div className="border-white border-2 rounded-xl p-3 flex flex-col gap-2 m-auto">
        <h2 className="text-lg font-bold text-center">
          Información sobre el registro
        </h2>
        <p>Hora de inicio (UTC-0): {startTime ? startTime : noData}</p>
        <p>Hora de fin (UTC-0): {endTime ? endTime : noData}</p>
        <p>Número de datos: {sensorData[0] ? sensorData.length : noData}</p>
        <p>Unidad: cm/s2</p>
        <p>
          Aceleraciones máximas
          <br />
          Eje X: {maxValues[0] ? maxValues[0] : noData}
          <br />
          Eje Y: {maxValues[0] ? maxValues[1] : noData}
          <br />
          Eje Z: {maxValues[0] ? maxValues[2] : noData}
          <br />
        </p>
      </div>

      <button
        onClick={() => downLoadDataCSV()}
        className="bg-yellow-800 rounded-xl w-36 h-10 m-auto font-bold"
      >
        Descargar CSV
      </button>

      <div className="sm:p-3 flex flex-col gap-10 items-center m-auto w-full">
        <div className="w-full">
          <h2 className="text-lg font-bold text-center mb-5">
            Datos del registro
          </h2>
          <div className="bg-white m-auto p-5 rounded-xl sm:rounded-3xl">
            <LineChart chartData={graphData} />
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-lg font-bold text-center mb-5">
            Precisión del registro
          </h2>
          <div className="bg-white m-auto p-5 rounded-xl sm:rounded-3xl">
            <LineChart chartData={grahpAccuracy} />
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center">
        <button
          type="button"
          className="mb-10 text-white hover:text-white border border-white hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
          onClick={() => setShowData(!showData)}
        >
          Mostrar Datos
        </button>

        {showData && (
          <div>
            <table className="border-separate border-spacing-x-2 sm:border-spacing-x-10 border-spacing-y-3 border border-white rounded-lg p-5 text-center">
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
    </>
  );
};
