import express from 'express';
import cors from 'cors';
import pileRoutes from './routes/pileRoutes';
import { logger } from './middleware/logger.middleware';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(logger);


app.use('/api/piles', pileRoutes);


app.use((req, res) => {
    res.status(404).json({ message: 'API Route Not Found' });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api/piles`);
});