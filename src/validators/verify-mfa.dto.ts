import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyMfaDto {
	@ApiProperty({ example: '123456' })
	@IsString()
	@IsNotEmpty()
	code: string;
}
