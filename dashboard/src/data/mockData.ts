export interface Sensor {
    id: string;
    layer: 'bottom' | 'middle' | 'top';
    temperature: number | 'erratic';
    moisture: number | 'erratic';
}

export interface Pile {
    id: string;
    name: string;
    status: 'OK' | 'Warning' | 'Critical';
    avgTemp: number;
    avgMoisture: number;
    problemSensors: Sensor[];
}

export const mockPiles: Pile[] = [
    { id: 'p1', name: 'Emek North', status: 'OK', avgTemp: 21, avgMoisture: 12.5, problemSensors: [] },
    {
        id: 'p2', name: 'Emek South', status: 'Warning', avgTemp: 28, avgMoisture: 13.2,
        problemSensors: [
            { id: 'S01', layer: 'bottom', temperature: 44, moisture: 16.1 },
            { id: 'S02', layer: 'bottom', temperature: 44, moisture: 16.1 },
            { id: 'S03', layer: 'bottom', temperature: 44, moisture: 16.1 },
            { id: 'S04', layer: 'bottom', temperature: 44, moisture: 16.1 },
        ]
    },
    {
        id: 'p3', name: 'Emek East', status: 'Critical', avgTemp: 26, avgMoisture: 13.0,
        problemSensors: [
            { id: 'S11', layer: 'middle', temperature: 51, moisture: 18.4 },
            { id: 'S28', layer: 'top', temperature: 'erratic', moisture: 'erratic' },
        ]
    },
    { id: 'p4', name: 'Emek West', status: 'Warning', avgTemp: 35, avgMoisture: 14.8, problemSensors: [] }
];