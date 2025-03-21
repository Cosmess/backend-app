import { BadRequestException, Injectable } from '@nestjs/common';
import { ProfissionalRepository } from '../../domain/repositories/profissional.repository';
import { Profissional } from '../../domain/entities/profissional.entity';
import * as bcrypt from 'bcrypt';
import { CroApiService } from 'src/infrastructure/external/cro-api.service';
import { SucessDto } from 'src/presentation/dtos/success.dto';
import { EmailService } from './email.service';
import { GeoLocateService } from './geolocate.service';
import { Geolocalizacao } from 'src/domain/entities/geolocalizacao.entity';
import { v4 as uuidv4 } from 'uuid';
import { GeolocalizacaoRepository } from 'src/domain/repositories/geolocalizacao.repository';

@Injectable()
export class ProfissionalService {
    constructor(private readonly profissionalRepository: ProfissionalRepository,
        private readonly croApiService: CroApiService,
        private readonly emailService: EmailService,
        private readonly geoService: GeoLocateService,
        private readonly geolocalizacaoRepository: GeolocalizacaoRepository

    ) { }

    async create(profissional: Profissional): Promise<SucessDto> {
        try {
            const profissionalExists = await this.profissionalRepository.findByCro(profissional.cro);
            if(profissionalExists){
                return new SucessDto(false, 'Usuário já cadastrado');
            }
            const codigo = await this.emailService.enviarCodigoVerificacao(profissional.email);
            profissional.codigo = codigo;
        
            const geolocalizacaoExists = await this.geolocalizacaoRepository.findByCep(profissional.cep);
            if(!geolocalizacaoExists){
                const coordenadas = await this.geoService.obterLatLngPorCep(profissional.cep);
                if (!coordenadas) {
                    throw new Error('Falha ao obter coordenadas');
                }

                const geolocalizacao: Geolocalizacao = {
                    id: uuidv4(),
                    lat: coordenadas.lat,
                    lng: coordenadas.lng,
                    cep: profissional.cep           
                }

                await this.geolocalizacaoRepository.create(geolocalizacao);
            }


            const croValidate = await this.croApiService.buscarPorNumeroRegistro(profissional.cro);
            if (!croValidate) {
                profissional.status = 'PENDENTE';
            } else if (croValidate.situacao === 'ATIVO') {
                profissional.status = 'ATIVO';
            } else {
                profissional.status = croValidate.situacao;
            }

            const salt = await bcrypt.genSalt(10);
            profissional.senha = await bcrypt.hash(profissional.senha, salt);

            await this.profissionalRepository.create(profissional);


            setTimeout(() => {
                this.profissionalRepository.update(profissional.id, { codigo: '' });
            }, 10_000);

            return new SucessDto(true, 'Codigo de verificação enviado por email');
        } catch (error) {
            console.error(error.message)
            return new SucessDto(false, error.message);
        }
    }

    async validatePassword(email: string, senha: string): Promise<boolean> {
        const profissional = await this.profissionalRepository.findByEmail(email);
        if (!profissional) return false;
        return bcrypt.compare(senha, profissional.senha);
    }

    async findByEmailOrPhone(emailOrPhone: string): Promise<Profissional | null> {
        let profissional = await this.profissionalRepository.findByEmail(emailOrPhone);
        if (!profissional) {
            profissional = await this.profissionalRepository.findByPhone(emailOrPhone);
        }
        return profissional;
    }

    async findAll(): Promise<Profissional[]> {
        return this.profissionalRepository.findAll();
    }

    async findById(id: string): Promise<Profissional | null> {
        return this.profissionalRepository.findById(id);
    }

    async update(id: string, data: Partial<Profissional>): Promise<void> {
        return this.profissionalRepository.update(id, data);
    }

    async delete(id: string): Promise<void> {
        return this.profissionalRepository.delete(id);
    }
}
