import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { PagamentoService } from './pagamento.service';
import { Pagamento } from 'src/domain/entities/pagamento.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MercadoPagoService {
    private mercadopago: MercadoPagoConfig;
    private preference: Preference;
    private payment: Payment;

    constructor(private readonly pagamentoService: PagamentoService) {
        this.mercadopago = new MercadoPagoConfig({
            accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
        });

        this.preference = new Preference(this.mercadopago);
        this.payment = new Payment(this.mercadopago); // ✅ instância separada

    }

    async criarPreferencia(email: string) {
        const response = await this.preference.create({
            body: {
                items: [
                    {
                        title: 'Assinatura DentsFreela',
                        quantity: 1,
                        unit_price: 0.9,
                        id: ''
                    },
                ],
                payer: {
                    email,
                },
                metadata: {
                    email,
                },
                back_urls: {
                    success: 'https://seusite.com.br/sucesso',
                    failure: 'http://localhost:53364',
                },
                auto_return: 'approved',
            },
        });

        const pagamentoData = await this.pagamentoService.findByEmail(email);
        if (!pagamentoData) {
            console.error('❌ Pagamento não encontrado no banco de dados:', email);
            const pagamentoData: Pagamento = {
                id: uuidv4(),
                email: email,
                status: 'criado',
                atualizacao: '',
                pagamentoId: '',
                data: JSON.stringify(response),
            };
            await this.pagamentoService.create(pagamentoData);
        } else {
            pagamentoData!.status = 'criado';
            pagamentoData!.atualizacao = new Date().toISOString();
            this.pagamentoService.update(pagamentoData!.id, pagamentoData!);
        }
        console.log('💳 Pagamento criado:', response.init_point);
        return response;
    }

    async tratarPagamentoPendente(paymentId: string) {
        try {
            const pagamento = await this.payment.get({ id: paymentId });
            const email = pagamento.metadata.email;
            const pagamentoData = await this.pagamentoService.findByEmail(email);
            console.log(`⏳ Status Pagamento:', ${pagamento.id} - ${pagamento.status}`);
            if (!pagamentoData) {
                console.error('❌ Pagamento não encontrado no banco de dados:', email);
                const pagamentoData: Pagamento = {
                    id: uuidv4(),
                    email: email,
                    status: pagamento.status,
                    atualizacao: '',
                    pagamentoId: pagamento.id ? String(pagamento.id) : '',
                    data: JSON.stringify(pagamento),
                };
                await this.pagamentoService.create(pagamentoData);
            } else {
                pagamentoData!.status = pagamento.status;
                pagamentoData!.atualizacao = new Date().toISOString();
                pagamentoData!.data = JSON.stringify(pagamento);
                this.pagamentoService.update(pagamentoData!.id, pagamentoData!);
            }

            if (pagamento.status === 'approved') {
                console.log('✅ Pagamento aprovado:', pagamento.id);

                this.pagamentoService.setPaymentStatus(email);
                console.log('✅ Status de pagamento atualizado para aprovado:', email);
            }

        } catch (error) {
            console.error('❌ Erro ao buscar pagamento pendente:', error);
        }
    }
}

