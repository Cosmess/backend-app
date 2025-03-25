import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class GetProfissionallDto {
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
}
