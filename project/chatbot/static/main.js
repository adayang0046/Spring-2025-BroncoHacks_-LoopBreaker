// 💬 Chatbot logic
async function askWilliams(message = null) {
  const input = document.getElementById("userInput");
  const questionDisplay = document.getElementById("questionDisplay");
  const responseBox = document.getElementById("response");

  if (message === null) {
    message = input.value;
  }

  questionDisplay.innerText = "You asked: " + message;
  responseBox.innerText = "Williams is thinking...";

  // Try to get user's location
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      async function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log("📍 User location:", latitude, longitude);

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
        console.error("❌ Error getting location:", error.message);
        responseBox.innerText = "Could not get your location.";
      }
    );
  } else {
    console.warn("Geolocation not supported.");
    responseBox.innerText = "Geolocation not supported by this browser.";
  }
}

// 🗺️ Fire Map logic
function initFireMap() {
  const defaultCenter = [37.8, -96]; // Center on US
  const map = L.map('map').setView(defaultCenter, 5);

  // Load base layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Load and plot GeoJSON fire data
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

      map.fitBounds(fireLayer.getBounds());
    });

  // Zoom to user location and mark it
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        map.setView([lat, lon], 10);

        L.circleMarker([lat, lon], {
          radius: 6,
          fillColor: "blue",
          color: "navy",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.7
        }).addTo(map).bindPopup("📍 You are here").openPopup();
      },
      (error) => {
        console.error("❌ Error getting user location for map:", error.message);
      }
    );
  }
}

// 🚀 Initialize everything on page load
window.onload = () => {
  document.getElementById("askBtn").addEventListener("click", () => askWilliams());
  askWilliams("");  // Auto-trigger intro
  initFireMap();    // Load and display map
};
