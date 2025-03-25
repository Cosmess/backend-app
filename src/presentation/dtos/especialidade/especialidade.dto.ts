import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class EspecialidadeDto {
    @ApiProperty()
    @IsString()
    nome: string;
}
