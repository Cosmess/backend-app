import { Injectable } from '@nestjs/common';
import { ConsultorioRepository } from '../../domain/repositories/consultorio.repository';
import { Consultorio } from '../../domain/entities/consultorio.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ConsultorioService {
  constructor(private readonly consultorioRepository: ConsultorioRepository) {}

  async create(consultorio: Consultorio): Promise<void> {
    return this.consultorioRepository.create(consultorio);
  }

  async validatePassword(email: string, senha: string): Promise<boolean> {
    const consultorio = await this.consultorioRepository.findByEmail(email);
    if (!consultorio) return false;
    return bcrypt.compare(senha, consultorio.senha);
  }

  async findByEmailOrPhone(emailOrPhone: string): Promise<Consultorio | null> {
    let consultorio = await this.consultorioRepository.findByEmail(emailOrPhone);
    if (!consultorio) {
      consultorio = await this.consultorioRepository.findByPhone(emailOrPhone);
    }
    return consultorio;
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