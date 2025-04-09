// src/modules/pagamento/pagamento.controller.ts
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { MercadoPagoService } from '../../application/services/mercado-pago.service';
import { PagamentoDto } from '../dtos/pagamento/pagamento.dto';

@Controller('pagamento')
export class PagamentoController {
  constructor(private readonly mercadoPagoService: MercadoPagoService) { }

  @Post('checkout')
  async criarCheckout(@Body() body: PagamentoDto) {
    const preferencia = await this.mercadoPagoService.criarPreferencia(body.email);
    return { url: preferencia.init_point };
  }

  @Post('webhook')
  @HttpCode(200)
  async receberWebhook(@Body() body: any) {
    console.log('📩 Webhook recebido:', JSON.stringify(body));

    if (body) {
      const tipo = body.type;
      const id = body.data?.id;

      if (tipo === 'payment' && id) {
        await this.mercadoPagoService.tratarPagamentoPendente(id);
      }
    }

    return { received: true };
  }
}
