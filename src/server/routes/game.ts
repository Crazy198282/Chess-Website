import express, { Router, Request, Response } from 'express';
import { authMiddleware } from '../auth/middleware';
import { getDb } from '../database/db';

const router = Router();

router.post('/create', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { opponent_id, time_control, is_bot_game } = req.body;
    const user_id = req.user_id!;
    const db = getDb();

    const result = await db`
      INSERT INTO games (
        white_player_id,
        black_player_id,
        is_bot_game,
        time_control,
        status
      ) VALUES (
        ${user_id},
        ${opponent_id || null},
        ${is_bot_game || false},
        ${time_control},
        'pending'
      )
      RETURNING *
    `;

    const game = result[0];
    res.status(201).json(game);
  } catch (error) {
    console.error('Game creation error:', error);
    res.status(500).json({ error: 'Failed to create game' });
  }
});

router.get('/:gameId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const db = getDb();

    const games = await db`
      SELECT * FROM games WHERE id = ${gameId}
    `;

    if (games.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json(games[0]);
  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({ error: 'Failed to get game' });
  }
});

router.post('/:gameId/move', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const { move } = req.body;
    const db = getDb();

    const games = await db`
      SELECT * FROM games WHERE id = ${gameId}
    `;

    if (games.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }

    const game = games[0];
    const moves = game.moves || [];
    moves.push({
      san: move,
      timestamp: Date.now(),
    });

    await db`
      UPDATE games
      SET moves = ${JSON.stringify(moves)}, status = 'active'
      WHERE id = ${gameId}
    `;

    res.json({ success: true, move });
  } catch (error) {
    console.error('Move error:', error);
    res.status(500).json({ error: 'Failed to make move' });
  }
});

router.post('/:gameId/end', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const { result } = req.body;
    const db = getDb();

    await db`
      UPDATE games
      SET status = 'completed', result = ${result}, ended_at = CURRENT_TIMESTAMP
      WHERE id = ${gameId}
    `;

    res.json({ success: true });
  } catch (error) {
    console.error('End game error:', error);
    res.status(500).json({ error: 'Failed to end game' });
  }
});

export default router;
