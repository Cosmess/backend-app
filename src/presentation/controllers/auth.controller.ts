import { Controller, Post, Body, UnauthorizedException, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { AuthDto } from '../../crosscuting/dtos/auth/auth.dto';
import { ChangePassword } from '../../crosscuting/dtos/auth/changePassword.dto';
import { ok } from 'assert';
import { JwtAuthGuard } from 'src/infrastructure/jwt/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ChangeStatus } from '../../crosscuting/dtos/auth/changeStatus.dto';
import { ResetPassword } from '../../crosscuting/dtos/auth/resetPassword.dto';

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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('changestatus')
  async ChangeStatus(@Body() changeDto: ChangeStatus, @Req() req: any) {
    const userId = req.user.userId as any;
    const data = await this.authService.changeStatus(changeDto, userId);
    if (!data) throw new BadRequestException('Senha atual inválida');
    return { ok };
  }

  @Post('resetpassword')
  async resetPassword(@Body() resetDto: ResetPassword, @Req() req: any) {
    const data = await this.authService.resetPassword(resetDto);
    if (!data) throw new BadRequestException('Senha atual inválida');
    return { ok };
  }
}
