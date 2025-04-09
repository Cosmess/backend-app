import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProfissionalService } from './profissional.service';
import { EstabelecimentoService } from './estabelecimento.service';
import * as bcrypt from 'bcrypt';
import { AuthDto } from '../../presentation/dtos/auth/auth.dto';
import { ChangePassword } from 'src/presentation/dtos/auth/changePassword.dto';
import { ProfissionalRepository } from 'src/domain/repositories/profissional.repository';
import { EstabelecimentoRepository } from 'src/domain/repositories/estabelecimento.repository';
import { ChangeStatus } from 'src/presentation/dtos/auth/changeStatus.dto';
import { ResetPassword } from 'src/presentation/dtos/auth/resetPassword.dto';
import { EmailService } from './email.service';
import { PagamentoService } from './pagamento.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly profissionalService: ProfissionalService,
    private readonly estabelecimentoService: EstabelecimentoService,
    private readonly profissionalRepository: ProfissionalRepository,
    private readonly estabelecimentoRepository: EstabelecimentoRepository,
    private readonly emailService: EmailService,
    private readonly pagamentoService: PagamentoService,
  ) { }

  async login(authDto: AuthDto): Promise<{ token: string; payload: any }> {
    try {
      const { emailOrPhone, senha, type } = authDto;

      let user;
      if (type === 'profissional') {
        user = await this.profissionalService.findByEmailOrPhone(emailOrPhone);
      } else if (type === 'estabelecimento') {
        user = await this.estabelecimentoService.findByEmailOrPhone(emailOrPhone);
      } else {
        throw new UnauthorizedException('Credenciais inválidas');
      }
      if (!user) {
        throw new UnauthorizedException('Credenciais inválidas!');
      }
      if (!user.emailVerificado) {
        throw new UnauthorizedException('email não verificado!');
      }
      if (user.status === 'INATIVO') {
        throw new UnauthorizedException('Usuario Bloqueado!');
      }
      if(user.paidStatus === false) {
        const pagamento = await this.pagamentoService.findByEmail(emailOrPhone);
        if(!pagamento) {
          throw new UnauthorizedException('Usuario sem pagamento!');
        }
        if(pagamento.status !== 'approved') {
          throw new UnauthorizedException('Usuario sem pagamento!');
        }
        if(pagamento.status === 'approved') {
          await this.pagamentoService.setPaymentStatus(emailOrPhone);
        }        
      }
      if (!user || !(await bcrypt.compare(senha, user.senha))) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      const payload = { sub: user.id, email: user.email, type };
      const token = await this.jwtService.signAsync(payload);

      return { token, payload };
    } catch (error) {
      console.error(error.message);
      return { token: '', payload: null };
    }

  }

  async updatePassword(authDto: ChangePassword, userId: string): Promise<any> {
    try {

      let user;
      if (authDto.type === 'profissional') {
        user = await this.profissionalRepository.findById(userId);
      } else if (authDto.type === 'estabelecimento') {
        user = await this.estabelecimentoRepository.findById(userId);
      } else {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      if (!user) {
        throw new UnauthorizedException('Credenciais inválidas!');
      }

      if (!user || !(await bcrypt.compare(authDto.oldPassword, user.senha))) {
        throw new UnauthorizedException('Senha Atual Invalida');
      }


      const salt = await bcrypt.genSalt(10);
      user.senha = await bcrypt.hash(authDto.newPassword, salt);

      if (authDto.type === 'profissional') {
        await this.profissionalRepository.update(userId, user);
      } else {
        await this.estabelecimentoRepository.update(userId, user)
      }

      return { succes: true };
    } catch (error) {
      console.error(error.message);
      throw new UnauthorizedException('Credenciais inválidas!');
    }
  }

  async changeStatus(authDto: ChangeStatus, userId: string): Promise<any> {
    try {
      let user;
      if (authDto.type === 'profissional') {
        user = await this.profissionalRepository.findById(userId);
      } else if (authDto.type === 'estabelecimento') {
        user = await this.estabelecimentoRepository.findById(userId);
      } else {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      if (!user) {
        throw new UnauthorizedException('Credenciais inválidas!');
      }

      user.status = authDto.status;

      if (authDto.type === 'profissional') {
        await this.profissionalRepository.update(userId, user);
      } else {
        await this.estabelecimentoRepository.update(userId, user)
      }

      return { succes: true };
    } catch (error) {
      console.error(error.message);
      throw new UnauthorizedException('Credenciais inválidas!');
    }
  }

  async resetPassword(authDto: ResetPassword): Promise<boolean> {
    try {
      const codigoCorreto = await this.emailService.verificarCodigo(authDto.email, authDto.codigo);
      if(!codigoCorreto) {
        return false
      }

      let user: any
      let isProfissional = true;
      user = await this.profissionalRepository.findByEmail(authDto.email);
  
      if (!user) {
          user = await this.estabelecimentoRepository.findByEmail(authDto.email);
          isProfissional = false;
      }
      if (!user) {
          false
      }

      const salt = await bcrypt.genSalt(10);
      user.senha = await bcrypt.hash(authDto.newPassword, salt);
      user.codigo = '';

      if (isProfissional) {
        await this.profissionalRepository.update(user.id, user);
      } else {
        await this.estabelecimentoRepository.update(user, user)
      }

      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  }
}
