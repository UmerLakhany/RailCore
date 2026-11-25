import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export default class LoginDTO {
  @IsNotEmpty()
  @IsEmail({}, { message: 'email must be a valid email address' })
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(72)
  password!: string;
}
