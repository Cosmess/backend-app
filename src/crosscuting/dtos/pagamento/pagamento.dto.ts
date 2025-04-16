import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class PagamentoDto {
    @ApiProperty()
    @IsString()
    email: string;
}
