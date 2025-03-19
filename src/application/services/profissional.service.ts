import { Injectable } from '@nestjs/common';
import { ProfissionalRepository } from '../../domain/repositories/profissional.repository';
import { Profissional } from '../../domain/entities/profissional.entity';

@Injectable()
export class ProfissionalService {
  constructor(private readonly profissionalRepository: ProfissionalRepository) {}

  async create(profissional: Profissional): Promise<void> {
    return this.profissionalRepository.create(profissional);
  }

  async findAll(): Promise<Profissional[]> {
    return this.profissionalRepository.findAll();
  }

  async findById(id: string): Promise<Profissional | null> {
    return this.profissionalRepository.findById(id);
  }

  async update(id: string, data: Partial<Profissional>): Promise<void> {
    return this.profissionalRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.profissionalRepository.delete(id);
  }
}