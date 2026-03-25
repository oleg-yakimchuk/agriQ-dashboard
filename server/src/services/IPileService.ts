export interface Sensor {
    id: string;
    temperature: number;
    moisture: number;
    status: 'OK' | 'WARNING' | 'CRITICAL';
    layer: 'BOTTOM' | 'MIDDLE' | 'TOP';
}

export interface Pile {
    id: string;
    name: string;
    status: 'OK' | 'WARNING' | 'CRITICAL';
    sensors: Sensor[];
}

export interface IPileService {
    getAllPiles(): Promise<Pile[]>;
    getPileById(id: string): Promise<Pile | null>;
}