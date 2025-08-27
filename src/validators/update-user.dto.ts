import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyMfaDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}

// ... your UpdateUserDto definition, now exported
export class UpdateUserDto {
  // properties here
}
