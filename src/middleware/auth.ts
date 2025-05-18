import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User';
import pool from '../db';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key') as {
      id: number;
      username: string;
      email: string;
    };

    const userModel = new UserModel(pool);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      throw new Error();
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
}; 