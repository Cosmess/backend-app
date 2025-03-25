import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ProfissionalController } from './controllers/profissional.controller';
import { EstabelecimentoController } from './controllers/estabelecimento.controller';
import { ProfissionalService } from '../application/services/profissional.service';
import { EstabelecimentoService } from '../application/services/estabelecimento.service';
import { ProfissionalRepository } from '../domain/repositories/profissional.repository';
import { EstabelecimentoRepository } from '../domain/repositories/estabelecimento.repository';
import { FirebaseModule } from '../infrastructure/firebase/firebase.module';
import { ToolsController } from './controllers/tools.controller';
import { CroApiService } from 'src/infrastructure/external/cro-api.service';
import { AuthController } from './controllers/auth.controller';
import { GeoLocateService } from 'src/application/services/geolocate.service';
import { EmailService } from 'src/application/services/email.service';
import { EmailController } from './controllers/email.controller';
import { GeolocalizacaoRepository } from 'src/domain/repositories/geolocalizacao.repository';
import { AuthService } from 'src/application/services/auth.service';
import { JwtStrategy } from 'src/infrastructure/jwt/jwt.strategy';
import { JwtAuthGuard } from 'src/infrastructure/jwt/jwt-auth.guard';
import { EspecialidadeRepository } from 'src/domain/repositories/especialidade.repository';
import { EspecialidadeController } from './controllers/especialidades.controller';
import { EspecialidadeService } from 'src/application/services/especialidade.service';
import { AgendaService } from 'src/application/services/agenda.service';
import { AgendaRepository } from 'src/domain/repositories/agenda.repository';
import { AgendaController } from './controllers/agenda.controller';
import { ConviteController } from './controllers/convite.controller';
import { ConviteService } from 'src/application/services/convite.service';
import { ConviteRepository } from 'src/domain/repositories/convite.repository';

@Module({
  imports: [
    FirebaseModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
      }),
    }),
  ],
  controllers: [
    ProfissionalController,
    EstabelecimentoController,
    ToolsController,
    AuthController,
    EmailController,
    EspecialidadeController,
    AgendaController,
    ConviteController
  ],
  providers: [
    ProfissionalService,
    EstabelecimentoService,
    ProfissionalRepository,
    EstabelecimentoRepository,
    CroApiService,
    GeoLocateService,
    EmailService,
    GeolocalizacaoRepository,
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    EspecialidadeRepository,
    EspecialidadeService,
    AgendaService,
    AgendaRepository,
    ConviteService,
    ConviteRepository
  ],
})
export class PresentationModule {}
