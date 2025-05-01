// Centering map on Duluth and setting zoom level
let map = L.map("map", {
  center: [46.696671, -92.100487],
  zoom: 10
});

// Adding OpenStreetMap basemap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap"
}).addTo(map);

// Load and add attractions to map
addAttractionsToMap();

async function addAttractionsToMap() {
  const response = await fetch("DuluthPointsOfInterestLatLong.csv");
  const csvText = await response.text();

  //reading csv
  const csvData = Papa.parse(csvText, {
    header: true,
    dynamicTyping: true
  });

  const table = csvData.data;

  // Defining custom icons
  const icons = {
    Park: L.icon({
      iconUrl: 'images/GreenCircle.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    }),
    Spectacle: L.icon({
      iconUrl: 'images/BlueCircle.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    }),
    Drinks: L.icon({
      iconUrl: 'images/RedCircle.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  };

  // adding markers and popups to map
  table.forEach(row => {
    const icon = icons[row.Class];

    const popUpContent = `
      <p><img src="${row['Photo URL']}" style="max-width: 100%; height: auto;" /></p>
      <p><b>${row.Attraction}</b></p>
      <p>${row.Address}</p>
      <a href="${row.Website}">${row.Website}</a>
    `;

    L.marker([row.Latitude, row.Longitude], { icon })
      .bindPopup(popUpContent)
      .addTo(map);
  });
}

// Add legend to the map
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += '<h4>Points of Interest</h4>';
  div.innerHTML += '<img src="images/GreenCircle.png" style="width: 16px;"> Park<br>';
  div.innerHTML += '<img src="images/BlueCircle.png" style="width: 16px;"> Spectacle<br>';
  div.innerHTML += '<img src="images/RedCircle.png" style="width: 16px;"> Drinks<br>';
  return div;
};

legend.addTo(map);
