import { initializeApp } from "firebase/app";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJoNjQP328QMNTNREXs4O2H5XGcF-Ln7M",
  authDomain: "accelerometer-c758f.firebaseapp.com",
  databaseURL: "https://accelerometer-c758f-default-rtdb.firebaseio.com",
  projectId: "accelerometer-c758f",
  storageBucket: "accelerometer-c758f.appspot.com",
  messagingSenderId: "219815381267",
  appId: "1:219815381267:web:85ddd8ef2e10f43e5d32e6",
  measurementId: "G-B7PJ1MXDMM",
  databaseURL: "https://accelerometer-c758f-default-rtdb.firebaseio.com/",
};

export const app = initializeApp(firebaseConfig);
