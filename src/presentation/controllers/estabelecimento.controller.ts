import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile, UseGuards, Req, Query, BadRequestException } from '@nestjs/common';
import { EstabelecimentoService } from '../../application/services/estabelecimento.service';
import { EstabelecimentoDto } from '../dtos/estabelecimento/estabelecimento.dto';
import { Estabelecimento } from '../../domain/entities/estabelecimento.entity';
import { v4 as uuidv4 } from 'uuid';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/infrastructure/jwt/jwt-auth.guard';
import { query } from 'express';
import { GetEstabelecimentoDto } from '../dtos/estabelecimento/getEstabelecimento.dto';

@Controller('estabelecimentos')
export class EstabelecimentoController {
  constructor(private readonly estabelecimentoService: EstabelecimentoService) { }

  @Post()
  @UseInterceptors(FileInterceptor('foto'))
  @ApiConsumes('multipart/form-data')
  async create(@UploadedFile() file: File, @Body() estabelecimentoDto: EstabelecimentoDto) {
    const estabelecimento: Estabelecimento = {
      id: uuidv4(),
      ...estabelecimentoDto,
      facebook: '',
      instagram: '',
      link: '',
      status: '',
      paidStatus: false,
      dateLastPayment: new Date(),
      especialidades: estabelecimentoDto.especialidades,
      comentariosId: '',
      planoId: '',
      exibirNumero: estabelecimentoDto.exibirNumero,
      telefoneVerificado: false,
    };

    const result = await this.estabelecimentoService.create(estabelecimento, file);
    if (!result.status) {
      throw new BadRequestException('Usuário já cadastrado');
    }

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Query() dto: GetEstabelecimentoDto, @Req() req: any) {
    const userId = req.user.userId as any;
    return this.estabelecimentoService.findAll(dto, userId);
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
