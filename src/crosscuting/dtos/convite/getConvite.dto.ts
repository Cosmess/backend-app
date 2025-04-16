import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class GetConviteDto {
  @ApiProperty({ enum: ['PRESTADOR', 'TOMADOR'] })
  @IsString()
  @IsIn(['PRESTADOR', 'TOMADOR'])
  solicitante: string;
}
