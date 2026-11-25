import jwt, { SignOptions } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/interfaces';

export interface AccessTokenPayload {
  sub: string; // user id
  email: string;
  role: UserRole;
  type: 'access';
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AccessTokenPayload;
  }
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not defined');
  return secret;
}

class AuthMiddleware {
  static createAccessToken(payload: Omit<AccessTokenPayload, 'type'>): { token: string; expiresIn: string } {
    const expiresIn = process.env.JWT_EXPIRY || '15m';
    const token = jwt.sign({ ...payload, type: 'access' }, getSecret(), {
      expiresIn: expiresIn as SignOptions['expiresIn'],
    });
    return { token, expiresIn };
  }

  /** Protects routes: requires `Authorization: Bearer <accessToken>`. */
  static auth(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7).trim() : '';

    if (!token) {
      return res.generalError('Authentication required', null, 401);
    }

    try {
      const decoded = jwt.verify(token, getSecret()) as AccessTokenPayload;
      if (decoded.type !== 'access') {
        return res.generalError('Invalid token', null, 401);
      }
      req.user = decoded;
      next();
    } catch {
      res.generalError('Invalid or expired token', null, 401);
    }
  }
}

export default AuthMiddleware;
