import { Controller, Get, Post, Body, Param, Put, Delete, BadRequestException, UseGuards, Req, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProfissionalService } from '../../application/services/profissional.service';
import { ProfissionalDto } from '../dtos/profissional/profissional.dto';
import { Profissional } from '../../domain/entities/profissional.entity';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from 'src/infrastructure/jwt/jwt-auth.guard';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { GetProfissionallDto } from '../dtos/profissional/getProfissional.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from 'multer';

@Controller('profissionais')
export class ProfissionalController {
  constructor(private readonly profissionalService: ProfissionalService) { }

  @Post()
  @UseInterceptors(FileInterceptor('foto'))
  @ApiConsumes('multipart/form-data')
  async create(@UploadedFile() file: File, @Body() profissionalDto: ProfissionalDto) {
    const profissional: Profissional = {
      id: uuidv4(),
      ...profissionalDto,
      status: '',
      paidStatus: true,
      dateLastPayment: new Date(),
      comentariosId: '',
      planoId: '',
      exibirNumero: profissionalDto.exibirNumero,
    };

    const result = await this.profissionalService.create(profissional, file);

    if (!result.status) {
      throw new BadRequestException('Usuário já cadastrado');
    }

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  async findAll(@Query() dto: GetProfissionallDto, @Req() req: any) {
    const userId = req.user.userId as any;
    return this.profissionalService.findAll(dto,userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  async findById(@Param('id') id: string,@Req() req: any) {
    let dataId ;
    dataId = id;
    if (!id) {
      dataId = req.user.userId as any;
    }
    return this.profissionalService.findById(dataId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put(':id')
  @UseInterceptors(FileInterceptor('foto'))
  @ApiConsumes('multipart/form-data')
  async update(@UploadedFile() file: File,@Param('id') id: string, @Body() data: Partial<ProfissionalDto>, @Req() req: any) {
    const userId = req.user.userId as any;
    return this.profissionalService.update(id, data, userId,file);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.profissionalService.delete(id);
  }
}
