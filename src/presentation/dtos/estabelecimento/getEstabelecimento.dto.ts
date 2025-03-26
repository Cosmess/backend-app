import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsEmail, IsArray, IsDate } from 'class-validator';

export class GetEstabelecimentoDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    cep: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    cidade: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    estado: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    km: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    especialidade: string[];

    @ApiProperty({ type: [Date], required: false })
    @IsOptional()
    @IsArray()
    @Type(() => Date)
    @IsDate({ each: true })
    horarios?: string[];
}
