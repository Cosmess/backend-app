import { Module } from '@nestjs/common';
import { ProfissionalController } from './controllers/profissional.controller';
import { ConsultorioController } from './controllers/consultorio.controller';
import { ProfissionalService } from '../application/services/profissional.service';
import { ConsultorioService } from '../application/services/consultorio.service';
import { ProfissionalRepository } from '../domain/repositories/profissional.repository';
import { ConsultorioRepository } from '../domain/repositories/consultorio.repository';
import { FirebaseModule } from '../infrastructure/firebase/firebase.module'; // ✅ Importar o FirebaseModule
import { ToolsController } from './controllers/tools.controller';
import { CroApiService } from 'src/infrastructure/external/cro-api.service';

@Module({
  imports: [FirebaseModule],
  controllers: [ProfissionalController, ConsultorioController,ToolsController],
  providers: [ProfissionalService, ConsultorioService, ProfissionalRepository, ConsultorioRepository,CroApiService],
})
export class PresentationModule {}
