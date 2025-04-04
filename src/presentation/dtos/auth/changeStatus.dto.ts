import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class ChangeStatus {
    @ApiProperty({ example: 'profissional', enum: ['profissional', 'estabelecimento'] })
    @IsIn(['profissional', 'estabelecimento'])
    type: string;

    @ApiProperty({ example: 'ATIVO', enum: ['ATIVO', 'INATIVO'] })
    @IsIn(['ATIVO', 'INATIVO'])
    status: string;
}
