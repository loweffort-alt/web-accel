import { useEffect, useState } from "react";
import "./App.css";
import { app } from "./realtimeData/index";
import { getDatabase, ref, child, get } from "firebase/database";

function App() {
  const database = ref(getDatabase(app));

  const [sensorData, setSensorData] = useState({});
  const [dataIGP, setDataIGP] = useState([]);
  const [maxValues, setMaxValues] = useState([]);

  useEffect(() => {
    get(child(database, "data"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const wea = snapshot.val();
          const allDataX = [];
          const allDataY = [];
          const allDataZ = [];
          Object.values(wea).forEach((el) => {
            allDataX.push(parseFloat(el.dataX));
            allDataY.push(parseFloat(el.dataY));
            allDataZ.push(parseFloat(el.dataZ));
          });
          const maxValueX = allDataX.reduce((acc, el) =>
            Math.max(Math.abs(acc), Math.abs(el)),
          );
          const maxValueY = allDataY.reduce((acc, el) =>
            Math.max(Math.abs(acc), Math.abs(el)),
          );
          const maxValueZ = allDataZ.reduce((acc, el) =>
            Math.max(Math.abs(acc), Math.abs(el)),
          );
          setMaxValues([maxValueX, maxValueY, maxValueZ]);
          setSensorData(wea);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    const fetchData = async () => {
      const res = await fetch("https://server-acce.onrender.com/proxy");
      const data = await res.json();
      setDataIGP(data[0]);
    };
    fetchData();
  }, []);

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
      <p>Fuente: IGP</p>

      <h2>3. Información sobre el registro</h2>
      <p>Hora de inicio (UTC-0): </p>
      <p>Número de datos: {Object.entries(sensorData).length}</p>
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
            </tr>
          </thead>
          <tbody>
            {Object.entries(sensorData).map(([id, val]) => (
              <tr key={id}>
                <td>{val.dataX}</td>
                <td>{val.dataY}</td>
                <td>{val.dataZ}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
