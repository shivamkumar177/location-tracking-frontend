# Delivery Route Viewer: Learning Plan

One page: a sidebar listing ~5 Singapore delivery stops, and a map with those stops, the route between them (polyline), and the road distance and travel time.

## Backend → React cheat sheet

| React | Backend analogy |
|---|---|
| Component | A function that returns UI instead of a response |
| Props | That function's arguments |
| State (`useState`) | A variable; changing it re-runs the function and redraws the screen |
| `useEffect` | Code that runs after drawing (e.g. fetching data) |
| JSX | HTML-like syntax inside TypeScript |

CSS you need: box model (margin / border / padding), flexbox, units (`px`, `%`, `vh`).

DevTools (Cmd+Opt+I): **Console** for errors, **Elements** for CSS/box model, **Network** for API calls.

---

## Chunks

- [x] **0. Clean the starter**
  - Learn: `index.html` → `main.tsx` → `App.tsx`; what `npm run dev` does
  - Done when: blank page with your own heading

- [x] **1. Render a list from data**
  - Learn: JSX, components, `array.map()` + `key`, TypeScript `type`
  - Build: `stops.ts` (`Stop` type + 5 stops), `StopList` component that takes stops as props
  - Done when: stop names appear on the page

- [x] **2. State and clicks**
  - Learn: `useState`, `onClick`, conditional `className`
  - Done when: the clicked stop is highlighted

- [x] **3. Layout with CSS**
  - Learn: box model, flexbox (`display: flex`, `flex: 1`), `height: 100vh`, default `body` margin
  - Build: fixed-width sidebar on the left, a box filling the rest on the right
  - Done when: two coloured boxes side by side fill the screen

- [x] **4. First map**
  - Install: `npm install leaflet react-leaflet` and `npm install -D @types/leaflet`
  - Learn: map tiles (256px images by zoom/x/y), lat/lng, zoom levels
  - Build: `MapContainer` + `TileLayer` (OpenStreetMap), centred on Singapore, zoom ~12
  - Watch out:
    - Without `import 'leaflet/dist/leaflet.css'` the tiles show up scattered
    - A map container with no height is invisible
    - `MapContainer` reads props like `center` only once
  - Bonus: OneMap Singapore tiles (tile URL in OneMap's docs)

- [x] **5. Stops on the map**
  - Learn: lifting state up (selected stop lives in `App`), the `useMap()` hook
  - Build: a `CircleMarker` per stop coloured by category, with a `Popup`; clicking a stop in the sidebar makes the map `flyTo` it
  - Watch out:
    - `useMap()` only works inside `MapContainer`
    - The default pin `Marker` loses its icon images under Vite; `CircleMarker` avoids this

- [x] **6. Polyline and distance**
  - Learn: a polyline is an array of `[lat, lng]`; calculate derived values instead of storing them in state
  - Build: dashed `Polyline` through the stops; total straight-line km using `latLng.distanceTo()`
  - Done when: dashed line + "Total: X km"

- [ ] **7. Real road route from an API**
  - Learn: `fetch` inside `useEffect`, dependency array, loading/error states
  - Build: OSRM demo `router.project-osrm.org/route/v1/driving/{lng,lat;lng,lat;...}?overview=full&geometries=geojson`; solid road line vs dashed straight line; "Straight 8 km vs Road 11 km, 18 min"
  - Watch out:
    - GeoJSON/OSRM give `[lng, lat]`; Leaflet wants `[lat, lng]`. Swap them
    - The demo server is for light testing only

- [ ] **8. Optional extra (pick one)**, skipped for now
  - Compare travel modes with the OneMap Routing API (drive/walk/cycle/public transport). Keep the token on a small backend proxy you write yourself
  - Regional distribution: planning-area boundaries from data.gov.sg ("Master Plan 2019 Planning Area Boundary") in a `GeoJSON` layer, each area coloured by number of stops
  - Filter by category with checkboxes; list and markers update together

---

## Part 2: MapLibre

Same app, same props, new map component (`MapLibreMap.tsx`). `App` only changes which map it renders.

| | Leaflet | MapLibre |
|---|---|---|
| Tiles | Pictures (raster) | Data (vector), drawn and styled in your browser |
| Drawing | SVG/HTML | WebGL (GPU): smooth zoom, rotate, tilt, 3D |
| Stops | One React component per marker | One data source + one style layer draws them all |
| Coordinates | `[lat, lng]` | `[lng, lat]` (GeoJSON order) |
| Start position | `center` + `zoom` | `initialViewState` |
| Move the map | `useMap()` in a child component | `useRef` + `mapRef.current.flyTo(...)` |

- [ ] **M1. First map**
  - Install: `npm install maplibre-gl @vis.gl/react-maplibre`
  - Build: `<Map>` with `initialViewState`, `mapStyle="https://tiles.openfreemap.org/styles/liberty"` (free, no key), full width/height, plus `import 'maplibre-gl/dist/maplibre-gl.css'`
  - Watch out: with Vite, MapLibre can't find its worker file. The map shows a blank cream background, and the Console says "Worker failed to load". Fix at the top of the file: `import { setWorkerUrl } from 'maplibre-gl'`, `import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url'`, then `setWorkerUrl(workerUrl)`
  - Done when: map of Singapore shows; right-click + drag rotates and tilts; `pitch: 60` at zoom 16 shows 3D buildings

- [ ] **M2. Stops as data + a circle layer**
  - Learn: GeoJSON `FeatureCollection`; `<Source>` (the data) vs `<Layer>` (how to draw it); expressions `['get', ...]`, `['match', ...]`, `['case', ...]`
  - Build: stops → GeoJSON points (`[lng, lat]`!); one `circle` layer coloured by category; selected stop bigger
  - Done when: 5 coloured dots, selected one bigger

- [ ] **M3. Route lines**
  - Build: road route as a `line` layer; straight line dashed with `line-dasharray`
  - Watch out: `route.points` were swapped to `[lat, lng]` for Leaflet, so swap them back for MapLibre. Layers listed first are drawn underneath

- [ ] **M4. Click + fly to**
  - Learn: `useRef`; `interactiveLayerIds` + `onClick` → `e.features[0].properties.id`
  - Build: click a dot to select it; selection change → `mapRef.current?.flyTo({ center: [lng, lat], zoom: 15 })`

- [ ] **M5. Popup (optional)**
  - Build: `<Popup>` at the selected stop

**Later:** regional distribution, i.e. planning-area polygons as a `fill` layer coloured by data (a choropleth). This is where MapLibre is strongest.
