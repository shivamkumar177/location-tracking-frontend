import { useState } from 'react'
// import heroImg from './assets/hero.png'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
import './App.css'
import { StopList, type Stop } from './stops';
import StopListComponent from './StopList.tsx'
import MapContainerComponent from './MapContainer.tsx';
import { totalDistance } from './MapContainer.tsx';

function App() {
  // const [count, setCount] = useState(0)
  const [selectedStop, setSelectedStop] = useState<Stop['id'] | null>(null);
  const distance: number = totalDistance(StopList);
  return (
    <div className="app">
      <div className="sidebar">
      <div className="card">
        <h2>Total Distance</h2>
        <p>{(distance/1000).toFixed(1)} km</p>
      </div>
      <div className="card">
        <h2>Stops</h2>
        <StopListComponent stopList={StopList} selectedStop={selectedStop} setSelectedStop={setSelectedStop} />
      </div>
      </div>
      <div className="content">
        
          <h2>Welcome to the Stops App</h2>
          <MapContainerComponent stopList={StopList} selectedStop={selectedStop} setSelectedStop={setSelectedStop} />
        
      </div>
    </div>
  )
}

export default App
