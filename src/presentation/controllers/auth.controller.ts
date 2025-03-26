import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { AuthDto } from '../dtos/auth/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() authDto: AuthDto) {
    const { token, payload } = await this.authService.login(authDto);
    if (!token) throw new UnauthorizedException('Credenciais inválidas');
    return { token, payload };
  }
}
