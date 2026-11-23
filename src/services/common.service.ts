import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import Uploads from '../models/Uploads';

class CommonService {

  static generateEmailVerificationToken(userId: number, email: string): string {
    // 24 hours expiry
    const payload = {
      userId,
      email,
      type: 'email_verification'
    };
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not defined');
    return jwt.sign(payload, secret, { expiresIn: '24h' });
  }

  static generatePasswordResetToken(user: any) {
    // Token valid for 15 minutes, type: 'password_reset'
    const payload = {
      id: user.id,
      email: user.email,
      type: 'password_reset',
    };
    const secret = process.env.JWT_SECRET || 'changeme';
    // 15 minutes expiry
    return jwt.sign(payload, secret, { expiresIn: '15m' });
  }

  
  static verifyPasswordResetToken(token: string) {
    const secret = process.env.JWT_SECRET || 'changeme';
    try {
      const decoded: any = jwt.verify(token, secret);
      if (decoded.type !== 'password_reset') throw new Error('Invalid token type');
      return decoded;
    } catch (err) {
      return null;
    }
  }

  static async uploadFiles(req: Request, res: Response) {
    console.log('Files in request:', req.files);
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    if(files.length){
      await Promise.all(files.map(async (file) => {
        await Uploads.create({
          fileHash: file.filename,
          originalName: file.originalname,
          filePath: file.path,
          size: file.size,
        });
      }));
    }

    res.json({
      message: `${files.length} file(s) uploaded successfully`,
      files,
    });
  }



}

export default CommonService;
