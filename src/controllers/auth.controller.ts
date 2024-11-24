import { Request, Response } from 'express';
import { generateToken } from '../utils/jwtUtils';
import pool from '../db';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    const users = rows as { id: number; email: string; role: string; password: string }[];

    if (users.length === 0) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }

    const user = users[0];

    if (user.password !== password) {
      res.status(401).json({ error: 'Invalid username or password' });
      return;
    }
    const token = generateToken(user);

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
