import { Controller, Post, Body, UnauthorizedException, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { AuthDto } from '../dtos/auth/auth.dto';
import { ChangePassword } from '../dtos/auth/changePassword.dto';
import { ok } from 'assert';
import { JwtAuthGuard } from 'src/infrastructure/jwt/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() authDto: AuthDto) {
    const { token, payload } = await this.authService.login(authDto);
    if (!token) throw new UnauthorizedException('Credenciais inválidas');
    return { token, payload };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('updatepassword')
  async updatePassword(@Body() authDto: ChangePassword, @Req() req: any) {
    const userId = req.user.userId as any;
    const data = await this.authService.updatePassword(authDto, userId);
    if (!data) throw new BadRequestException('Senha atual inválida');
    return { ok };
  }
}
