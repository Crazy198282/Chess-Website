export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserRating {
  id: number;
  user_id: number;
  rating: number;
  rd: number;
  volatility: number;
  last_rating_calculation: Date;
  games_played: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface Game {
  id: number;
  white_player_id: number;
  black_player_id: number | null;
  is_bot_game: boolean;
  status: 'pending' | 'active' | 'completed' | 'abandoned';
  result: string | null;
  pgn: string | null;
  moves: any[];
  time_control: string;
  created_at: Date;
  started_at: Date | null;
  ended_at: Date | null;
}

export interface JWTPayload {
  user_id: number;
  username: string;
  iat: number;
  exp: number;
}
