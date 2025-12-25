import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Component to fit bounds when fire data is loaded
function FitBounds({ bounds }) {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds);
    }
  }, [bounds, map]);

  return null;
}

function FireMap({ userLocation }) {
  const [fireData, setFireData] = useState(null);
  const [bounds, setBounds] = useState(null);
  const defaultCenter = [37.8, -96]; // Center on US

  useEffect(() => {
    // Load fire GeoJSON data
    fetch('/fires.geojson')
      .then(res => res.json())
      .then(geojson => {
        setFireData(geojson);

        // Calculate bounds from GeoJSON features
        if (geojson.features && geojson.features.length > 0) {
          const coords = geojson.features.map(f => [
            f.geometry.coordinates[1],
            f.geometry.coordinates[0]
          ]);
          setBounds(coords);
        }
      })
      .catch(err => console.error('Error loading fire data:', err));
  }, []);

  return (
    <div id="map-container">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        style={{ height: '400px', width: '100%', borderRadius: '10px', border: '2px solid #ccc' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Render fire markers */}
        {fireData?.features?.map((feature, index) => {
          const [lon, lat] = feature.geometry.coordinates;
          const conf = feature.properties.confidence || 'N/A';
          const date = feature.properties.acq_date || 'unknown date';

          return (
            <CircleMarker
              key={index}
              center={[lat, lon]}
              radius={4}
              pathOptions={{
                fillColor: 'red',
                color: 'darkred',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
              }}
            >
              <Popup>
                🔥 Fire detected<br />
                <b>Date:</b> {date}<br />
                <b>Confidence:</b> {conf}
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Render user location marker */}
        {userLocation && (
          <CircleMarker
            center={[userLocation.lat, userLocation.lon]}
            radius={6}
            pathOptions={{
              fillColor: 'blue',
              color: 'navy',
              weight: 2,
              opacity: 1,
              fillOpacity: 0.7
            }}
          >
            <Popup>📍 You are here</Popup>
          </CircleMarker>
        )}

        {/* Fit bounds to show all fires */}
        {bounds && <FitBounds bounds={bounds} />}
      </MapContainer>
    </div>
  );
}

export default FireMap;
