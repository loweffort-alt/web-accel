import "./App.css";
import { DeviceInfo } from "./components/deviceInfo";
import { IGPInfo } from "./components/infoIGP";
import { FirebaseData } from "./components/firebaseData";

function App() {
  return (
    <>
      <DeviceInfo />
      <IGPInfo />
      <FirebaseData />
    </>
  );
}

export default App;
