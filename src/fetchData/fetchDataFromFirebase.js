import { app } from "../firebaseConfig/realtimeData/index";
import { getDatabase, ref, child, get } from "firebase/database";

const databaseRef = ref(getDatabase(app));

export async function fetchDataFromFirebase() {
  const snapshot = await get(child(databaseRef, "data"));
  if (snapshot.exists()) {
    const rawData = snapshot.val();
    const filteredData = Object.values(rawData).map((el) => ({
      dataX: parseFloat(el.dataX),
      dataY: parseFloat(el.dataY),
      dataZ: parseFloat(el.dataZ),
      currentTime: el.currentTime,
    }));
    const maxValues = ["dataX", "dataY", "dataZ"].map((axis) =>
      Math.max(...filteredData.map((entry) => Math.abs(entry[axis]))),
    );
    const startTime =
      filteredData.length > 0 ? filteredData[0].currentTime : null;
    return { sensorData: filteredData, maxValues, startTime };
  } else {
    throw new Error("No data available");
  }
}
