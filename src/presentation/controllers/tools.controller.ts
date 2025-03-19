import { Controller, Get, Param } from '@nestjs/common';
import { CroApiService } from '../../infrastructure/external/cro-api.service';

@Controller('tools')
export class ToolsController {
  constructor(private readonly croApiService: CroApiService) {}

  @Get('cro/:numeroRegistro')
  async consultarCro(@Param('numeroRegistro') numeroRegistro: string) {
    return this.croApiService.buscarPorNumeroRegistro(numeroRegistro);
  }
}
