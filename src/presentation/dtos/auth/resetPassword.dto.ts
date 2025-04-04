import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class ResetPassword {
    @ApiProperty({ example: 'senhaSegura123' })
    @IsString()
    newPassword: string;

    @ApiProperty({ example: 'usuario@usuairio.com' })
    @IsString()
    email: string;

    @ApiProperty({ example: 'usuario@usuairio.com' })
    @IsString()
    codigo: string;
}

