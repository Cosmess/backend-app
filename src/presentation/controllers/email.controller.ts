
import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from '../../application/services/email.service';
import { EmailDto } from '../dtos/email/email.dto';

@Controller('email')
export class EmailController {
 constructor(private readonly emailService: EmailService) {}
  private codigosVerificacao = new Map<string, string>(); 

  @Post('send-verification')
  async enviarCodigo(@Body() body: EmailDto) {
    await this.emailService.renviarCodigoVerificacao(body.email);
    return { message: 'Código enviado!' };
  }

  @Post('verify-code')
  async verificarCodigo(@Body() body: { email: string; codigo: string }) {
    const codigoCorreto = this.codigosVerificacao.get(body.email);
    if (codigoCorreto === body.codigo) {
      return { message: 'E-mail verificado com sucesso!' };
    }
    throw new Error('Código inválido ou expirado.');
  }
}
