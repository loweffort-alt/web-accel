import { app } from "../firebaseConfig/realtimeData/index";
import { getDatabase, ref, child, get } from "firebase/database";

const databaseRef = ref(getDatabase(app));

function calcularDiferenciasDeTiempoEnMilisegundos(arrayDeTiempos) {
  const diferenciasEnMilisegundos = [];
  for (let i = 1; i < arrayDeTiempos.length; i++) {
    const diferenciaEnMilisegundos = arrayDeTiempos[i] - arrayDeTiempos[i - 1];
    diferenciasEnMilisegundos.push(diferenciaEnMilisegundos / 1000);
  }

  return diferenciasEnMilisegundos;
}

export async function getInfoDeviceFromFirebase() {
  const snapshot = await get(child(databaseRef, "infoDevice"));
  if (snapshot.exists()) {
    const rawData = snapshot.val();
    const firebaseDeviceInfo = Object.entries(rawData).map((el) => ({
      id: el[0],
      deviceManufacturer: el[1].deviceManufacturer,
      deviceModel: el[1].deviceModel,
      appVersion: el[1].appVersion,
      deviceSDKVersion: el[1].deviceSDKVersion,
      currentLocation: el[1].currentLocation,
    }));
    return { firebaseDeviceInfo };
  } else {
    throw new Error("No data available");
  }
}

//const infoDeviceFromFirebase = await getInfoDeviceFromFirebase();
//const infoDeviceIdArray = infoDeviceFromFirebase.deviceId;
const wea = {
  id: "none",
};

export async function getAccelDataFromFirebase(selectedDevice = wea) {
  try {
    const snapshot = await get(child(databaseRef, `${selectedDevice.id}`));
    if (snapshot.exists()) {
      const rawData = snapshot.val().sismicData;
      const filteredData = Object.values(rawData).map((el, i) => ({
        dataX: parseFloat(el.x),
        dataY: parseFloat(el.y),
        dataZ: parseFloat(el.z),
        currentTime: el.timestamp,
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
      return {
        sensorData: filteredData,
        maxValues,
        startTime,
        endTime,
        difMilSec,
      };
    } else {
      return {
        sensorData: [],
        maxValues: [],
        startTime: null,
        endTime: null,
        difMilSec: [],
      };
    }
  } catch (error) {
    console.log(error);
  }
  //const infoDeviceFromFirebase = await getInfoDeviceFromFirebase();
  //const infoDeviceIdArray = infoDeviceFromFirebase.firebaseDe;
  //let accelDataFromFirebase;
  //for (const deviceId of infoDeviceIdArray) {
  //const snapshot = await get(child(databaseRef, `${selectedDevice}`));
  //if (snapshot.exists()) {
  //const rawData = snapshot.val().sismicData;
  //const filteredData = Object.values(rawData).map((el, i) => ({
  //dataX: parseFloat(el.x),
  //dataY: parseFloat(el.y),
  //dataZ: parseFloat(el.z),
  //currentTime: el.timestamp,
  //numberData: i,
  //}));
  //const maxValues = ["dataX", "dataY", "dataZ"].map((axis) =>
  //Math.max(...filteredData.map((entry) => Math.abs(entry[axis]))),
  //);
  //const arrayMiliseconds = filteredData.map((el) => el.currentTime);
  //const difMilSec =
  //calcularDiferenciasDeTiempoEnMilisegundos(arrayMiliseconds);
  //const startTime =
  //filteredData.length > 0 ? filteredData[0].currentTime : null;
  //const endTime =
  //filteredData.length > 0
  //? filteredData[filteredData.length - 1].currentTime
  //: null;
  //accelDataFromFirebase = {
  //sensorData: filteredData,
  //maxValues,
  //startTime,
  //endTime,
  //difMilSec,
  //};
  //} else {
  //throw new Error("No data available");
  //}
  //}
  //return accelDataFromFirebase;
}
