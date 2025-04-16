import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class ChangePassword {
    @ApiProperty({ example: 'senhaSegura123' }) @IsString()
    oldPassword: string;

    @ApiProperty({ example: 'senhaSegura123' })
    @IsString()
    newPassword: string;

    @ApiProperty({ example: 'profissional', enum: ['profissional', 'estabelecimento'] })
    @IsIn(['profissional', 'estabelecimento'])
    type: string;
}
