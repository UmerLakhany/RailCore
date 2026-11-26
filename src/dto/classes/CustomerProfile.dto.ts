import { IsString, IsEmail, IsOptional } from 'class-validator';

export default class CustomerProfileDto {
	@IsOptional()
	@IsString()
	firstName?: string;

	@IsOptional()
	@IsString()
	nickName?: string;

	@IsOptional()
	@IsString()
	countryCode?: string;

	@IsOptional()
	@IsString()
	phoneNumber?: string;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsString()
	gender?: string;

	@IsOptional()
	@IsString()
	country?: string;

	@IsOptional()
	@IsString()
	profilePic?: string;
}
