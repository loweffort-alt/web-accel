import { DropDown } from "./dropDown";

export const DeviceInfo = ({ selectedDevice, setSelectedDevice }) => {
  function handlerDeviceSelection(device) {
    setSelectedDevice(device);
  }

  return (
    <>
      <div className="border-white border-2 rounded-xl p-3 flex flex-col gap-2">
        <h2 className="text-lg font-bold text-center">Estación sísmica</h2>
        <DropDown onSelectDevice={handlerDeviceSelection} />
        <p>
          Dispositivo:
          {selectedDevice
            ? selectedDevice.deviceManufacturer +
              " " +
              selectedDevice.deviceModel
            : "No data"}
        </p>
        <p>
          Versión de la app:
          {selectedDevice ? selectedDevice.appVersion : "No data"}
        </p>
        <p>
          Versión del SDK:
          {selectedDevice ? selectedDevice.deviceSDKVersion : "No data"}
        </p>
        <p>Canales: X Y Z</p>
        <p>Frecuencia de muestreo(Hz): 100.0</p>
        <p>
          Coordenadas:
          <br />
          Latitud:{" "}
          {selectedDevice
            ? selectedDevice.currentLocation?.latitude
            : "No data"}
          <br />
          Longitud:{" "}
          {selectedDevice
            ? selectedDevice.currentLocation?.longitude
            : "No data"}
          <br />
          Altitud:{" "}
          {selectedDevice
            ? selectedDevice.currentLocation?.altitude
            : "No data"}
          <br />
        </p>
      </div>
    </>
  );
};
