import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { EstabelecimentoService } from '../../application/services/estabelecimento.service';
import { EstabelecimentoDto } from '../dtos/estabelecimento/estabelecimento.dto';
import { Estabelecimento } from '../../domain/entities/estabelecimento.entity';
import { v4 as uuidv4 } from 'uuid';

@Controller('estabelecimentos')
export class EstabelecimentoController {
  constructor(private readonly estabelecimentoService: EstabelecimentoService) {}

  @Post()
  async create(@Body() estabelecimentoDto: EstabelecimentoDto) {
    const estabelecimento: Estabelecimento = {
      id: uuidv4(),
      ...estabelecimentoDto,
      facebook: '',
      instagram: '',
      link: '',
      status: '',
      paidStatus: false,
      dateLastPayment: new Date(),
      especialidadeId: '',
      comentariosId: '',
      planoId: '',
    };

    return this.estabelecimentoService.create(estabelecimento);
  }

  @Get()
  async findAll() {
    return this.estabelecimentoService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.estabelecimentoService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<EstabelecimentoDto>) {
    return this.estabelecimentoService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.estabelecimentoService.delete(id);
  }
}
