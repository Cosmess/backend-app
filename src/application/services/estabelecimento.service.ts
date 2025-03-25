import { Injectable } from '@nestjs/common';
import { EstabelecimentoRepository } from '../../domain/repositories/estabelecimento.repository';
import { Estabelecimento } from '../../domain/entities/estabelecimento.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EstabelecimentoService {
  constructor(private readonly estabelecimentoRepository: EstabelecimentoRepository) {}

  async create(estabelecimento: Estabelecimento): Promise<void> {
    return this.estabelecimentoRepository.create(estabelecimento);
  }

  async validatePassword(email: string, senha: string): Promise<boolean> {
    const estabelecimento = await this.estabelecimentoRepository.findByEmail(email);
    if (!estabelecimento) return false;
    return bcrypt.compare(senha, estabelecimento.senha);
  }

  async findByEmailOrPhone(emailOrPhone: string): Promise<Estabelecimento | null> {
    let estabelecimento = await this.estabelecimentoRepository.findByEmail(emailOrPhone);
    if (!estabelecimento) {
      estabelecimento = await this.estabelecimentoRepository.findByPhone(emailOrPhone);
    }
    return estabelecimento;
  }
  
  async findAll(): Promise<Estabelecimento[]> {
    return this.estabelecimentoRepository.findAll();
  }

  async findById(id: string): Promise<Estabelecimento | null> {
    return this.estabelecimentoRepository.findById(id);
  }

  async update(id: string, data: Partial<Estabelecimento>): Promise<void> {
    return this.estabelecimentoRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.estabelecimentoRepository.delete(id);
  }
}