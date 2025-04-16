import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CriarAgendaDto {
  @ApiProperty({ type: [Date], required: false })
  @IsOptional()
  @IsArray()
  @Type(() => Date)
  @IsDate({ each: true })
  horarios?: Date[];
}
