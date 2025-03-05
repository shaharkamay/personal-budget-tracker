// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface UserPayload {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ success: false, error: 'No token provided' });
    }

    const ticket = await client.verifyIdToken({
      idToken: token || '',
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    
    if (!payload || !payload.email) {
      res.status(401).json({ success: false, error: 'Invalid token' });
    }

    req.user = {
      email: payload?.email || '',
      name: payload?.name || '',
      picture: payload?.picture || '',
      sub: payload?.sub || ''
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};