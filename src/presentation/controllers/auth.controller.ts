import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ProfissionalService } from '../../application/services/profissional.service';
import { ConsultorioService } from '../../application/services/consultorio.service';
import { AuthDto } from '../dtos/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly profissionalService: ProfissionalService,
    private readonly consultorioService: ConsultorioService
  ) {}

  @Post('login/profissional')
  async loginProfissional(@Body() authDto: AuthDto) {
    const { emailOrPhone, senha } = authDto;
    const profissional = await this.profissionalService.findByEmailOrPhone(emailOrPhone);

    if (!profissional || !(await this.validatePassword(profissional.senha, senha))) {
      throw new UnauthorizedException('Credenciais inválidas para profissional');
    }

    return { message: 'Login realizado com sucesso', user: { id: profissional.id, email: profissional.email } };
  }

  @Post('login/consultorio')
  async loginConsultorio(@Body() authDto: AuthDto) {
    const { emailOrPhone, senha } = authDto;
    const consultorio = await this.consultorioService.findByEmailOrPhone(emailOrPhone);

    if (!consultorio || !(await this.validatePassword(consultorio.senha, senha))) {
      throw new UnauthorizedException('Credenciais inválidas para consultório');
    }

    return { message: 'Login realizado com sucesso', user: { id: consultorio.id, email: consultorio.email } };
  }

  private async validatePassword(storedPassword: string, inputPassword: string): Promise<boolean> {
    const bcrypt = require('bcrypt');
    return bcrypt.compare(inputPassword, storedPassword);
  }
}