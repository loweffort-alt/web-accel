import { app } from "../firebaseConfig/realtimeData/index";
import { getDatabase, ref, child, get } from "firebase/database";

const databaseRef = ref(getDatabase(app));

function calcularDiferenciasDeTiempoEnMilisegundos(arrayDeTiempos) {
  const tiemposEnDate = arrayDeTiempos.map((tiempo) => {
    const [horas, minutos, segundos, milisegundos] = tiempo
      .split(/[:.]/)
      .map(Number);
    return new Date(0, 0, 0, horas, minutos, segundos, milisegundos);
  });

  const diferenciasEnMilisegundos = [];
  for (let i = 1; i < tiemposEnDate.length; i++) {
    const diferenciaEnMilisegundos = tiemposEnDate[i] - tiemposEnDate[i - 1];
    diferenciasEnMilisegundos.push(diferenciaEnMilisegundos / 1000);
  }

  return diferenciasEnMilisegundos;
}

export async function getInfoDeviceFromFirebase() {
  const snapshot = await get(child(databaseRef, "infoDevice"));
  if (snapshot.exists()) {
    const rawData = snapshot.val();
    const deviceId = Object.keys(rawData);
    const deviceInfo = Object.values(rawData).map((el) => ({
      deviceManufacturer: el.deviceManufacturer,
      deviceModel: el.deviceModel,
      appVersion: el.appVersion,
      deviceSDKVersion: el.deviceSDKVersion,
    }));
    return { deviceId, deviceInfo };
  } else {
    throw new Error("No data available");
  }
}

//const infoDeviceFromFirebase = await getInfoDeviceFromFirebase();
//const infoDeviceIdArray = infoDeviceFromFirebase.deviceId;

export async function getAccelDataFromFirebase() {
  const infoDeviceFromFirebase = await getInfoDeviceFromFirebase();
  const infoDeviceIdArray = infoDeviceFromFirebase.deviceId;
  let accelDataFromFirebase;
  for (const deviceId of infoDeviceIdArray) {
    const snapshot = await get(child(databaseRef, `${deviceId}`));
    if (snapshot.exists()) {
      const rawData = snapshot.val();
      const filteredData = Object.values(rawData).map((el, i) => ({
        dataX: parseFloat(el.dataX),
        dataY: parseFloat(el.dataY),
        dataZ: parseFloat(el.dataZ),
        currentTime: el.currentTime,
        numberData: i,
      }));
      const maxValues = ["dataX", "dataY", "dataZ"].map((axis) =>
        Math.max(...filteredData.map((entry) => Math.abs(entry[axis]))),
      );
      const arrayMiliseconds = filteredData.map((el) => el.currentTime);
      const difMilSec =
        calcularDiferenciasDeTiempoEnMilisegundos(arrayMiliseconds);
      const startTime =
        filteredData.length > 0 ? filteredData[0].currentTime : null;
      const endTime =
        filteredData.length > 0
          ? filteredData[filteredData.length - 1].currentTime
          : null;
      accelDataFromFirebase = {
        sensorData: filteredData,
        maxValues,
        startTime,
        endTime,
        difMilSec,
      };
    } else {
      throw new Error("No data available");
    }
  }
  return accelDataFromFirebase;
}
