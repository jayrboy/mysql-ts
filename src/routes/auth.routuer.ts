import Express, { Request, Response, NextFunction } from 'express';
import { generateToken } from '../controllers/auth.controller';

const router = Express.Router();

// Middleware เฉพาะเส้นทาง
router.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Authorization Middleware is running!');
  next();
});

// POST: /api/token
router.post('/token', generateToken);

export default router;
