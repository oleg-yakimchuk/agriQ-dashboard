const express = require('express');
const cors = require('cors');
const database = require('./data.json'); // Import our mock database

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'agriQ server is running' });
});

// The main data endpoint
app.get('/api/piles', (req, res) => {
    // In a real app, this would be a query to PostgreSQL or TimescaleDB
    // For now, we return the JSON file
    res.json(database.piles);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});