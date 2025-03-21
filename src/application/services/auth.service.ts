import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProfissionalService } from './profissional.service';
import { ConsultorioService } from './consultorio.service';
import * as bcrypt from 'bcrypt';
import { AuthDto } from '../../presentation/dtos/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly profissionalService: ProfissionalService,
    private readonly consultorioService: ConsultorioService
  ) {}

  async login(authDto: AuthDto): Promise<{ token: string; user: any }> {
    try {
      const { emailOrPhone, senha, type } = authDto;

      let user;
      if (type === 'profissional') {
        user = await this.profissionalService.findByEmailOrPhone(emailOrPhone);
      } else if (type === 'consultorio') {
        user = await this.consultorioService.findByEmailOrPhone(emailOrPhone);
      } else {
        throw new UnauthorizedException('Tipo de usuário inválido');
      }
      if(!user.emailVerificado){
        throw new UnauthorizedException('email não verificado!');
      }
      if (!user || !(await bcrypt.compare(senha, user.senha))) {
        throw new UnauthorizedException('Credenciais inválidas');
      }
  
      const payload = { sub: user.id, email: user.email, type };
      const token = await this.jwtService.signAsync(payload);
  
      return { token, user };
    } catch (error) {
      console.error(error.message);
      return { token: '', user: null };
    }

  }
}
