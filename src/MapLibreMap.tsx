import {Map, Source, Layer, type MapRef} from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import {setWorkerUrl} from 'maplibre-gl';
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import type { Route } from './route';
import type { Stop } from './stops';
import type { FeatureCollection, Point, Feature, LineString } from 'geojson';
import {useEffect, useRef} from 'react';

setWorkerUrl(workerUrl);



function MapLibreMap({ stopList, selectedStop, setSelectedStop, route }: { stopList: Stop[]; selectedStop: Stop['id'] | null; setSelectedStop: (id: Stop['id']) => void; route: Route | null }) {
    const geoJsonCoords : Feature<Point>[] = stopList.map((stop) => {
        return {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [stop.long, stop.lat]
            },
            "properties": {
                "id": stop.id,
                "name": stop.name,
                "category": stop.category
            }
        }
    })
    const geoJson: FeatureCollection<Point> = {
        type: "FeatureCollection",
        features: geoJsonCoords
    }

    const straightLine: Feature<LineString> = {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: stopList.map((stop) => [stop.long, stop.lat])
        },
        properties: {}
    }

    const roadLine: Feature<LineString> | null = route ? {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: route.points.map((point) => [point[1], point[0]])
        },
        properties: {}
    } : null;
    const mapRef = useRef<MapRef | null>(null);
    useEffect(() => {
        const stop = stopList.find((s) => s.id === selectedStop);
        if (!stop || !mapRef.current) return;
        mapRef.current.flyTo({
            center: [stop.long, stop.lat],
            zoom: 15,
            speed: 1.5
        });
    }, [selectedStop, stopList]);
    return (
        <div className="map-container">
            <Map initialViewState={{
                longitude: 103.8198,
                latitude: 1.3521,
                zoom: 12
            }} style={{width: '100%', height: '100%'}} 
            ref={mapRef}
            mapStyle="https://tiles.openfreemap.org/styles/liberty"
            interactiveLayerIds={['stops']}
            onClick={(event) => {
                const id = event.features?.[0]?.properties?.id;
                if (id) {
                    setSelectedStop(id);
                }
            }}>
               <Source id="stops" type="geojson" data={geoJson}>
                <Layer
                    id="stops"
                    type="circle"
                    paint={{
                    'circle-radius': ['case', ['==', ['get', 'id'], selectedStop ?? ''], 14, 8],
                    'circle-color': ['match', ['get', 'category'],
                        'landmark', 'red',
                        'park', 'green',
                        'neighbourhood', 'orange',
                        'shopping', 'blue',
                        'gray'],
                    'circle-stroke-width': 2,
                    'circle-stroke-color': 'white',
                    }}
                />
                </Source>
                <Source id="straightLine" type="geojson" data={straightLine}>
                    <Layer
                        id="straight-line"
                        type="line"
                        beforeId="stops"
                        paint={{
                            'line-color': 'gray',
                            'line-width': 3,
                            'line-dasharray': [2, 2],
                        }}
                    />
                </Source>
                {roadLine && (
                    <Source id="roadLine" type="geojson" data={roadLine}>
                        <Layer
                            id="road-line"
                            type="line"
                            beforeId="stops"
                            paint={{
                                'line-color': 'blue',
                                'line-width': 5,
                            }}
                        />
                    </Source>
                )}
            </Map>
        </div>
    )
}

export default MapLibreMap;