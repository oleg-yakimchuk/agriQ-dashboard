
import { Router } from 'express';
import { getAllPiles, getPileById } from '../controllers/pileController';

const router = Router();

router.get('/', getAllPiles);
router.get('/:id', getPileById);

export default router;