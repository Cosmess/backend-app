import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class AlterarStatusConviteDto {
  @ApiProperty({ enum: ['ACEITO', 'RECUSADO','CANCELADO'] })
  @IsString()
  @IsIn(['ACEITO', 'RECUSADO','CANCELADO'], { message: 'Status deve ser ACEITO ou RECUSADO ou CANCELADO' })
  status: string;

  @ApiProperty()
  @IsString()
  conviteId?: string;
}
