import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class AuthDto {
  @ApiProperty({ example: 'email@dominio.com ou 11999999999' })
  @IsString()
  emailOrPhone: string;

  @ApiProperty({ example: 'senhaSegura123' })
  @IsString()
  senha: string;

  @ApiProperty({ example: 'profissional', enum: ['profissional', 'consultorio'] })
  @IsIn(['profissional', 'consultorio'])
  type: string;
}
