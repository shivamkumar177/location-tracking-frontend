import { type Stop } from './stops';

function StopListComponent({ stopList, selectedStop, setSelectedStop }: { stopList: Stop[]; selectedStop: Stop['id'] | null; setSelectedStop: (id: Stop['id']) => void }) {
    return (
        <div>
            <h2>List of Stops</h2>
            {stopList.map((stop) => (
                <button key={stop.id} className={`stop-card ${selectedStop === stop.id ? 'selected' : ''}`} onClick={() => setSelectedStop(stop.id)}>
                    <h3>{stop.name}</h3>
                    <p>Latitude: {stop.lat}</p>
                    <p>Longitude: {stop.long}</p>
                    <p>Category: {stop.category}</p>
                </button>
            ))}
        </div>
    )
}

export default StopListComponent;