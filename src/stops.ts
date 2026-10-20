export type Stop = {
    id: string;
    name: string;
    lat: number;
    long: number;
    category: string;
}

export const CategoryColors: Record<string, string> = {
    landmark: 'red',
    park: 'green',
    neighbourhood: 'orange',
    shopping: 'blue',
}

export const StopList: Stop[] = [
  { id: '1', name: 'Marina Bay Sands',     lat: 1.2834, long: 103.8607, category: 'landmark' },
  { id: '2', name: 'Merlion Park',         lat: 1.2868, long: 103.8545, category: 'park' },
  { id: '3', name: 'Chinatown',            lat: 1.2815, long: 103.8443, category: 'neighbourhood' },
  { id: '4', name: 'ION Orchard',          lat: 1.3040, long: 103.8318, category: 'shopping' },
  { id: '5', name: 'Singapore Botanic Gardens', lat: 1.3138, long: 103.8159, category: 'park' },
]