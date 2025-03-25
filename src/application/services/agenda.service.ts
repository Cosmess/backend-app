import { Injectable } from '@nestjs/common';
import { AgendaRepository } from '../../domain/repositories/agenda.repository';
import { Agenda } from '../../domain/entities/agenda.entity';
import { v4 as uuidv4 } from 'uuid';
import { CriarAgendaDto } from 'src/presentation/dtos/agenda/criarAgenda.dto';

@Injectable()
export class AgendaService {
  constructor(private readonly agendaRepository: AgendaRepository) {}

  async create(agenda: CriarAgendaDto, userId: string): Promise<void> {
    if (!agenda.horarios?.length) return;
  
    for (const horario of agenda.horarios) {
      const item: Agenda = {
        id: uuidv4(),
        horario: horario,
        status: 'ABERTO',
        tomadorId: userId,
        prestadorId: '',
        prestadorCheck: '',
        tomadorCheck: '',
        tomadorAceite: ''        
      };
  
      await this.agendaRepository.create(item);
    }
  }

  async findAll(): Promise<Agenda[]> {
    return this.agendaRepository.findAll();
  }

  async update(id: string, data: Partial<Agenda>): Promise<void> {
    return this.agendaRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.agendaRepository.delete(id);
  }

  async findByTomador(id: string): Promise<Agenda[]> {
    return this.agendaRepository.findByTomador(id);
  }

  async findByHorario(horario: string[]): Promise<Agenda[]> {
    return this.agendaRepository.findByHorario(horario);
}
}