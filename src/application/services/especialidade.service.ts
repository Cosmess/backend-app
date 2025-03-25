import { Injectable } from '@nestjs/common';
import { EspecialidadeRepository } from '../../domain/repositories/especialidade.repository';
import { Especialidade } from '../../domain/entities/especialidade.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EspecialidadeService {
  constructor(private readonly especialidadeRepository: EspecialidadeRepository) {}

  async create(especialidade: Especialidade): Promise<void> {
    return this.especialidadeRepository.create(especialidade);
  }

 
  async findAll(): Promise<Especialidade[]> {
    return this.especialidadeRepository.findAll();
  }

  async update(id: string, data: Partial<Especialidade>): Promise<void> {
    return this.especialidadeRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.especialidadeRepository.delete(id);
  }
}