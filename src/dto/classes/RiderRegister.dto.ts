import { IsString, IsEmail, IsNotEmpty, IsNumber, IsOptional, isNotEmpty } from 'class-validator';

export default class RegisterDTO {
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsOptional()
  @IsString()
  lastName!: string;

  @IsNotEmpty()
  @IsString()
  countryCode!: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber!: string;

  @IsOptional()
  @IsString()
  cnic!: string;

  @IsOptional()
  @IsString()
  drivingLicence!: string;

  @IsOptional()
  @IsString()
  profilePic!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  VehicleInfo?: string;

  @IsOptional()
  @IsString()
  type?: string;
}
