# ♞ ChessX - Advanced Chess Platform

A modern chess platform featuring Glicko-2 rating system, Stockfish integration, multiplayer matchmaking, and real-time gameplay.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Configure environment
cp .env.example .env

# Start development servers
npm run dev
```

Backend: http://localhost:5000  
Frontend: http://localhost:5173

### Docker Deployment

```bash
# Build and run with docker-compose
docker-compose up -d
```

## 🎯 Features

- **Authentication**: Secure user registration and login with JWT
- **Glicko-2 Rating System**: Advanced Elo-based rating with RD and volatility
- **Stockfish Integration**: Engine-powered game analysis and AI opponent
- **Real-time Multiplayer**: WebSocket-based live gameplay
- **Matchmaking**: Automatic opponent matching with rating-based pairing
- **Game Rooms**: Create and join custom game rooms
- **Leaderboard**: Global rankings with detailed statistics

## 🛠 Tech Stack

**Backend**: Express.js, PostgreSQL, Socket.io, Stockfish, Glicko-2  
**Frontend**: React 18, TypeScript, Tailwind CSS, Zustand

## 📁 Project Structure

```
├── src/server/          # Backend code
├── client/              # React frontend
├── docker-compose.yml   # Docker setup
└── Dockerfile          # Production image
```

## 🚀 Deployment

### Docker
```bash
docker-compose up -d
```

### Environment Variables
```env
PORT=5000
DATABASE_URL=postgresql://user:pass@localhost:5432/chess_db
JWT_SECRET=your_secret_key
STOCKFISH_PATH=/usr/bin/stockfish
FRONTEND_URL=http://localhost:5173
```

## 📖 API Docs

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Games
- `POST /api/game/create` - Create game
- `GET /api/game/:gameId` - Get game
- `POST /api/game/:gameId/move` - Make move

### User
- `GET /api/user/me` - Get profile
- `GET /api/user/leaderboard/top` - Leaderboard

## 🤝 Contributing

Fork → Create Feature Branch → Commit → Push → Open PR
