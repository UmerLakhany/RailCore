import { Request, Response } from 'express';
import UserRepository from '../repositories/user.repository';
import AuthMiddleware from '../auth/jwt';
import PasswordManager from '../auth/passwordManager';
import asyncHandler from '../common/asyncHandler';
import OTP from "../lib/classes/Otp";
import OTPModel from '../models/OTP';
// import RoleRepository from '../../repositories/rbac/roles.repository';
import { ErrorResponse } from '../middlewares/errorHandler';
import RegisterDTO from '../dto/classes/CustomerRegister.dto';
import emailService from './email.service';
import CommonService from './common.service';
const PasswordManagerClass = new PasswordManager();
import emailTemplates from '../lib/emailTemplates.json';
import jwt from 'jsonwebtoken';
import VendorRegisterDTO from '../dto/classes/VendorRegister';
import RiderRegisterDTO from '../dto/classes/RiderRegister.dto';
import { CustomerAddress, Review, Rider, User, VendorAddress } from '../models';
import { OtpAttributes } from '../models/interfaces';
import OAuthService from './oauth.service';
import fetch from 'node-fetch'; // If not already imported
import SmsService from './sms.service';
import ReviewsRepository from '../repositories/reviews.repository';
import OrderRepository from '../repositories/order.repository';

class UserService {
  //==================================common functions===============================\\

  private static login = async (req: Request, res: Response, next?: any) => {
    const { email, password, type } = req.body;

    const user = await UserRepository.findUserByEmail(email);
    if (!user || user === null) {
      return res.generalError("Username or password is not valid!", {}, 404);
    }
    if (!user?.isEmailVerify) {
      return res.generalError("Please verify your email to proceed", {}, 401);
    }
    if (!user?.isActive) {
      return res.generalError("Your account is not active, please contact admin or support to activate your account", {}, 401);
    }
    if (type !== user?.type) {
      return res.generalError("You are not allowed to access this resource", {}, 401)
    }
    const isCorrectPass = await PasswordManagerClass.comparePassword(user.password, password)
    if (!isCorrectPass) {
      return res.generalError("Username or password is invalid", {}, 401)
    }

    const jwt = AuthMiddleware.createJwt({
      id: user.id,
      name: user.firstName,
      email: user.email,
      type: user.type
    })

    delete user?.password
    delete user?.createdBy
    delete user?.updatedBy
    delete user?.isDeleted
    delete user?.deletedBy
    delete user?.deletedAt
    delete user?.createdAt
    delete user?.updatedAt

    return res.generalResponse("Login Successful", { ...user, token: jwt });

  };


  private static register = asyncHandler(async (req: Request, res: Response) => {

    const isUserExist = await UserRepository.findUserByEmail(req.body.email);
    if (!isUserExist) {
      const pass = await PasswordManagerClass.encryptPassword(req.body.password);
      const data = { ...req.body, password: pass };
      const createdUser = await UserRepository.createUser(data);
      // Prepare response with only the required fields
      delete createdUser.password
      console.log("createUser", createdUser);
      const responseData = {
        firstName: createdUser?.firstName,
        lastName: createdUser?.lastName,
        email: createdUser?.email
      }
      // const verifyLink = `${process.env.EMAIL_VERIFICATION_URL}?token=${CommonService.generateEmailVerificationToken(createdUser.id, createdUser.email)}`;

      await emailService.sendTemplateMail(responseData.email, emailTemplates?.welcome?.subject, emailTemplates?.welcome?.template, {
        name: createdUser.firstName,
        otp: await OTP.generateOTP(createdUser.email, createdUser.countryCode + createdUser.phoneNumber, "EMAIL")
      });
      // const smsService = new SmsService();
      // await smsService.sendOTPSMS(
      //   createdUser.countryCode + createdUser.phoneNumber,
      //   await OTP.generateOTP(createdUser.email, createdUser.countryCode + createdUser.phoneNumber, "SMS")
      // )
      res.generalResponse("User registered Successfully", responseData);

    } else {
      res.generalError("User already registered", {}, 409);
    }
  })

