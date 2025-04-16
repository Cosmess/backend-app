import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { EspecialidadeService } from '../../application/services/especialidade.service';
import { EspecialidadeDto } from '../../crosscuting/dtos/especialidade/especialidade.dto';
import { Especialidade } from '../../domain/entities/especialidade.entity';
import { v4 as uuidv4 } from 'uuid';

@Controller('especialidades')
export class EspecialidadeController {
  constructor(private readonly especialidadeService: EspecialidadeService) {}

  @Post()
  async create(@Body() especialidadeDto: EspecialidadeDto) {
    const especialidade: Especialidade = {
      id: uuidv4(),
      ...especialidadeDto
    };

    return this.especialidadeService.create(especialidade);
  }

  @Get()
  async findAll() {
    return this.especialidadeService.findAll();
  }

}
