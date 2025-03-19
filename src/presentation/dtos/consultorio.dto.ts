import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsDate } from 'class-validator';

export class ConsultorioDto {
  @ApiProperty()
  @IsString()
  nome: string;

  @ApiProperty()
  @IsString()
  razao: string;

  @ApiProperty()
  @IsString()
  cnpj: string;

  @ApiProperty()
  @IsString()
  croResponsavel: string;

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
  telefoneVerificado: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  foto?: string;
}