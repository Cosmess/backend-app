import { Injectable } from '@nestjs/common';
import { ConviteRepository } from '../../domain/repositories/convite.repository';
import { Convite } from '../../domain/entities/convite.entity';
import { v4 as uuidv4 } from 'uuid';
import { CriarConviteDto } from 'src/crosscuting/dtos/convite/criarConvite.dto';
import { ProfissionalRepository } from 'src/domain/repositories/profissional.repository';
import { AlterarStatusConviteDto } from 'src/crosscuting/dtos/convite/alterarStatusConvite.dto';
import { AgendaRepository } from 'src/domain/repositories/agenda.repository';
import { GetConviteDto } from 'src/crosscuting/dtos/convite/getConvite.dto';
import { Estabelecimento } from 'src/domain/entities/estabelecimento.entity';
import { EstabelecimentoRepository } from 'src/domain/repositories/estabelecimento.repository';
import * as moment from 'moment-timezone';
import { SucessDto } from 'src/crosscuting/dtos/success.dto';

@Injectable()
export class ConviteService {
    constructor(private readonly conviteRepository: ConviteRepository,
        private readonly profissionalRepository: ProfissionalRepository,
        private readonly agendaRepository: AgendaRepository,
        private readonly estabelecimentoRepository: EstabelecimentoRepository
    ) { }

    async create(convite: CriarConviteDto, userId: string): Promise<SucessDto> {
        try {

            const conviteExistente = await this.conviteRepository.findByPrestadorAndAgendaId(userId, convite.agendaId);
            if(conviteExistente) {
            return new SucessDto(false, 'Você já enviou um convite para este horário.');             
            }

            if (!convite.horario) {
            convite.horario = new Date;
            }
            const horarioOriginal = new Date(convite.horario);
            const horarioZerado = moment(horarioOriginal)
            .tz('America/Sao_Paulo')
            .startOf('hour')
            .toDate(); // retorna como objeto Date
            const conviteData: Convite = {
            id: uuidv4(),
            status: 'PENDENTE',
            tomadorId: convite.tomadorId,
            prestadorId: userId,
            agendaId: convite.agendaId,
            mensagem: convite.mensagem,
            horario: horarioZerado.toISOString(),
            }

            await this.conviteRepository.create(conviteData);
            return new SucessDto(true, 'Envio de convite realizado com sucesso!');             
        } catch (error) {
            console.error('Error creating convite:', error);
            return new SucessDto(false, 'Erro ao criar convite.');
        }
    }

    async findAll(): Promise<Convite[]> {
        return this.conviteRepository.findAll();
    }

    async update(id: string, data: Partial<Convite>): Promise<void> {
        return this.conviteRepository.update(id, data);
    }

    async delete(id: string): Promise<void> {
        return this.conviteRepository.delete(id);
    }

