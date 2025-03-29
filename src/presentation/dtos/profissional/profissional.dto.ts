import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsDate, IsEmail, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

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
  @Type(() => Date)
  @IsDate()
  created: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  updated: Date;

  @ApiProperty()
  @IsString()
  descricao: string;

  @ApiProperty()
  @IsBoolean()
  emailVerificado: boolean;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Upload da imagem do profissional (JPEG/PNG até 1MB)',
  })
  @IsOptional()
  foto?: any;

  @ApiProperty()
  @IsString()
  senha: string;

  @ApiProperty()
  @IsBoolean()
  exibirNumero: boolean;

  @ApiProperty({ type: [String] })
  @IsArray()
  especialidades: string[];

  @ApiProperty()
  @IsString()
  facebook: string;

  @ApiProperty()
  @IsString()
  instagram: string;

  @ApiProperty()
  @IsString()
  link: string;
  
}