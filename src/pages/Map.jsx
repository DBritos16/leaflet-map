import React, { useRef } from 'react'
import { FeatureGroup, MapContainer, Marker, Polygon, Popup, TileLayer } from 'react-leaflet'
import { polygon, booleanPointInPolygon, booleanWithin, intersect } from '@turf/turf';
import { EditControl } from 'react-leaflet-draw';
import { useEffect, useState } from 'react';


const Map = () => {

    const mapRef = useRef(null);

    const area = [
        [-26.080442640853118, -58.27608436346055],
        [-26.081136459684316, -58.27472180128098],
        [-26.083116711645, -58.27602535486222],
        [-26.082408450193658, -58.277398645877845],
        [-26.080442640853118, -58.27608436346055]
    ]
  
      const [polygons, setPolygons] = useState([
        [
            [
                -26.080490822849274,
                -58.27607899904252
            ],
            [
                -26.080760641661243,
                -58.27553719282151
            ],
            [
                -26.081420731489956,
                -58.27604144811631
            ],
            [
                -26.081146096028014,
                -58.276508152484894
            ],
            [
                -26.080490822849274,
                -58.27607899904252
            ]
        ],
        [
            [
                -26.08082809626704,
                -58.27551573514939
            ],
            [
                -26.08142554965021,
                -58.275907337665565
            ],
            [
                -26.082143453310778,
                -58.27551037073136
            ],
            [
                -26.081146096028014,
                -58.27482372522355
            ],
            [
                -26.08082809626704,
                -58.27551573514939
            ]
        ],
        [
            [
                -26.08145445860753,
                -58.2761111855507
            ],
            [
                -26.081574912519518,
                -58.275896608829505
            ],
            [
                -26.08210009012738,
                -58.27623456716538
            ],
            [
                -26.081970000480755,
                -58.276513516902924
            ],
            [
                -26.08145445860753,
                -58.2761111855507
            ]
        ]
    ]);

      
  
    const calculateArea = () => {
      const options = { units: 'square-meters' };
      const polygonArea = area(turfPolygon, options);
      console.log('Área en metros cuadrados:', polygonArea);
  
  
    };

    const convertToGeoJson = (coords)=> {
        return {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Polygon',
                coordinates: [coords]
            }
        }
    };

    const validateOtherPolygons = (newPolygon)=>{
        for (let i = 0; i < polygons.length; i++) {
            const intersected = intersect(convertToGeoJson(newPolygon), convertToGeoJson(polygons[i]));
            if(intersected !== null){
                return false;
            };
        } return true;
    }

    const handleEdited = (e)=>{
        const {layer} = e;

        console.log(e);
    }


    const handleDrawCreated = (e) => {
      const { layer } = e;
      const newPolygon = layer.getLatLngs()[0].map((latLng) => [latLng.lat, latLng.lng]);
   
      newPolygon.push(newPolygon[0]);
      
      if(booleanWithin(convertToGeoJson(newPolygon), convertToGeoJson(area))){

        if(validateOtherPolygons(newPolygon)){
            console.log(layer);
            return setPolygons((prevPolygons) => [...prevPolygons, newPolygon]);
        } else {
            return layer.remove()
        }
      } else {
            return layer.remove();
      } 
  
    };


  
    return (
      <>
  
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <MapContainer center={[-26.080442640853118, -58.27608436346055]} ref={mapRef} zoom={17}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  
            <FeatureGroup>
              <EditControl
                position="topright"
                onEdited={handleEdited}
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
            {polygons.map((i, k)=>(
                <Polygon key={k} color='green' positions={i}/>
                ))}
            </FeatureGroup>
                <Polygon positions={area} color='blue' />

          </MapContainer>
        </div>
      </>
    )
}

export default Map