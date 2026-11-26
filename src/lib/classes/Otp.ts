import OTPModel from '../../models/OTP';

class OTP {

  static async generateOTP(email?: string, phoneNumber?: string, type?: string): Promise<string> {

    let digits = "0123456789"
    let len = digits.length;
    let createOTP = "";

    const otpLength = parseInt(process.env.OTP_LENGTH ?? "4");
    for (let i = 0; i < otpLength; i++) {
      createOTP += digits[Math.floor(Math.random() * len)];
    }

    await this.saveOTPToDB(phoneNumber!, createOTP, email, new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY ?? "10") * 60000)), type);

    return createOTP;
  }

  static async saveOTPToDB(phoneNumber: string, otp: string, email?: string, expiresAt?: Date, type?: string) {
    try{
      console.log('Saving OTP to DB:', { email, phoneNumber, otp, expiresAt });
      return OTPModel.create({
        otp,
        email: email || '',
        phoneNumber,
        expiresAt,
        type: type || '',
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error saving OTP to DB:', error);
      throw error; 
    }
  }
}

export default OTP;