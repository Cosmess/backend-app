import { Injectable, UseGuards } from '@nestjs/common';
import { PagamentoRepository } from '../../domain/repositories/paamento.repository';
import { Pagamento } from '../../domain/entities/pagamento.entity';
import { ProfissionalRepository } from 'src/domain/repositories/profissional.repository';
import { EstabelecimentoRepository } from 'src/domain/repositories/estabelecimento.repository';
import moment from 'moment';

@Injectable()
export class PagamentoService {
    constructor(private readonly pagamentoRepository: PagamentoRepository,
        private readonly profissionalRepository: ProfissionalRepository,
        private readonly estabelecimentoRepository: EstabelecimentoRepository,
    ) { }

    async create(pagamento: Pagamento): Promise<void> {
        return this.pagamentoRepository.create(pagamento);
    }

    async findByEmail(emailOrPhone: string): Promise<Pagamento | null> {
        let pagamento = await this.pagamentoRepository.findByEmail(emailOrPhone);
        return pagamento;
    }

    async findAll(): Promise<Pagamento[]> {
        return this.pagamentoRepository.findAll();
    }

    async update(id: string, data: Partial<Pagamento>): Promise<void> {
        return this.pagamentoRepository.update(id, data);
    }

    async delete(id: string): Promise<void> {
        return this.pagamentoRepository.delete(id);
    }

    async setPaymentStatus(email: string): Promise<void> {
        let usuario = await this.profissionalRepository.findByEmail(email);
        let estabelecimento : any = null;
        if (usuario) {
            usuario.paidStatus = true;
            usuario.dateLastPayment = moment(new Date())
                .tz('America/Sao_Paulo')
                .startOf('hour')
                .toDate();
            await this.profissionalRepository.update(usuario.id, usuario);
        }
        else if (!usuario) {
            estabelecimento = await this.estabelecimentoRepository.findByEmail(email);
            if (estabelecimento) {
                estabelecimento.paidStatus = true;
                estabelecimento.dateLastPayment = moment(new Date())
                    .tz('America/Sao_Paulo')
                    .startOf('hour')
                    .toDate();
                await this.estabelecimentoRepository.update(estabelecimento.id, estabelecimento);
            }
        }
        else if (!usuario || !estabelecimento) {
            return;
        }
    }
}