// src/index.ts
import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import entriesRoutes from './routes/entries';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
app.use('/api/entries', entriesRoutes);

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});