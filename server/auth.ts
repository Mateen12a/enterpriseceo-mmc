import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'enterpriseceo-masterclass-jwt-secret-key-2026';

export interface AdminTokenPayload {
  adminId: string;
  email: string;
  role: 'admin';
  iat?: number;
  exp?: number;
}

export function generateAdminToken(adminId: string, email: string): string {
  // 10-hour lifetime as specified in Section 4 (8-12 hours)
  return jwt.sign(
    { adminId, email, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '10h' }
  );
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminTokenPayload;
  } catch {
    return null;
  }
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing or malformed authorization token',
    });
    return;
  }

  const token = authHeader.substring(7).trim();
  const payload = verifyAdminToken(token);

  if (!payload) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Token is invalid or has expired',
    });
    return;
  }

  (req as any).adminUser = payload;
  next();
}
