import { useEffect, useState } from "react";
import { fetchDataFromExternalAPI } from "../../fetchData/fetchDataFromExternalAPI";

export const IGPInfo = () => {
  const [dataIGP, setDataIGP] = useState({});

  useEffect(() => {
    fetchDataFromExternalAPI(setDataIGP);
  }, []);

  return (
    <>
      <h2>2. Último Sismo Registrado</h2>
      <p>Fecha: {dataIGP.FechaLocal}</p>
      <p>Hora Inicio (Local): {dataIGP.HoraLocal}</p>
      <p>Latitud: {dataIGP.Latitud}</p>
      <p>Longitud: {dataIGP.Longitud}</p>
      <p>Profundidad (Km): {dataIGP.Profundidad}</p>
      <p>Magnitud: {dataIGP.Magnitud}</p>
      <p>Referencia: {dataIGP.Referencia}</p>
      <p>Fuente: IGP</p>
    </>
  );
};
