import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EmailDto {
  @ApiProperty({ example: 'email@dominio.com' })
  @IsString()
  email: string;
}
