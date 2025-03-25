import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsDate, IsString } from 'class-validator';

export class CriarConviteDto {
    @ApiProperty()
    @IsString()
    agendaId?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    tomadorId?: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    mensagem?: string;
}
