import { Controller, Get, Post, Body, Param, Put, Delete, Req, UseGuards, Query } from '@nestjs/common';
import { ConviteService } from '../../application/services/convite.service';
import { CriarConviteDto } from '../dtos/convite/criarConvite.dto';
import { v4 as uuidv4 } from 'uuid';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/infrastructure/jwt/jwt-auth.guard';
import { AlterarStatusConviteDto } from '../dtos/convite/alterarStatusConvite.dto';
import { GetConviteDto } from '../dtos/convite/getConvite.dto';

@Controller('convites')
export class ConviteController {
    constructor(private readonly conviteService: ConviteService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    async create(@Body() conviteDto: CriarConviteDto, @Req() req: any) {
        const userId = req.user.userId as any;
        return this.conviteService.create(conviteDto, userId);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    async findAll(@Query() dto: GetConviteDto, @Req() req: any) {
        const userId = req.user.userId as any;
        return this.conviteService.findByTomadorOrPrestador(userId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Put()
    async update(@Body() dto: AlterarStatusConviteDto, @Req() req: any) {
        const userId = req.user.userId as any;
        return this.conviteService.alterarConvite(userId, dto);
    }


}
