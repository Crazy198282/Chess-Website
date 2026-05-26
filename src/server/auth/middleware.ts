import { Request, Response, NextFunction } from 'express';
import { extractToken, verifyToken } from './jwt';

declare global {
  namespace Express {
    interface Request {
      user_id?: number;
      username?: string;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    return res.status(401).json({ error: 'Missing authentication token' });
  }

  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user_id = payload.user_id;
  req.username = payload.username;

  next();
}
