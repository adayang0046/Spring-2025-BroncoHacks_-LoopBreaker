async function askWilliams(message = null) {
  const input = document.getElementById("userInput");
  const questionDisplay = document.getElementById("questionDisplay");
  const responseBox = document.getElementById("response");

  if (message === null) {
    message = input.value;
  }

  questionDisplay.innerText = "You asked: " + message;
  responseBox.innerText = "Williams is thinking...";

  // Get Location Data
  let latitude, longitude;
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
  
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        try {
          const res = await fetch("/ask/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
              question: message,
              latitude: latitude,
              longitude: longitude,
            }),
          });
      
          const data = await res.json();
          responseBox.innerText = data.reply || data.response || data.error || "⚠️ Unexpected response.";
        } catch (err) {
          responseBox.innerText = "❌ Error talking to Williams.";
          console.error("Fetch error:", err);
        }
      },
      function (error) {
        console.error("Error getting location:", error.message);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

function initFireMap() {
  const map = L.map('map').setView([37.8, -96], 5); // Default center (USA)

  // Load base map
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Load GeoJSON and plot all fires
  fetch("/static/fires.geojson")
    .then(res => res.json())
    .then(geojson => {
      const fireLayer = L.geoJSON(geojson, {
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, {
            radius: 4,
            fillColor: "red",
            color: "darkred",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
          });
        },
        onEachFeature: function (feature, layer) {
          const conf = feature.properties.confidence || "N/A";
          const date = feature.properties.acq_date || "unknown date";
          layer.bindPopup(`🔥 Fire detected<br><b>Date:</b> ${date}<br><b>Confidence:</b> ${conf}`);
        }
      }).addTo(map);

      // Fit map to show all fire points
      map.fitBounds(fireLayer.getBounds());
    });
}


window.onload = () => {
  document.getElementById("askBtn").addEventListener("click", () => askWilliams());
  askWilliams(""); // intro
  initFireMap();   // fire map
};
