import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyMfaDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class UpdateUserDto {
  @IsString()
  first_name?: string;

  @IsString()
  last_name?: string;

  @IsString()
  email?: string;

  @IsString()
  @IsNotEmpty()
  password?: string;

  @IsString()
  @IsNotEmpty()
  mfa_secret?: string;

  @IsString()
  @IsNotEmpty()
  mfa_enabled?: boolean;

  @IsString()
  @IsNotEmpty()
  refresh_token?: string;


  @IsString()
  @IsNotEmpty()
  email_verified?: boolean;

  @IsString()
  @IsNotEmpty()
  password_hash?: string;
}