import { Controller, Get, Post, Body, Param, Put, Delete, Req, UseGuards } from '@nestjs/common';
import { AgendaService } from '../../application/services/agenda.service';
import { CriarAgendaDto } from '../../crosscuting/dtos/agenda/criarAgenda.dto';
import { Agenda } from '../../domain/entities/agenda.entity';
import { v4 as uuidv4 } from 'uuid';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/infrastructure/jwt/jwt-auth.guard';
import { ExcluirAgendaDto } from '../../crosscuting/dtos/agenda/excluirAgenda.dto';

@Controller('agendas')
export class AgendaController {
    constructor(private readonly agendaService: AgendaService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    async create(@Body() agendaDto: CriarAgendaDto, @Req() req: any) {
        const userId = req.user.userId as any;
        return this.agendaService.create(agendaDto, userId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    async findAll(@Req() req: any) {
        const userId = req.user.userId as any;
        return this.agendaService.findAll(userId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete()
    async update(@Body() dto: ExcluirAgendaDto, @Req() req: any) {
        const userId = req.user.userId as any;
        if (!dto.agendaId) {
            throw new Error('Agenda ID is required');
        }
        return this.agendaService.delete(dto.agendaId, userId);
    }

}