  static logout = asyncHandler(async (req: Request, res: Response) => {
    try {
      const expiredToken = AuthMiddleware.createJwt({}, "short")
      res.clearCookie('jwt');
      res.cookie('jwt', expiredToken, { httpOnly: true, secure: true });
      res.json({ message: 'Logout successful' });
    } catch (error: any) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  static forgotPassword = asyncHandler(async (req: Request, res: Response) => {

    const { email, type } = req.body;

    const user = await UserRepository.findUserByEmail(email);
    if (!user) {
      return res.generalError("User not found", {}, 404);
    }


    const token = CommonService.generatePasswordResetToken({ id: user.id, email: user.email });
    const url = type === "ADMIN" ? process.env.PASSWORD_RESET_URL_ADMIN : type === "VENDOR" ? process.env.PASSWORD_RESET_URL_VENDOR : type == "CUSTOMER" ? process.env.PASSWORD_RESET_URL_CUSTOMER : process.env.PASSWORD_RESET_URL_RIDER;

    await emailService.sendTemplateMail(email, emailTemplates?.passwordReset?.subject, emailTemplates?.passwordReset?.template, {
      name: user.firstName,
      resetLink: `${url}?token=${token}`
    });

    res.generalResponse("Password reset link sent to your email address", {});

  });

  static resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Token is required' });
    }
    try {
      const decoded: any = CommonService.verifyPasswordResetToken(token);
      if (!decoded) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
      const user = await UserRepository.getUserById(decoded.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const hashedPassword = await PasswordManagerClass.encryptPassword(newPassword);
      await UserRepository.updateUser(decoded.id, { password: hashedPassword });
      res.generalResponse('Password reset successfully!', {});
    } catch (err: any) {
      res.status(400).json({ error: 'Invalid or expired token' });
    }
  });

  static verifyOtp = asyncHandler(async (req: Request, res: Response) => {

    const { email, otp } = req.body;
    let otpRecord: any = await OTPModel.findOne({ where: { email, otp, isUsed: false } });
    otpRecord = otpRecord?.dataValues || otpRecord;
    let user = await UserRepository.findUserByEmail(email);
    // user = user?.dataValues || user;
    const expiryDate = otpRecord?.expiresAt;

    if (expiryDate && expiryDate < new Date()) {
      return res.generalError("OTP has expired", null, 400);
    }
    if (!otpRecord) {
      return res.generalError("Invalid OTP", null, 400);
    }
    await OTPModel.update({ isUsed: true }, { where: { email, otp } });

    console.log("user", user);
    if (!user?.isEmailVerify) {
      await UserRepository.updateUser(user?.id, { isEmailVerify: true });
    }
    const jwt = AuthMiddleware.createJwt({
      id: user?.id,
      name: user?.firstName,
      email: user?.email,
      type: user?.type
    })

    delete user?.password
    delete user?.createdBy
    delete user?.updatedBy
    delete user?.isDeleted
    delete user?.deletedBy
    delete user?.deletedAt
    delete user?.createdAt
    delete user?.updatedAt

    await emailService.sendTemplateMail(email, emailTemplates?.accountVerificationSubmitted?.subject, emailTemplates?.accountVerificationSubmitted?.template, {
      name: user.firstName,
    });

    return res.generalResponse("OTP verified successfully", { email, user, jwt });

  });

