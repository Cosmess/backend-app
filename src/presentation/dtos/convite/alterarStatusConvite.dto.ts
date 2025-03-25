import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class AlterarStatusConviteDto {
  @ApiProperty({ enum: ['ACEITO', 'REJEITADO','CANCELADO'] })
  @IsString()
  @IsIn(['ACEITO', 'REJEITADO','CANCELADO'], { message: 'Status deve ser ACEITO ou REJEITADO ou CANCELADO' })
  status: string;

  @ApiProperty()
  @IsString()
  conviteId?: string;
}
