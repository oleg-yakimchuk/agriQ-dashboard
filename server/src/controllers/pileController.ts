import { Request, Response } from 'express';
import { PileService } from '../services/pileService';

const pileService = new PileService();

export const getAllPiles = async (req: Request, res: Response): Promise<void> => {
    try {
        const piles = await pileService.getAllPiles();
        res.status(200).json(piles);
    } catch (error) {
        console.error('Controller Error - getAllPiles:', error);
        res.status(500).json({ message: 'Internal Server Error retrieving piles' });
    }
};

export const getPileById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = req.params.id as string;
        const pile = await pileService.getPileById(id);

        if (!pile) {
            res.status(404).json({ message: `Pile with ID ${id} not found` });
            return;
        }

        res.status(200).json(pile);
    } catch (error) {
        console.error(`Controller Error - getPileById (${req.params.id}):`, error);
        res.status(500).json({ message: 'Internal Server Error retrieving pile' });
    }
};