import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyMfaDto { @IsString() @IsNotEmpty() code: string; }
