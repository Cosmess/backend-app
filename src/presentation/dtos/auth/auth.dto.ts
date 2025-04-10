import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @ApiProperty({ example: 'email@dominio.com ou 11999999999' })
  @IsString()
  @IsNotEmpty({ message: 'O campo email não pode ser vazio.' })
  emailOrPhone: string;

  @ApiProperty({ example: 'senhaSegura123' })
  @IsString()
  @IsNotEmpty({ message: 'O campo senha não pode ser vazio.' })
  senha: string;

  @ApiProperty({ example: 'profissional', enum: ['profissional', 'estabelecimento'] })
  @IsIn(['profissional', 'estabelecimento'])
  @IsNotEmpty({ message: 'O campo type não pode ser vazio.' })
  type: string;
}
