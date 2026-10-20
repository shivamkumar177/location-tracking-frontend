import { CircleMarker, MapContainer, Popup, TileLayer, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {useEffect} from 'react';
import {CategoryColors, type Stop } from './stops';
import { type LatLngTuple, latLng} from 'leaflet'

function FlyToSelectedStop({ selectedStop, stopList }: { selectedStop: Stop['id'] | null; stopList: Stop[] }) {
  const map = useMap();

  useEffect(() => {
    if (selectedStop) {
      const stop = stopList.find((s) => s.id === selectedStop);
      if (!stop) return;
      map.flyTo([stop.lat, stop.long], 15, { duration: 1.5 });
    }
  }, [selectedStop, stopList, map]);

  return null;
}

export function totalDistance(stopList: Stop[]): number {
  let distance: number = 0;
  for (let i = 1; i< stopList.length; i++) {
    const lat1 = stopList[i-1].lat;
    const lon1 = stopList[i-1].long;
    const lat2 = stopList[i].lat;
    const lon2 = stopList[i].long;
    distance += latLng(lat1, lon1).distanceTo(latLng(lat2, lon2));
  }
  return distance;
}

function MapContainerComponent({ stopList, 
  selectedStop, 
  setSelectedStop }: 
  { stopList: Stop[]; selectedStop: Stop['id'] | null; setSelectedStop: (id: Stop['id']) => void }) {
  const ployLinePos: LatLngTuple[] = stopList.map((stop) => [stop.lat, stop.long]);
  return (
    <div className="map-container">
        <MapContainer center={[1.3521, 103.8198]} zoom={12} style={{ height: '100%', width: '100%' }}>   
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Polyline positions={ployLinePos} pathOptions={{ color: 'grey', weight: 5, dashArray: '10, 10' }} />
        {stopList.map((stop: Stop)=> (
          <CircleMarker key={stop.id} center={[stop.lat, stop.long]} 
          radius={selectedStop === stop.id ? 20: 12} color={CategoryColors[stop.category]} eventHandlers={{ click: () => setSelectedStop(stop.id) }} >
          <Popup >
            <h3>{stop.name}</h3>
            <p>Latitude: {stop.lat}</p>
            <p>Longitude: {stop.long}</p>
            <p>Category: {stop.category}</p>
          </Popup>
          </CircleMarker>
        )
        )}
        <FlyToSelectedStop selectedStop={selectedStop} stopList={stopList} />
        </MapContainer>
    </div>
  );
}

export default MapContainerComponent;