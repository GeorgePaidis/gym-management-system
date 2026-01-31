import express from "express";
import morgan from "morgan";
import cors from 'cors';
import dotenv from 'dotenv';
import { setupSwagger } from './swagger';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import scheduleRoutes from './routes/schedule.routes';

dotenv.config();

const app = express();

setupSwagger(app);

app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/schedule', scheduleRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: process.env.APP_NAME || 'Gym App',
    timestamp: new Date().toISOString()
  });
});

export default app;