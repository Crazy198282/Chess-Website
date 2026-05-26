import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/chess_db';

let db: postgres.Sql;

export async function initializeDatabase() {
  try {
    db = postgres(DATABASE_URL);
    console.log('✅ Database connected');
    await createTables();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

async function createTables() {
  try {
    await db`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await db`
      CREATE TABLE IF NOT EXISTS user_ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        rating DECIMAL(10, 2) DEFAULT 1500,
        rd DECIMAL(10, 2) DEFAULT 350,
        volatility DECIMAL(10, 8) DEFAULT 0.06,
        last_rating_calculation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        games_played INTEGER DEFAULT 0,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        draws INTEGER DEFAULT 0
      )
    `;

    await db`
      CREATE TABLE IF NOT EXISTS games (
        id SERIAL PRIMARY KEY,
        white_player_id INTEGER NOT NULL REFERENCES users(id),
        black_player_id INTEGER REFERENCES users(id),
        is_bot_game BOOLEAN DEFAULT FALSE,
        status VARCHAR(20) DEFAULT 'pending',
        result VARCHAR(20),
        pgn TEXT,
        moves JSONB DEFAULT '[]'::jsonb,
        time_control VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        started_at TIMESTAMP,
        ended_at TIMESTAMP
      )
    `;

    await db`
      CREATE TABLE IF NOT EXISTS game_analysis (
        id SERIAL PRIMARY KEY,
        game_id INTEGER NOT NULL UNIQUE REFERENCES games(id) ON DELETE CASCADE,
        analysis JSONB,
        best_moves JSONB,
        accuracy_white DECIMAL(5, 2),
        accuracy_black DECIMAL(5, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await db`
      CREATE TABLE IF NOT EXISTS matchmaking_queue (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        time_control VARCHAR(20) NOT NULL,
        rating_range_min INTEGER,
        rating_range_max INTEGER,
        queued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await db`
      CREATE TABLE IF NOT EXISTS game_rooms (
        id SERIAL PRIMARY KEY,
        room_code VARCHAR(20) UNIQUE NOT NULL,
        creator_id INTEGER NOT NULL REFERENCES users(id),
        game_id INTEGER REFERENCES games(id),
        is_private BOOLEAN DEFAULT FALSE,
        password_hash VARCHAR(255),
        max_players INTEGER DEFAULT 2,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        closed_at TIMESTAMP
      )
    `;

    console.log('✅ Tables created successfully');
  } catch (error) {
    console.error('❌ Failed to create tables:', error);
    throw error;
  }
}

export function getDb() {
  return db;
}
