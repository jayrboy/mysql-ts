import { Request, Response, NextFunction } from 'express';

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  switch (err.name) {
    case 'ValidationError':
      res.status(400).json({ message: err.message });
      break;
    case 'DatabaseError':
      res.status(500).json({ message: 'Database error occurred' });
      break;
    default:
      if (err.stack) {
        console.error(err.stack);
        res.status(500).type('text/plain').send('500 Internal Server Error');
        break;
      } else {
        next(err);
      }
  }
};

export default errorHandler;
