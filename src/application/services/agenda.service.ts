import { Injectable } from '@nestjs/common';
import { AgendaRepository } from '../../domain/repositories/agenda.repository';
import { Agenda } from '../../domain/entities/agenda.entity';
import { v4 as uuidv4 } from 'uuid';
import { CriarAgendaDto } from 'src/crosscuting/dtos/agenda/criarAgenda.dto';
import * as moment from 'moment-timezone';

@Injectable()
export class AgendaService {
  constructor(private readonly agendaRepository: AgendaRepository) {}

  async create(agenda: CriarAgendaDto, userId: string): Promise<void> {
    if (!agenda.horarios?.length) return;
  
    for (const horario of agenda.horarios) {
      const horarioOriginal = new Date(horario);
      const horarioZerado = moment(horarioOriginal)
      .tz('America/Sao_Paulo')
      .startOf('hour')
      .toDate(); // retorna como objeto Date
    
      const item: Agenda = {
        id: uuidv4(),
        horario:  horarioZerado.toISOString(),
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

  async findAll(id: string): Promise<Agenda[]> {
    return this.agendaRepository.findAll(id);
  }

  async update(id: string, data: Partial<Agenda>): Promise<void> {
    return this.agendaRepository.update(id, data);
  }

  async delete(id: string,userId: string): Promise<void> {
    return this.agendaRepository.delete(id, userId);
  }

  async findByTomador(id: string): Promise<Agenda[]> {
    return this.agendaRepository.findByTomador(id);
  }

  async findByHorario(horario: string[]): Promise<Agenda[]> {
    return this.agendaRepository.findByHorario(horario);
}
}