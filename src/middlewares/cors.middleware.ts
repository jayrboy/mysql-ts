import { Request, Response, NextFunction } from 'express';

const cors = (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'POST,GET,DELETE,PUT');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
};

export default cors;
