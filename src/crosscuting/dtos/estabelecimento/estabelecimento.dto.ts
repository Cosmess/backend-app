import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsDate,
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
  IsEmail,
} from 'class-validator';

export class EstabelecimentoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  nome: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'A razão social não pode ser vazia.' })
  razao: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O CNPJ não pode ser vazio.' })
  cnpj: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O CRO não pode ser vazio.' })
  cro: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O endereço não pode ser vazio.' })
  endereco: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O número não pode ser vazio.' })
  numero: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O CEP não pode ser vazio.' })
  cep: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O bairro não pode ser vazio.' })
  bairro: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'A cidade não pode ser vazia.' })
  cidade: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O estado não pode ser vazio.' })
  estado: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate({ message: 'A data de criação é inválida.' })
  @IsNotEmpty({ message: 'O campo created é obrigatório.' })
  created: Date;

  @ApiProperty()
  @Type(() => Date)
  @IsDate({ message: 'A data de atualização é inválida.' })
  @IsNotEmpty({ message: 'O campo updated é obrigatório.' })
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
  @IsNotEmpty({ message: 'A senha não pode ser vazia.' })
  senha: string;

  @ApiProperty()
  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'O e-mail não pode ser vazio.' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo emailVerificado é obrigatório.' })
  emailVerificado: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'O campo exibirNumero é obrigatório.' })
  exibirNumero: boolean;

  @ApiProperty({ type: [String] })
  especialidades: string[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'O celular não pode ser vazio.' })
  celular: string;
}
