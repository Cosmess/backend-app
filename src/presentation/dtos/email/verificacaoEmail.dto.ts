import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerificacaoEmailDto {
  @ApiProperty({ example: 'email@dominio.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'email@dominio.com' })
  @IsString()
  codigo: string;
}
