import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ConsultorioService } from '../../application/services/consultorio.service';
import { ConsultorioDto } from '../dtos/consultorio.dto';
import { Consultorio } from '../../domain/entities/consultorio.entity';
import { v4 as uuidv4 } from 'uuid';

@Controller('consultorios')
export class ConsultorioController {
  constructor(private readonly consultorioService: ConsultorioService) {}

  @Post()
  async create(@Body() consultorioDto: ConsultorioDto) {
    const consultorio: Consultorio = {
      id: uuidv4(),
      ...consultorioDto,
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

    return this.consultorioService.create(consultorio);
  }

  @Get()
  async findAll() {
    return this.consultorioService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.consultorioService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<ConsultorioDto>) {
    return this.consultorioService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.consultorioService.delete(id);
  }
}
