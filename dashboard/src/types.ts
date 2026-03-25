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