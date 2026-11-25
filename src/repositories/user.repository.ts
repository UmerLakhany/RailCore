import { User } from '../models';
import { UserCreationAttributes } from '../models/interfaces';

class UserRepository {
  static async create(data: UserCreationAttributes): Promise<User> {
    return User.create(data);
  }

  static async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email: email.trim().toLowerCase() } });
  }

  static async findById(id: string): Promise<User | null> {
    return User.findByPk(id);
  }

  static async markLoggedIn(user: User): Promise<void> {
    await user.update({ lastLoginAt: new Date() });
  }
}

export default UserRepository;
