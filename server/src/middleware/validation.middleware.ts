import { Request, Response, NextFunction } from 'express';

export const validatePileId = (req: Request, res: Response, next: NextFunction): void => {
    const { id } = req.params;

    if (id && id.length > 50) {
        res.status(400).json({ message: 'Bad Request: Pile ID format is invalid' });
        return;
    }

    next();
};