import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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

      @ApiProperty({ type: Date, required: false })
      @IsOptional()
      @Type(() => Date)
      @IsDate({ each: true })
      horario?: Date;
}
