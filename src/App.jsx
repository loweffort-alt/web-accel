import React, { useEffect, useState } from "react";
import "./App.css";
import { app } from "./realtimeData/index";
import { getDatabase, ref, child, get } from "firebase/database";

function fetchDataFromFirebase(databaseRef) {
  return get(child(databaseRef, "data")).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const allData = Object.values(data).map((el) => ({
        dataX: parseFloat(el.dataX),
        dataY: parseFloat(el.dataY),
        dataZ: parseFloat(el.dataZ),
        currentTime: el.currentTime,
      }));
      const maxValues = ["dataX", "dataY", "dataZ"].map((axis) =>
        Math.max(...allData.map((entry) => Math.abs(entry[axis]))),
      );
      const startTime = allData.length > 0 ? allData[0].currentTime : null;
      return { sensorData: allData, maxValues, startTime };
    } else {
      throw new Error("No data available");
    }
  });
}

function fetchDataFromExternalAPI(setDataIGP) {
  fetch("https://server-acce.onrender.com/proxy")
    .then((res) => res.json())
    .then((data) => setDataIGP(data[0]))
    .catch((error) =>
      console.error("Error fetching data from external API:", error),
    );
}

function App() {
  const databaseRef = ref(getDatabase(app));
  const [sensorData, setSensorData] = useState([]);
  const [dataIGP, setDataIGP] = useState({});
  const [maxValues, setMaxValues] = useState([]);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    fetchDataFromFirebase(databaseRef).then(
      ({ sensorData, maxValues, startTime }) => {
        setSensorData(sensorData);
        setMaxValues(maxValues);
        setStartTime(startTime);
      },
    );
    fetchDataFromExternalAPI(setDataIGP);
  }, [databaseRef]);

  return (
    <>
      <h1>Centro de monitoreo de estaciones sísmicas</h1>

      <h2>1. Información sobre la estación sísmica</h2>
      <p>Grupo: xxxxxxx</p>
      <p>Estación: xxxxxxx</p>
      <p>Canales: X Y Z</p>
      <p>Frecuencia de muestreo(Hz): 100.0</p>
      <p>Coordenadas: xxx</p>

      <h2>2. Información sobre el sismo</h2>
      <p>Fecha: {dataIGP.FechaLocal}</p>
      <p>Hora Inicio (Local): {dataIGP.HoraLocal}</p>
      <p>Latitud: {dataIGP.Latitud}</p>
      <p>Longitud: {dataIGP.Longitud}</p>
      <p>Profundidad (Km): {dataIGP.Profundidad}</p>
      <p>Magnitud: {dataIGP.Magnitud}</p>
      <p>Referencia: {dataIGP.Referencia}</p>
      <p>Fuente: IGP</p>

      <h2>3. Información sobre el registro</h2>
      <p>Hora de inicio (UTC-0): {startTime}</p>
      <p>Número de datos: {sensorData.length}</p>
      <p>Unidad: cm/s2</p>
      <p>
        Aceleraciones máximas: {maxValues[0]} {maxValues[1]} {maxValues[2]}
      </p>

      <h2>4. Comentarios: </h2>

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
}

export default App;
