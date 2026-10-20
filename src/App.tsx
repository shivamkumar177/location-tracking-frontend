import { useEffect, useState } from 'react'
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
import './App.css'
import { StopList, type Stop } from './stops';
import StopListComponent from './StopList.tsx'
import MapContainerComponent from './MapContainer.tsx';
import { totalDistance } from './stops.ts';
import { fetchRoute, type Route } from './route.ts';

function App() {
  // const [count, setCount] = useState(0)
  const [selectedStop, setSelectedStop] = useState<Stop['id'] | null>(null);
  const distance: number = totalDistance(StopList);

  const [route, setRoute] = useState<Route | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);

  useEffect(()=>{
    fetchRoute(StopList).then(setRoute).catch((error) => {
      console.error('Error fetching route:', error);
      setRouteError(error.message);
    });
  }, []);

  return (
    <div className="app">
      <div className="sidebar">
      <div className="card">
        {!route && !routeError && <p>Loading route...</p>}
        {routeError && <p className="error">Error fetching route: {routeError}</p>}
        {route && (
          <>
            <h2>Straight Total Distance</h2>
            <p>{(route.distanceMeters/1000).toFixed(1)} km</p>
            <h2>Total Distance Road</h2>
            <p>{(distance/1000).toFixed(1)} km</p>
            <h2>Estimated Duration</h2>
            <p>{Math.round(route.durationSeconds/60)} minutes</p>
          </>
        )}
      </div>
      <div className="card">
        <h2>Stops</h2>
        <StopListComponent stopList={StopList} selectedStop={selectedStop} setSelectedStop={setSelectedStop} />
      </div>
      </div>
      <div className="content">
        
          <h2>Welcome to the Stops App</h2>
          <MapContainerComponent stopList={StopList} selectedStop={selectedStop} setSelectedStop={setSelectedStop} route={route} />
        
      </div>
    </div>
  )
}

export default App
