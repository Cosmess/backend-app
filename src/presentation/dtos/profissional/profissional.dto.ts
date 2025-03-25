import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsDate, IsEmail, isString, IsArray } from 'class-validator';

export class ProfissionalDto {
  @ApiProperty()
  @IsString()
  nome: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  celular: string;

  @ApiProperty()
  @IsString()
  cro: string;

  @ApiProperty()
  @IsString()
  endereco: string;

  @ApiProperty()
  @IsString()
  numero: string;

  @ApiProperty()
  @IsString()
  cep: string;

  @ApiProperty()
  @IsString()
  cidade: string;

  @ApiProperty()
  @IsString()
  estado: string;

  @ApiProperty()
  @IsDate()
  created: Date;

  @ApiProperty()
  @IsDate()
  updated: Date;

  @ApiProperty()
  @IsString()
  descricao: string;

  @ApiProperty()
  @IsBoolean()
  emailVerificado: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  foto?: string;

  @ApiProperty()
  @IsString()
  senha: string;

  @ApiProperty()
  @IsBoolean()
  exibirNumero: boolean;

  @ApiProperty()
  @IsArray()
  especialidades: string[];

}
