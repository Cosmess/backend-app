import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsDate, IsArray } from 'class-validator';

export class EstabelecimentoDto {
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

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Upload da imagem do estabelecimento (JPEG/PNG até 1MB)',
  })
  @IsOptional()
  foto?: any;

  @ApiProperty()
  @IsString()
  senha: string;

  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsBoolean()
  emailVerificado: boolean;

  @ApiProperty()
  @IsBoolean()
  exibirNumero: boolean;

  @ApiProperty({ type: [String] })
  @IsArray()
  especialidades: string[];

  @ApiProperty()
  @IsString()
  celular: string;
}