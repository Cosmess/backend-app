import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';
import { PagamentoService } from './pagamento.service';
import { Pagamento } from 'src/domain/entities/pagamento.entity';
import { v4 as uuidv4 } from 'uuid';
import { PlanoRepository } from 'src/domain/repositories/plano.repository';
import * as moment from 'moment-timezone';

@Injectable()
export class MercadoPagoService {
    private mercadopago: MercadoPagoConfig;
    private preference: Preference;
    private payment: Payment;

    constructor(private readonly pagamentoService: PagamentoService,
        private readonly planoRepository : PlanoRepository,
    ) {
        this.mercadopago = new MercadoPagoConfig({
            accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
        });

        this.preference = new Preference(this.mercadopago);
        this.payment = new Payment(this.mercadopago);

    }

    async criarPreferencia(email: string) {
        const plano = await this.planoRepository.findOne();
    
        const response = await this.preference.create({
            body: {
                items: [
                    {
                        title: plano.descricao || 'Assinatura Mensal DentsFreela',
                        quantity: 1,
                        unit_price: plano.valor || 19.99,
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
                    success: 'https://dentsfreela.com.br',
                    failure: 'https://dentsfreela.com.br/termos_condicoes.html',
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
                atualizacao: moment().tz('America/Sao_Paulo').format(),
                pagamentoId: '',
                data: JSON.stringify(response),
            };
            await this.pagamentoService.create(pagamentoData);
        } else {
            pagamentoData!.status = 'criado';
            pagamentoData!.atualizacao = moment().tz('America/Sao_Paulo').format();
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
                    atualizacao: moment().tz('America/Sao_Paulo').format(),
                    pagamentoId: pagamento.id ? String(pagamento.id) : '',
                    data: JSON.stringify(pagamento),
                };
                await this.pagamentoService.create(pagamentoData);
            } else {
                if(pagamentoData!.status !== 'approved') {
                    pagamentoData!.status = pagamento.status;
                }
                pagamentoData!.atualizacao = moment().tz('America/Sao_Paulo').format();
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

