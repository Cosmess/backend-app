import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ExcluirAgendaDto {
  @ApiProperty()
  @IsString()
  agendaId?: string;
}
