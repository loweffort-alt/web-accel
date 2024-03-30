import { useEffect, useState } from "react";
import { getInfoDeviceFromFirebase } from "../../fetchData/fetchDataFromFirebase";

export const DeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState([]);
  const [deviceId, setDeviceId] = useState([]);

  useEffect(() => {
    getInfoDeviceFromFirebase().then(({ deviceInfo, deviceId }) => {
      setDeviceInfo(deviceInfo);
      setDeviceId(deviceId);
    });
  }, []);

  return (
    <>
      <div className="border-white border-2 rounded-xl p-3 flex flex-col gap-2">
        <h2 className="text-lg font-bold text-center">Estación sísmica</h2>
        <p>
          Dispositivo:
          {deviceInfo[0]
            ? deviceInfo[0].deviceManufacturer + " " + deviceInfo[0].deviceModel
            : "No data"}
        </p>
        <p>
          Versión de la app:
          {deviceInfo[0] ? deviceInfo[0].appVersion : "No data"}
        </p>
        <p>
          Versión del SDK:
          {deviceInfo[0] ? deviceInfo[0].deviceSDKVersion : "No data"}
        </p>
        <p>Canales: X Y Z</p>
        <p>Frecuencia de muestreo(Hz): 100.0</p>
        <p>
          Coordenadas:
          <br />
          Latitud:{" "}
          {deviceInfo[0]
            ? deviceInfo[0].currentLocation.latitude
            : "No data"}{" "}
          <br />
          Longitud:{" "}
          {deviceInfo[0] ? deviceInfo[0].currentLocation.longitude : "No data"}
          <br />
          Altitud:{" "}
          {deviceInfo[0] ? deviceInfo[0].currentLocation.altitude : "No data"}
          <br />
        </p>
      </div>
    </>
  );
};
