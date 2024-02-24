import "./App.css";
import { DeviceInfo } from "./components/deviceInfo";
import { IGPInfo } from "./components/infoIGP";
import { FirebaseData } from "./components/firebaseData";

function App() {
  return (
    <>
      <div className="flex flex-col gap-5 m-10">
        <h1 className="text-2xl font-bold m-auto">
          Centro de monitoreo de estaciones sísmicas
        </h1>
        <div className="flex m-auto gap-5">
          <DeviceInfo />
          <IGPInfo />
        </div>
        <FirebaseData />
      </div>
    </>
  );
}

export default App;
