export function fetchDataFromExternalAPI(setDataIGP) {
  fetch("https://server-acce.onrender.com/proxy")
    .then((res) => res.json())
    .then((data) => setDataIGP(data[0]))
    .catch((error) =>
      console.error("Error fetching data from external API:", error),
    );
}
