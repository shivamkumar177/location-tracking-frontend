import {type LatLngTuple} from 'leaflet'
import {type Stop} from './stops'

export type Route = {
    points: LatLngTuple[];
    distanceMeters: number;
    durationSeconds: number;
}

export async function fetchRoute(stops: Stop[]): Promise<Route> {
    const coords = stops.map((stop) => `${stop.long},${stop.lat}`).join(';');
    // Implementation for fetching route would go here
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch route: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error(`No route found: ${data.message || 'Unknown error'}`);
    }
    const route = data.routes[0];
    const points: LatLngTuple[] = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]] as LatLngTuple);
    return {
        points: points,
        distanceMeters: route.distance,
        durationSeconds: route.duration
    };
}