import { useEffect, useState } from "react";
import { fetchDataFromFirebase } from "../../fetchData/fetchDataFromFirebase";

export const FirebaseData = () => {
  const [sensorData, setSensorData] = useState([]);
  const [maxValues, setMaxValues] = useState([]);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    fetchDataFromFirebase().then(({ sensorData, maxValues, startTime }) => {
      setSensorData(sensorData);
      setMaxValues(maxValues);
      setStartTime(startTime);
    });
  }, [sensorData]);

  return (
    <>
      <h2>3. Información sobre el registro</h2>
      <p>Hora de inicio (UTC-0): {startTime}</p>
      <p>Número de datos: {sensorData.length}</p>
      <p>Unidad: cm/s2</p>
      <p>
        Aceleraciones máximas: {maxValues[0]} {maxValues[1]} {maxValues[2]}
      </p>

      <h2>5. Datos del registro</h2>
      <div className="olas">
        <table>
          <thead>
            <tr>
              <th>Eje X</th>
              <th>Eje Y</th>
              <th>Eje Z</th>
              <th>Registered time</th>
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
    </>
  );
};
