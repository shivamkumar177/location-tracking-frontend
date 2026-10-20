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

- [ ] **8. Optional extra (pick one)**
  - Compare travel modes with the OneMap Routing API (drive/walk/cycle/public transport). Keep the token on a small backend proxy you write yourself
  - Regional distribution: planning-area boundaries from data.gov.sg ("Master Plan 2019 Planning Area Boundary") in a `GeoJSON` layer, each area coloured by number of stops
  - Filter by category with checkboxes; list and markers update together

**Next:** MapLibre (WebGL vector maps, named in the job post). The concepts carry over from Leaflet.
