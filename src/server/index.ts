import express, { Express } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';
import cors from 'cors';
import { initializeDatabase } from './database/db';
import authRoutes from './routes/auth';
import gameRoutes from './routes/game';
import matchmakingRoutes from './routes/matchmaking';
import userRoutes from './routes/user';
import { setupSocketHandlers } from './websocket/handlers';

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

initializeDatabase().catch((err) => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});

app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/matchmaking', matchmakingRoutes);
app.use('/api/user', userRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

setupSocketHandlers(io);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🎮 WebSocket ready for connections`);
});

export { app, io };
