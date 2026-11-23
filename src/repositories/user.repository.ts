import Paginate from '../common/paginate';
import { ErrorResponse } from '../middlewares/errorHandler';
import { User } from '../models';
import { PageParams, UsersAttributes } from '../models/interfaces';
class UserRepository {

  //admin

  static async createUser(data: any): Promise<any> {
    return await User.create(data);
  }

  static async updateUser(id: number, data: any): Promise<any> {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      throw new Error("User not found!");
    }

    let result = await user.update(data);
    result = await result.save();
    return result;
  }

  static async deleteUser(id: number): Promise<any> {
    const user: any | null = await User.findByPk(id)

    if (!user) {
      throw new ErrorResponse("User not found!");
    }
    if (user?.isDeleted) {
      throw new ErrorResponse("User is already deleted")
    }
    let result = await user.update({ isDeleted: true });
    result = await result.save();
    return result;
  }

  static async getUserById(id: number): Promise<any> {
    const user = await User.findOne({ where: { id } });

    if (!user) {
      throw new Error("User not found!");
    }

    return user;
  }

  static async getUsers(obj: Partial<UsersAttributes> & PageParams): Promise<any> {
    const { pageNumber = 1, pageSize = 10, ...otherParams } = obj;
    const attributes = ['id', 'firstName', 'lastName', 'email', 'type', 'isActive','countryCode', 'phoneNumber', 'isEmailVerify', 'type']
    return Paginate(User, pageNumber, pageSize, otherParams,[], attributes)
  }
  
  static async getUsersWithoutAdmin(obj: Partial<UsersAttributes> & PageParams): Promise<any> {
    const { pageNumber, pageSize, ...otherParams } = obj
    // const include = []

    return Paginate(User, pageNumber, pageSize, otherParams)
  }


  static async findUserByEmail(email: string): Promise<any> {
    try {
      const user = await User.findOne({
        where: {
          email: email,
        },
        raw: true
      });
      return user;
    } catch (error: any) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }
  
  static async findUserByKey(key: string, value: string): Promise<any> {
    try {
      const user = await User.findOne({
        where: {
          [key]: value,
          isActive: true
        },
      });
      return user;
    } catch (error: any) {
      throw new Error(`Error finding user by email: ${error.message}`);
    }
  }

  static async updateUserByEmail(email: string, data: any): Promise<any> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return null;
    }
    const expiryDate = new Date();
    const updateOTP = await user.update(
      {
        otp: data,
        otpExpiry: expiryDate
      })
    const updatedUser = await updateOTP.save();

    return updatedUser;
  }

  //app
  static async getOtp(email: string): Promise<any> {

    const latestRecord = await User.findOne({
      where: { email },
      order: [['createdAt', 'DESC']]
    });
    return latestRecord;
  }

  private static sortByOrder(array: any[]) {
    return array.sort((a, b) => a.order - b.order);
  };

  private static sortItems(items: any) {
    return items.sort((a: any, b: any) => a.order - b.order).map((item: any) => {
      if (item.subItems && item.subItems.length > 0) {
        item.subItems = this.sortItems(item.subItems);
      }
      return item;
    });
  }
}

export default UserRepository;
