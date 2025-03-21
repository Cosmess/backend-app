import { Controller, Get, Post, Body, Param, Put, Delete, BadRequestException, UseGuards } from '@nestjs/common';
import { ProfissionalService } from '../../application/services/profissional.service';
import { ProfissionalDto } from '../dtos/profissional.dto';
import { Profissional } from '../../domain/entities/profissional.entity';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from 'src/infrastructure/jwt/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('profissionais')
export class ProfissionalController {
  constructor(private readonly profissionalService: ProfissionalService) { }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() 
  @Post()
  async create(@Body() profissionalDto: ProfissionalDto) {
    const profissional: Profissional = {
      id: uuidv4(),
      ...profissionalDto,
      facebook: '',
      instagram: '',
      link: '',
      status: '',
      paidStatus: false,
      dateLastPayment: new Date(),
      especialidadeId: '',
      comentariosId: '',
      planoId: '',
      exibirNumero: profissionalDto.exibirNumero,
    };
    const result = await this.profissionalService.create(profissional);
    if (!result.status) {
      throw new BadRequestException('Usuário já cadastrado');
    }
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() 
  @Get()
  async findAll() {
    return this.profissionalService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.profissionalService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<ProfissionalDto>) {
    return this.profissionalService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.profissionalService.delete(id);
  }
}