  static resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      return res.generalError("Email is required", null, 400);
    }

    const user = await UserRepository.findUserByEmail(email);
    if (!user) {
      return res.generalError("User not found", null, 404);
    }

    await OTPModel.update(
      { isUsed: true },
      { where: { email, isUsed: false } }
    );

    const newOtp = await OTP.generateOTP(email);

    await emailService.sendTemplateMail(
      email,
      emailTemplates?.welcome?.subject,
      emailTemplates?.welcome?.template,
      {
        name: user.firstName,
        otp: newOtp
      }
    );

    return res.generalResponse("OTP resent successfully", { email });
  });

  static changePassword = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const isUserExist = await UserRepository.findUserByEmail(email);
      if (!isUserExist) {
        res.generalError("User Not Found!", null, 404);
      } else {
        const userUpdated = UserRepository.updateUserByEmail(email, password);
        res.generalResponse("otp", userUpdated);
      }

    } catch (error) {
      res.generalError("Something went wrong!", null, 500)
    }
  });

  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const id = req.user.id;
      const data = req.body;
      const result = await UserRepository.updateUser(id, data);

      res.generalResponse('Profile updated successfuly!', result);

    } catch (error: any) {
      res.status(400).json({ message: `Error updating user profile: ${error.message}` });
    }
  }

  static deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const requestedUser = req.user
    if (requestedUser && requestedUser.type !== "ADMIN") {
      return res.generalError("You are not allowed to access this resource", {}, 403);
    }
    const result = await UserRepository.deleteUser(Number(id));
    res.generalResponse('User deleted successfuly!', {})
  })

  static updateUser = asyncHandler(async (req: Request, res: Response) => {
    const requestedUser = req.user
    if (requestedUser && requestedUser.type !== "ADMIN") {
      return res.generalError("You are not allowed to access this resource", {}, 403);
    }
    const result = await UserRepository.updateUser(req.body.id, req.body.data);
    res.generalResponse('User updated successfuly!', result)
  })

  static getUserById = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user
    if (user && user.type !== "ADMIN") {
      return res.generalError("You are not allowed to access this resource", {}, 403);
    }
    const { id } = req.params;
    let result = await UserRepository.getUserById(Number(id));
    result = result?.dataValues || result;
    console.log("result", result);
    delete result?.password;
    delete result?.createdBy;
    delete result?.updatedBy;
    delete result?.isDeleted;
    delete result?.deletedBy;
    delete result?.deletedAt;
    delete result?.createdAt;
    delete result?.updatedAt;

    res.generalResponse('Data fetched successfuly!', result)
  })

  static getUser = asyncHandler(async (req: Request, res: Response) => {

    const user = req.user
    if (user && user.type !== "ADMIN") {
      return res.generalError("You are not allowed to access this resource", {}, 403);
    }
    let users = await UserRepository.getUsers(req.query);
    users = users?.dataValues || users;
    
    // Convert records to plain objects with completed orders count
    const recordsWithCount = await Promise.all(
      users.records.map(async (user: any) => {
        const userObj = user.toJSON ? user.toJSON() : user;
        const averageRating = await ReviewsRepository.getAverageRatingForVendor(userObj.id);
        const count = await OrderRepository.getCompletedOrdersCount({
          customerId: userObj.type === "CUSTOMER" ? userObj.id : undefined,
          vendorId: userObj.type === "VENDOR" ? userObj.id : undefined,
        });
        const canceledCount = await OrderRepository.getCanceledOrdersCount({
          customerId: userObj.type === "CUSTOMER" ? userObj.id : undefined,
          vendorId: userObj.type === "VENDOR" ? userObj.id : undefined,
        });
        let address = undefined;
        if(userObj.type === "VENDOR") {
          address = await VendorAddress.findOne({ where: { vendor_id: userObj.id } });
        }
        if(userObj.type === "CUSTOMER") {
          address = await CustomerAddress.findOne({ where: { customer_id: userObj.id } });
        }
        const successScore = count + canceledCount > 0 ? (count / (count + canceledCount)) * 100 : 0;
        return {
          ...userObj,
          completedOrdersCount: count || 0,
          rating: averageRating || 0,
          successScore: successScore || 0,
          address: address || null
        };
      })
    );
    
    const response = {
      ...users,
      records: recordsWithCount
    };
    
    return res.generalResponse('Data fetched successfuly!', response);
  })

  static verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.query;
    if (!token || typeof token !== 'string') {
      return res.status(400).json({ error: 'Token is required' });
    }
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error('JWT_SECRET not defined');
      const decoded: any = jwt.verify(token, secret);
      if (decoded.type !== 'email_verification') {
        return res.status(400).json({ error: 'Invalid token type' });
      }
      // Check if already verified
      const user = await UserRepository.getUserById(decoded.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      if (user.isEmailVerify) {
        return res.status(400).json({ error: 'Email already verified' });
      }
      await UserRepository.updateUser(decoded.userId, { isEmailVerify: true });
      // Optionally: store used tokens in DB or cache to prevent reuse
      res.generalResponse('Email verified successfully!', {});
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        return res.status(400).json({ error: 'Token expired' });
      }
      res.status(400).json({ error: 'Invalid or expired token' });
    }
  });

  static verification = asyncHandler(async (req: Request, res: Response) => {
    const { email, cnic, govtID } = req.body;
    const errors: { type: string; message: string }[] = [];

    try {
      if (email) {
        const userByEmail = await UserRepository.findUserByEmail(email);
        if (userByEmail) {
          errors.push({ type: 'email', message: 'Email already exists' });
        }
      }

      if (cnic) {
        const userByCnic = await UserRepository.findUserByKey("cnic", cnic);
        if (userByCnic) {
          errors.push({ type: 'cnic', message: 'CNIC already exists' });
        }
      }

      if (govtID) {
        const userByGovtID = await UserRepository.findUserByKey("govtID", govtID);
        if (userByGovtID) {
          errors.push({ type: 'govtID', message: 'Government ID already exists' });
        }
      }

      if (errors.length > 0) {
        return res.generalError('Validation failed', { errors }, 400);
      }

      return res.generalResponse('Verification successful');
    } catch (error) {
      return res.generalError('Something went wrong', { error }, 500);
    }
  });

  //==================================Admin logics==============================\\

  static adminLogin = asyncHandler(async (req: Request, res: Response, next) => {
    req.body.type = "ADMIN";
    await UserService.login(req, res, next);
  });

  static adminRegister = asyncHandler(async (req: Request, res: Response, next) => {
    req.body.type = "ADMIN";
    const dto = new RegisterDTO();
    dto.firstName = req.body.firstName;
    dto.lastName = req.body.lastName;
    dto.countryCode = req.body.countryCode;
    dto.email = req.body.email;
    dto.phoneNumber = req.body.phoneNumber;
    dto.password = req.body.password;
    dto.type = req.body.type
    req.body = dto;

    await UserService.register(req, res, next);
  })

  //==================================Customer logics==============================\\

  static customerLogin = asyncHandler(async (req: Request, res: Response, next) => {
    req.body.type = "CUSTOMER";
    await UserService.login(req, res, next);
  });

  static customerRegister = asyncHandler(async (req: Request, res: Response, next) => {
    req.body.type = "CUSTOMER";
    const dto = new RegisterDTO();
    dto.firstName = req.body.firstName;
    dto.lastName = req.body.lastName;
    dto.countryCode = req.body.countryCode;
    dto.email = req.body.email;
    dto.phoneNumber = req.body.phoneNumber;
    dto.password = req.body.password;
    dto.type = req.body.type
    
    req.body = { ...dto, ...req.body, isActive: true };

    await UserService.register(req, res, next);
  })

  //====================================Vendor logics================================\\

  static vendorLogin = asyncHandler(async (req: Request, res: Response) => {
    try {
      console.log("vendor login")
      req.body.type = "VENDOR";
      return await UserService.login(req, res);
    } catch (err) {
      console.log("err", err)
    }
  });

  static vendorRegister = asyncHandler(async (req: Request, res: Response, next) => {
    req.body.type = "VENDOR";
    const dto = new VendorRegisterDTO();
    dto.firstName = req.body.firstName;
    dto.lastName = req.body.lastName;
    dto.storAddress = req.body.storAddress;
    dto.email = req.body.email;
    dto.phoneNumber = req.body.phoneNumber;
    dto.password = req.body.password;
    dto.type = req.body.type
    req.body = { ...dto, ...req.body };

    await UserService.register(req, res, next);
  })

  //====================================Rider logics================================\\

  static riderLogin = asyncHandler(async (req: Request, res: Response, next) => {
    req.body.type = "RIDER";
    await UserService.login(req, res, next);
  });

  static riderRegister = asyncHandler(async (req: Request, res: Response, next) => {
    req.body.type = "RIDER";
    const dto = new RiderRegisterDTO();
    dto.firstName = req.body.firstName;
    dto.email = req.body.email;
    dto.phoneNumber = req.body.phoneNumber;
    dto.password = req.body.password;
    dto.drivingLicence = req.body.drivingLicence;
    dto.VehicleInfo = req.body.VehicleInfo;
    req.body = { ...dto, ...req.body };
    console.log("req.body", req.body);
    await UserService.register(req, res, next);

  });


  //=================================sso=========================\\

  static googleSSOLogin = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { access_token, type } = req.body;

      const authresponse = await OAuthService.verifyGoogleToken(access_token);
      console.log("authresponse", authresponse);

      if (!authresponse) {
        return res.status(401).json({ message: "Invalid Google token" });
      }

      let user: any = await User.findOne({ where: { email: authresponse.email } });
      user = user?.dataValues || user;

      if (!user) {

        let newUser: any = await User.create({
          firstName: authresponse.given_name,
          lastName: authresponse.family_name,
          email: authresponse.email,
          profilePic: authresponse.picture,
          type,
          countryCode: '',
          phoneNumber: '',
          password: "N/A",
          status: 'Approved',
          isEmailVerify: true,
          firstPageVisited: ""
        });

        const jwt = AuthMiddleware.createJwt({
          id: newUser.id,
          name: newUser.firstName,
          email: newUser.email,
          type: newUser.type
        });

        newUser = newUser.dataValues

        delete newUser?.password
        delete newUser?.createdBy
        delete newUser?.updatedBy
        delete newUser?.isDeleted
        delete newUser?.deletedBy
        delete newUser?.deletedAt
        delete newUser?.createdAt
        delete newUser?.updatedAt

        return res.generalResponse("Login Successful", { ...newUser, token: jwt });
      }

      if (user && user.type !== type) {
        return res.generalError("You are not allowed to access this resource", {}, 401)
      } else {
        const jwt = AuthMiddleware.createJwt({
          id: user.id,
          name: user.firstName,
          email: user.email,
          type: user.type
        });

        delete user?.password
        delete user?.createdBy
        delete user?.updatedBy
        delete user?.isDeleted
        delete user?.deletedBy
        delete user?.deletedAt
        delete user?.createdAt
        delete user?.updatedAt

        return res.generalResponse("Login Successful", { ...user, token: jwt });
      }


      // Check if the user already exists in the database
      // let user = await User.findOne({ where: { email: authresponse.email } });

      // if (!user) {
      //   // If the user doesn't exist, create a new one
      //   user = await User.create({
      //     email: userInfo.email,
      //     firstName: userInfo.name,
      //     type,
      //   });
      // }

      // // Generate a JWT token for the user
      // const token = generateToken(user.id);

      // return res.json({ token });
    } catch (err) {
      console.log("err", err)
    }
  });

  static fbSSOLogin = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { access_token, type } = req.body;
      const fbData = await OAuthService.verifyFacebookToken(access_token);

      if (!fbData) {
        return res.status(401).json({ message: "Invalid Facebook token" });
      }

      let user: any = await User.findOne({ where: { email: fbData.email } });
      user = user?.dataValues || user;
      if (!user) {
        let newUser: any = await User.create({
          firstName: fbData.first_name,
          lastName: fbData.last_name,
          email: fbData.email,
          profilePic: fbData.picture?.data?.url,
          type,
          countryCode: '',
          phoneNumber: '',
          password: "N/A",
          status: 'Approved',
          isEmailVerify: true,
          firstPageVisited: "",
        });

        const jwt = AuthMiddleware.createJwt({
          id: newUser.id,
          name: newUser.firstName,
          email: newUser.email,
          type: newUser.type
        });

        newUser = newUser.dataValues;
        delete newUser?.password;
        delete newUser?.createdBy;
        delete newUser?.updatedBy;
        delete newUser?.isDeleted;
        delete newUser?.deletedBy;
        delete newUser?.deletedAt;
        delete newUser?.createdAt;
        delete newUser?.updatedAt;

        return res.generalResponse("Login Successful", { ...newUser, token: jwt });
      }

      if (user && user.type !== type) {
        return res.generalError("You are not allowed to access this resource", {}, 401);
      } else {
        const jwt = AuthMiddleware.createJwt({
          id: user.id,
          name: user.firstName,
          email: user.email,
          type: user.type
        });

        delete user?.password;
        delete user?.createdBy;
        delete user?.updatedBy;
        delete user?.isDeleted;
        delete user?.deletedBy;
        delete user?.deletedAt;
        delete user?.createdAt;
        delete user?.updatedAt;

        return res.generalResponse("Login Successful", { ...user, token: jwt });
      }
    } catch (err) {
      console.log("err", err);
    }
  });


  //==================================Utility functions===============================\\

  static getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await UserRepository.getUserById(req.user.id);
    if (!user) {
      return res.generalError("User not found", {}, 404);
    }
    delete user?.password
    delete user?.createdBy
    delete user?.updatedBy
    delete user?.isDeleted
    delete user?.deletedBy
    delete user?.deletedAt
    delete user?.createdAt
    delete user?.updatedAt

    return res.generalResponse("Data fetched successfully", user);
  });

  static async userApproval(req: Request, res: Response): Promise<void> {
    const { userId } = req.body;
    const requestedUser = req.user
    if (requestedUser && requestedUser.type !== "ADMIN") {
      return res.generalError("You are not allowed to access this resource", {}, 403);
    }
    if (!userId) {
      return res.generalError("User ID is required", {}, 400);
    }

    const user = await UserRepository.getUserById(userId);

    if (!user) {
      return res.generalError("User not found", {}, 404);
    }

    user.isActive = true;
    user.updatedBy = req.user.id;
    user.updatedAt = new Date();
    user.status = "Approved";
    await user.save();

    // await emailService.sendTemplateMail(
    //   user?.dataValues?.email || user?.email, 
    //   emailTemplates?.accountApproved?.subject, 
    //   emailTemplates?.accountApproved?.template, 
    //   {
    //     name: user?.dataValues?.firstName || user?.firstName,
    //   }
    // );

    // delete user?.password;
    // delete user?.createdBy;
    // delete user?.updatedBy;
    // delete user?.isDeleted;
    // delete user?.deletedBy;
    // delete user?.deletedAt;
    // delete user?.createdAt;
    // delete user?.updatedAt;

    return res.generalResponse("User approved successfully", {});
  }

  static async userRejection(req: Request, res: Response): Promise<void> {
    const { userId, rejectionReason } = req.body;
    const requestedUser = req.user
    if (requestedUser && requestedUser.type !== "ADMIN") {
      return res.generalError("You are not allowed to access this resource", {}, 403);
    }
    if (!userId) {
      return res.generalError("User ID is required", {}, 400);
    }

    const user = await UserRepository.getUserById(userId);

    if (!user) {
      return res.generalError("User not found", {}, 404);
    }

    user.isActive = false;
    user.updatedBy = req.user.id;
    user.updatedAt = new Date();
    user.status = "Rejected";
    if (rejectionReason) {
      user.rejectionReason = rejectionReason;
    }
    await user.save();
     
    // await emailService.sendTemplateMail(
    //   user?.dataValues?.email || user?.email, 
    //   emailTemplates?.accountRejected?.subject, 
    //   emailTemplates?.accountRejected?.template, 
    //   {
    //     name: user?.dataValues?.firstName || user?.firstName,
    //     rejectionReason: rejectionReason || "Not specified"
    //   }
    // );

    delete user?.password;
    delete user?.createdBy;
    delete user?.updatedBy;
    delete user?.isDeleted;
    delete user?.deletedBy;
    delete user?.deletedAt;
    delete user?.createdAt;
    delete user?.updatedAt;

    return res.generalResponse("User rejected successfully", user);
  }


  static getVendorRatings = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    let reviews = await ReviewsRepository.getAverageRatingForVendor(Number(id));
    return res.generalResponse('Data fetched successfully!', reviews);

  });

  static getVendorAddress = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const address = await VendorAddress.findAll({ where: { vendor_id: Number(id) } });

    return res.generalResponse('Data fetched successfully!', address);
  });
}

export default UserService;