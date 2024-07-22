import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { ApiResponse } from '../models/api-response.model';

interface UserRequest extends Request {
  user?: string;
}

const auth = async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // "Bearer <token>" split to ["Bearer", "token"]

    if (!token) {
      const response: ApiResponse = {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'No Token',
      };
      res.status(401).json(response); // เพิ่ม return เพื่อหยุดการทำงานหลังจากส่งการตอบสนอง
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded.username;

    next();
  } catch (error: any) {
    const response: ApiResponse = {
      statusCode: 403,
      message: 'Forbidden',
      error: error.message || 'Token Invalid', // แสดงข้อความข้อผิดพลาดที่ได้รับจาก exception
    };

    res.status(403).json(response);
  }
};

export default auth;
