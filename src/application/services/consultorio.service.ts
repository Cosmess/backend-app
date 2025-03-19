import { Injectable } from '@nestjs/common';
import { ConsultorioRepository } from '../../domain/repositories/consultorio.repository';
import { Consultorio } from '../../domain/entities/consultorio.entity';

@Injectable()
export class ConsultorioService {
  constructor(private readonly consultorioRepository: ConsultorioRepository) {}

  async create(consultorio: Consultorio): Promise<void> {
    return this.consultorioRepository.create(consultorio);
  }

  async findAll(): Promise<Consultorio[]> {
    return this.consultorioRepository.findAll();
  }

  async findById(id: string): Promise<Consultorio | null> {
    return this.consultorioRepository.findById(id);
  }

  async update(id: string, data: Partial<Consultorio>): Promise<void> {
    return this.consultorioRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.consultorioRepository.delete(id);
  }
}