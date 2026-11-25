import bcrypt from 'bcryptjs';

class PasswordManager {
  private static readonly saltRounds = 12;

  static hash(password: string): Promise<string> {
    return bcrypt.hash(password, PasswordManager.saltRounds);
  }

  static hashSync(password: string): string {
    return bcrypt.hashSync(password, PasswordManager.saltRounds);
  }

  static compare(plainPassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hash);
  }
}

export default PasswordManager;
