import { IsString, IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export default class VendorRegisterDTO {
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @IsOptional()
  @IsString()
  storAddress!: string;

  @IsNotEmpty()
  @IsString()
  countryCode!: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  type?: string;
}
