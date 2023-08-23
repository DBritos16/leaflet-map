import { FeatureGroup, MapContainer, Marker, Polygon, Popup, TileLayer } from 'react-leaflet'
import './App.css'
import { polygon, area, booleanPointInPolygon, point } from '@turf/turf';
import { EditControl } from 'react-leaflet-draw';
import { useEffect, useState } from 'react';

function App() {

  const [polygons, setPolygons] = useState([]);

  const area = 
    [
      [51.52295012515947,-0.11363983154296875],
      [51.508421934016845,-0.11947631835937501],
      [51.498270816123465,-0.10042190551757812],
      [51.49955318737237,-0.07656097412109376],
      [51.51696848999419,-0.06900787353515626],
      [ 51.526795047194035, -0.07553100585937501],
      [51.53096001302977, -0.09973526000976564]
    ]



  const polygonCoordinates = [[51.505, -0.09],
  [51.51, -0.09],
  [51.51, -0.12],
  [51.505, -0.12],
  [51.505, -0.09],];

  const turfPolygon = polygon([area]);

  const calculateArea = () => {
    const options = { units: 'square-meters' };
    const polygonArea = area(turfPolygon, options);
    console.log('Área en metros cuadrados:', polygonArea);


  };


  const handleDrawCreated = (e) => {
    const { layer } = e;
    const newPolygon = layer.getLatLngs()[0].map((latLng) => [latLng.lat, latLng.lng]);
    const points = point(newPolygon[0]);
     // Puede usar cualquier punto del polígono
     if (booleanPointInPolygon(points, turfPolygon)) {
      setPolygons([...polygons, newPolygon]);
    } else {
      alert('El nuevo polígono debe estar dentro del área definida.');
    }
  };

  useEffect(() => {
    console.log(polygons);
  }, [polygons])


  return (
    <>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <MapContainer center={[51.505, -0.09]} zoom={13}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={handleDrawCreated}
              draw={{
                marker: false,
                circle: false,
                circlemarker: false,
                polyline: false,
                rectangle: false,
                polygon: true,
              }}
            />
          </FeatureGroup>
          <Polygon positions={area} color='red' />

        </MapContainer>
      </div>
    </>
  )
}

export default App
