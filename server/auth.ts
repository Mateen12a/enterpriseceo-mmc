import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = (() => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production') {
    // Fail fast rather than ship a forgeable secret. Set JWT_SECRET in the environment.
    throw new Error('JWT_SECRET is required in production. Generate one with: openssl rand -base64 48');
  }
  // Development only: ephemeral per-boot secret (never committed, invalidates old sessions on restart).
  console.warn('[Auth] JWT_SECRET not set - using an ephemeral random secret for this session only.');
  return crypto.randomBytes(32).toString('hex');
})();

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
