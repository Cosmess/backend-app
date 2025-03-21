import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { AuthDto } from '../dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() authDto: AuthDto) {
    const { token, user } = await this.authService.login(authDto);
    if (!token) throw new UnauthorizedException('Credenciais inválidas');
    return { token, user };
  }
}
