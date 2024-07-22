import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../models/api-response.model';

export const generateToken = async (req: Request, res: Response) => {
  const payload = {
    // เพิ่มข้อมูลเพิ่มเติมหากต้องการ เช่น userID หรือข้อมูลอื่นๆ
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  try {
    // สร้าง JWT token
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    // สร้างการตอบสนอง
    const response: ApiResponse = {
      statusCode: 201,
      message: 'Token generated successfully',
      data: token,
    };

    // ส่งข้อมูลออกไป
    res.status(201).json(response);
  } catch (error: any) {
    const response: ApiResponse = {
      statusCode: 500,
      message: 'Internal Server Error',
      error: error.message,
    };
    res.status(500).json(response);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    let { username, password } = req.body;

    // Check if the user exists
    // let user = await User.findOneAndUpdate(
    //   { username },
    //   { useFindAndModify: false }
    // );

    // if (!user) {
    //   return res.status(404).send('User Not Found!!!');
    // }

    // Compare passwords
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(400).send('Password Invalid!!!');
    // }

    // Generate token
    const payload = {
      username: username,
      name: name,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    jwt.sign(payload, secret, { expiresIn: '1d' }, (error, token) => {
      if (error) throw error;

      const response: ApiResponse = {
        statusCode: 200,
        message: 'Login successfully',
        data: { token, payload },
      };

      res.json(response);
    });
  } catch (error: any) {
    const response: ApiResponse = {
      statusCode: 500,
      message: 'Internal Server Error',
      error: error,
    };
    res.status(500).json(response);
  }
};
