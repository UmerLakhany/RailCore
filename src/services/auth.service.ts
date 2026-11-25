import { Request, Response } from 'express';
import { UniqueConstraintError } from 'sequelize';
import AuthMiddleware from '../auth/jwt';
import PasswordManager from '../auth/passwordManager';
import RegisterDTO from '../dto/classes/Register.dto';
import LoginDTO from '../dto/classes/Login.dto';
import { ErrorResponse } from '../middlewares/errorHandler';
import UserRepository from '../repositories/user.repository';

// Used so a login for an unknown email takes about as long as one for a known email.
const DUMMY_HASH = PasswordManager.hashSync('railcore-timing-equalizer');

class AuthService {
  /**
   * POST /v1/auth/register
   * Public sign-up always creates a PASSENGER. Staff roles are assigned by admins (RBAC module).
   */
  static async register(req: Request, res: Response) {
    const { firstName, lastName, email, phoneNumber, password } = req.body as RegisterDTO;

    if (await UserRepository.findByEmail(email)) {
      throw new ErrorResponse('An account with this email already exists', 409);
    }

    try {
      const user = await UserRepository.create({
        firstName: firstName.trim(),
        lastName: lastName?.trim() || null,
        email,
        phoneNumber: phoneNumber || null,
        password: await PasswordManager.hash(password),
        role: 'PASSENGER',
      });

      return res.generalResponse('Registration successful', { user: user.toPublic() }, 201);
    } catch (err) {
      // Race: two concurrent registrations with the same email.
      if (err instanceof UniqueConstraintError) {
        throw new ErrorResponse('An account with this email already exists', 409);
      }
      throw err;
    }
  }

  /** POST /v1/auth/login */
  static async login(req: Request, res: Response) {
    const { email, password } = req.body as LoginDTO;

    const user = await UserRepository.findByEmail(email);
    const passwordOk = await PasswordManager.compare(password, user?.password ?? DUMMY_HASH);

    if (!user || !passwordOk) {
      throw new ErrorResponse('Invalid email or password', 401);
    }
    if (!user.isActive) {
      throw new ErrorResponse('This account has been deactivated', 403);
    }

    await UserRepository.markLoggedIn(user);

    const { token, expiresIn } = AuthMiddleware.createAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return res.generalResponse('Login successful', {
      user: user.toPublic(),
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn,
    });
  }
}

export default AuthService;
