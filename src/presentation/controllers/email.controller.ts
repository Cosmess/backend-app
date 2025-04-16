
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { EmailService } from '../../application/services/email.service';
import { EmailDto } from '../../crosscuting/dtos/email/email.dto';
import { VerificacaoEmailDto } from '../../crosscuting/dtos/email/verificacaoEmail.dto';

@Controller('email')
export class EmailController {
 constructor(private readonly emailService: EmailService) {}
  private codigosVerificacao = new Map<string, string>(); 

  @Post('send-verification')
  async enviarCodigo(@Body() body: EmailDto) {
    const result = await this.emailService.renviarCodigoVerificacao(body.email);
    if(!result.success){
      throw new BadRequestException('Email invalido ou não existe!');
    }
    return { message: 'Código enviado!' };
  }

  @Post('verify-code')
  async verificarCodigo(@Body() body: VerificacaoEmailDto) {
    const codigoCorreto = await this.emailService.verificarCodigo(body.email, body.codigo);
    if (codigoCorreto) {
      return { message: 'E-mail verificado com sucesso!' };
    }
    throw new BadRequestException('Código inválido ou expirado.');
  }
}
