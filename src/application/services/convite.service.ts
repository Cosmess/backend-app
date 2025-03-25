import { Injectable } from '@nestjs/common';
import { ConviteRepository } from '../../domain/repositories/convite.repository';
import { Convite } from '../../domain/entities/convite.entity';
import { v4 as uuidv4 } from 'uuid';
import { CriarConviteDto } from 'src/presentation/dtos/convite/criarConvite.dto';
import { ProfissionalRepository } from 'src/domain/repositories/profissional.repository';
import { AlterarStatusConviteDto } from 'src/presentation/dtos/convite/alterarStatusConvite.dto';
import { AgendaRepository } from 'src/domain/repositories/agenda.repository';
import { GetConviteDto } from 'src/presentation/dtos/convite/getConvite.dto';

@Injectable()
export class ConviteService {
    constructor(private readonly conviteRepository: ConviteRepository,
        private readonly profissionalRepository: ProfissionalRepository,
        private readonly agendaRepository: AgendaRepository
    ) { }

    async create(convite: CriarConviteDto, userId: string): Promise<void> {
        const conviteData: Convite = {
            id: uuidv4(),
            status: 'PENDENTE',
            tomadorId: convite.tomadorId,
            prestadorId: userId,
            agendaId: convite.agendaId,
            mensagem: convite.mensagem,
        }

        await this.conviteRepository.create(conviteData);
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

    async findByTomadorOrPrestador(id: string,dto: GetConviteDto): Promise<any[]> {
        let convites ;
        if(dto.solicitante === 'TOMADOR'){
            convites = await this.conviteRepository.findByTomador(id);

        }else if (dto.solicitante === 'PRESTADOR'){
            convites = await this.conviteRepository.findByPrestador(id);
        }

        const convitesValidos = convites.filter(c => c.prestadorId);
        const idsPrestadores = convitesValidos.map(c => c.prestadorId).filter(id => id !== undefined);
        const convitesAgendas = convites.filter(c => c.agendaId);
        const idsAgendas = convitesAgendas.map(c => c.agendaId).filter(id => id !== undefined);

        const profissionais = await this.profissionalRepository.findByIds(idsPrestadores as string[]);
        const agendas = await this.agendaRepository.findByIds(idsAgendas)

        return convitesValidos.map(convite => {
            const profissional = profissionais.find(p => p.id === convite.prestadorId);
            const agenda = agendas.find(p => p.id === convite.agendaId);
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
                        link: profissional.link,
                        instagram: profissional.instagram,
                        facebook: profissional.facebook,
                        foto: profissional.foto,
                        cep: profissional.cep,
                        comentariosId: profissional.comentariosId,
                        especialidades: profissional.especialidades,
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
                    convite.status = dto.status;
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