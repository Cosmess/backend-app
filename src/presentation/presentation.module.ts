import { Module } from '@nestjs/common';
import { ProfissionalController } from './controllers/profissional.controller';
import { ConsultorioController } from './controllers/consultorio.controller';
import { ProfissionalService } from '../application/services/profissional.service';
import { ConsultorioService } from '../application/services/consultorio.service';
import { ProfissionalRepository } from '../domain/repositories/profissional.repository';
import { ConsultorioRepository } from '../domain/repositories/consultorio.repository';
import { FirebaseModule } from '../infrastructure/firebase/firebase.module';
import { ToolsController } from './controllers/tools.controller';
import { CroApiService } from 'src/infrastructure/external/cro-api.service';
import { AuthController } from './controllers/auth.controller';
import { GeoLocateService } from 'src/application/services/geolocate.service';
import { EmailService } from 'src/application/services/email.service';
import { EmailController } from './controllers/email.controller';
import { GeolocalizacaoRepository } from 'src/domain/repositories/geolocalizacao.repository';

@Module({
  imports: [FirebaseModule],
  controllers: [ProfissionalController, ConsultorioController, ToolsController, AuthController, EmailController],
  providers: [ProfissionalService,
    ConsultorioService,
    ProfissionalRepository,
    ConsultorioRepository,
    CroApiService,
    GeoLocateService,
    EmailService,
    GeolocalizacaoRepository],
})
export class PresentationModule { }
