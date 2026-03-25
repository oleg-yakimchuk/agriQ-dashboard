import { Router } from 'express';
import { getAllPiles, getPileById } from '../controllers/pileController';
import { validatePileId } from '../middleware/validation.middleware';

const router = Router();


router.get('/', getAllPiles);

router.get('/:id', validatePileId, getPileById);

export default router;