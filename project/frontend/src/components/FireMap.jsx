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

// Component to fix map size issues
function MapResizer() {
  const map = useMap();

  useEffect(() => {
    // AGGRESSIVE fix - call invalidateSize() many times at different intervals
    const timer1 = setTimeout(() => map.invalidateSize(), 0);
    const timer2 = setTimeout(() => map.invalidateSize(), 50);
    const timer3 = setTimeout(() => map.invalidateSize(), 100);
    const timer4 = setTimeout(() => map.invalidateSize(), 200);
    const timer5 = setTimeout(() => map.invalidateSize(), 500);
    const timer6 = setTimeout(() => map.invalidateSize(), 1000);

    // Fix on window resize
    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    // Also force immediate resize
    requestAnimationFrame(() => {
      map.invalidateSize();
    });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  return null;
}

function FireMap({ userLocation }) {
  const [fireData, setFireData] = useState(null);
  const [bounds, setBounds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const defaultCenter = [37.8, -96]; // Center on US

  useEffect(() => {
    // Wait for container to have dimensions before rendering map
    const checkContainer = setInterval(() => {
      const container = document.getElementById('map-container');
      if (container && container.offsetWidth > 0) {
        setMapReady(true);
        clearInterval(checkContainer);
      }
    }, 50);

    return () => clearInterval(checkContainer);
  }, []);

  useEffect(() => {
    // Load LIVE fire data from NASA FIRMS API via Django backend
    setLoading(true);
    fetch('/api/fires/')
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
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading fire data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div id="map-container">
        <div style={{ padding: '20px', textAlign: 'center', background: '#f4f4f4', borderRadius: '10px' }}>
          Loading live fire data from NASA FIRMS...
        </div>
      </div>
    );
  }

  if (!mapReady) {
    return (
      <div id="map-container">
        <div style={{ padding: '20px', textAlign: 'center', background: '#f4f4f4', borderRadius: '10px' }}>
          Initializing map...
        </div>
      </div>
    );
  }

  const fireCount = fireData?.features?.length || 0;

  return (
    <div id="map-container">
      {fireCount === 0 && (
        <div style={{ padding: '10px', background: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '10px', textAlign: 'center' }}>
          ✅ No active wildfires detected in the USA (last {fireData?.metadata?.days || 10} days) - Stay safe!
        </div>
      )}
      {fireCount > 0 && (
        <div style={{ padding: '10px', background: '#fff3cd', color: '#856404', borderRadius: '8px', marginBottom: '10px', textAlign: 'center' }}>
          🔥 {fireCount} active fire{fireCount > 1 ? 's' : ''} detected (last {fireData?.metadata?.days || 10} days) - Source: {fireData?.metadata?.source}
        </div>
      )}
      <MapContainer
        center={defaultCenter}
        zoom={5}
        style={{ height: '400px', width: '100%', borderRadius: '10px', border: '2px solid #ccc' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapResizer />

        {/* Render fire markers */}
        {fireData?.features?.map((feature, index) => {
          const [lon, lat] = feature.geometry.coordinates;
          const conf = feature.properties.confidence || 'N/A';
          const date = feature.properties.acq_date || 'unknown';
          const time = feature.properties.acq_time || 'unknown';
          const satellite = feature.properties.satellite || 'VIIRS';
          const frp = feature.properties.frp || 'N/A';

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
                🔥 <b>Active Fire Detected</b><br />
                <b>Date:</b> {date}<br />
                <b>Time:</b> {time} UTC<br />
                <b>Confidence:</b> {conf}<br />
                <b>Satellite:</b> {satellite}<br />
                <b>Fire Power:</b> {frp} MW
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
