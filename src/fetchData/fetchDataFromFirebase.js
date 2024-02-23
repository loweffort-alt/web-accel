import { app } from "../firebaseConfig/realtimeData/index";
import { getDatabase, ref, child, get } from "firebase/database";

const databaseRef = ref(getDatabase(app));

export function fetchDataFromFirebase() {
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
