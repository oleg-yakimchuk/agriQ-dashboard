
import fs from 'fs/promises';
import path from 'path';
import { IPileService, Pile } from './IPileService';

export class PileService implements IPileService {
    private readonly dataPath = path.join(__dirname, '../data/data.json');

    public async getAllPiles(): Promise<Pile[]> {
        try {
            const rawData = await fs.readFile(this.dataPath, 'utf-8');
            const parsedData = JSON.parse(rawData);
            return Array.isArray(parsedData) ? parsedData : parsedData.piles || [];

        } catch (error) {
            console.error('Error reading database:', error);
            throw new Error('Failed to retrieve pile data');
        }
    }

    public async getPileById(id: string): Promise<Pile | null> {
        const piles = await this.getAllPiles();
        const pile = piles.find(p => p.id === id);
        return pile || null;
    }
}