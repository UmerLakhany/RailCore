import { IsString, IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export default class RegisterDTO {
  @IsNotEmpty()
  @IsString()
  firstName!: string;
  
  @IsOptional()
  @IsString()
  lastName?: string;
  
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
