import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyMfaDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class UpdateUserDto {
  @ApiProperty({ example: 'John', required: false })
  @IsString()
  first_name?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsString()
  last_name?: string;

  @ApiProperty({ example: 'user@example.com', required: false })
  @IsString()
  email?: string;

  @ApiProperty({ example: 'NewPassword123!', required: false })
  @IsString()
  @IsNotEmpty()
  password?: string;

  @ApiProperty({ example: 'secret', required: false })
  @IsString()
  @IsNotEmpty()
  mfa_secret?: string;

  @ApiProperty({ example: true, required: false })
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