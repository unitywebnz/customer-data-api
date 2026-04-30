import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { database } from './models/database';
import customerRoutes from './routes/customerRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/customers', customerRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function startServer(): Promise<void> {
  try {
    await database.connect();
    await database.initialiseSchema();
    console.log('Database connected and schema initialised');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
