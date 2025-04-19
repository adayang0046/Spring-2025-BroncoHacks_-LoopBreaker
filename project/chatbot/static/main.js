async function askWilliams(message = null) {
  const input = document.getElementById("userInput");
  const questionDisplay = document.getElementById("questionDisplay");
  const responseBox = document.getElementById("response");

  // If no message is passed in, use the current input value
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

// When the page loads
window.onload = () => {
  // Attach click handler to the button
  document.getElementById("askBtn").addEventListener("click", () => askWilliams());

  // Trigger intro message
  askWilliams("");
};