    async findByTomadorOrPrestador(id: string, dto: GetConviteDto): Promise<any[]> {
        let convites;
        let Isprestador: Boolean = false;
        if (dto.solicitante === 'TOMADOR') {
            convites = await this.conviteRepository.findByTomador(id);

        } else if (dto.solicitante === 'PRESTADOR') {
            convites = await this.conviteRepository.findByPrestador(id);
            Isprestador = true;
        }

        if (convites === undefined || convites.length === 0) {
            return [];
        }
        // Filtra os convites que possuem prestadorId e agendaId definidos
        const convitesValidos = convites.filter(c => c.prestadorId);
        const idsPrestadores = convitesValidos.map(c => c.prestadorId).filter(id => id !== undefined);
        const idsTomadores = convitesValidos.map(c => c.tomadorId).filter(id => id !== undefined);
        const convitesAgendas = convites.filter(c => c.agendaId);
        const idsAgendas = convitesAgendas.map(c => c.agendaId).filter(id => id !== undefined);
        const agendas = await this.agendaRepository.findByIds(idsAgendas)
        let profissionais: any[] = [];

        profissionais = await this.profissionalRepository.findByIds(idsPrestadores as string[]);
        if (profissionais.length === 0) {
            let profissionais: any[] = [];
            if (Isprestador) {
                profissionais = await this.profissionalRepository.findByIds(idsTomadores as string[]);
            } else {
                profissionais = await this.estabelecimentoRepository.findByIds(idsPrestadores as string[]);
            }
            return convitesValidos.map(convite => {
                let profissional = profissionais.find(p => p.id === convite.prestadorId);

                if (Isprestador) {
                    profissional = profissionais.find(p => p.id === convite.tomadorId);
                }

                
                const agenda = agendas.find(p => p.id === convite.agendaId);
                if(!agenda){
                    convite.status = 'AGENDA CANCELADA'
                }
                return {
                    convite: convite,
                    agenda: agenda,
                    profissional: profissional
                        ? {
                            nome: profissional.nome,
                            descricao: profissional.descricao,
                            cidade: profissional.cidade,
                            estado: profissional.estado,
                            cro: profissional.cro,
                            celular: profissional.celular,
                            link: profissional.link,
                            instagram: profissional.instagram,
                            foto: profissional.foto,
                            cep: profissional.cep,
                            comentariosId: profissional.comentariosId,
                            especialidades: profissional.especialidades,
                            idProfissional: profissional.id,
                        }
                        : null,
                };
            });
        }

        if (Isprestador) {
            profissionais = await this.estabelecimentoRepository.findByIds(idsTomadores as string[]);
        } else {
            profissionais = await this.profissionalRepository.findByIds(idsPrestadores as string[]);
        }
        return convitesValidos.map(convite => {
            let profissional = profissionais.find(p => p.id === convite.prestadorId);
            if (Isprestador) {
                profissional = profissionais.find(p => p.id === convite.tomadorId);
            }

            const agenda = agendas.find(p => p.id === convite.agendaId);
            if(!agenda){
                convite.status = 'AGENDA CANCELADA'
            }
            return {
                convite: convite,
                agenda: agenda,
                profissional: profissional
                    ? {
                        nome: profissional.nome,
                        descricao: profissional.descricao,
                        cidade: profissional.cidade,
                        estado: profissional.estado,
                        cro: profissional.cro,
                        celular: profissional.celular,
                        link: profissional.link,
                        instagram: profissional.instagram,
                        foto: profissional.foto,
                        cep: profissional.cep,
                        comentariosId: profissional.comentariosId,
                        especialidades: profissional.especialidades,
                        idProfissional: profissional.id,

                    }
                    : null,
            };
        });
    }

    async alterarConvite(userId: string, dto: AlterarStatusConviteDto): Promise<void> {
        if (dto.conviteId) {
            let convite = await this.conviteRepository.findByIdAndTomador(dto.conviteId, userId);
            if (convite) {
                if (convite) {
                    if (userId !== convite.tomadorId) {
                        throw new Error('Você não tem permissão para alterar este convite.');
                    }
                    convite.status = dto.status;
                    if (dto.status === 'ACEITO') {
                        const agenda = await this.agendaRepository.findById(convite.agendaId || 'null');
                        if (agenda) {
                            agenda.status = 'AGENDADO';
                            await this.agendaRepository.update(agenda.id, agenda);
                        }
                    }
                    if(dto.status === 'RECUSADO'){
                        const agenda = await this.agendaRepository.findById(convite.agendaId || 'null');
                        if (agenda) {
                            agenda.status = 'ABERTO';
                            await this.agendaRepository.update(agenda.id, agenda);
                        }
                    }
                    return this.conviteRepository.update(convite.id, convite);
                }
            } else {
                convite = await this.conviteRepository.findByIdAndPrestador(dto.conviteId, userId);
                if (convite) {
                    convite.status = dto.status;
                    return this.conviteRepository.update(convite.id, convite);
                }
            }
        }
    }

    async findByHorario(horario: string[]): Promise<Convite[]> {
        return this.conviteRepository.findByHorario(horario);
    }
}