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
import { GetProfissionallDto } from 'src/presentation/dtos/profissional/getProfissional.dto';
import { AgendaRepository } from 'src/domain/repositories/agenda.repository';
import { AgendaService } from './agenda.service';

@Injectable()
export class ProfissionalService {
    constructor(private readonly profissionalRepository: ProfissionalRepository,
        private readonly croApiService: CroApiService,
        private readonly emailService: EmailService,
        private readonly geoService: GeoLocateService,
        private readonly geolocalizacaoRepository: GeolocalizacaoRepository,
        private readonly agendaService: AgendaService
    ) { }

    async create(profissional: Profissional): Promise<SucessDto> {
        try {
            let profissionalExists = await this.profissionalRepository.findByCro(profissional.cro);
            if (profissionalExists) {
                return new SucessDto(false, 'Usuário já cadastrado');
            }

            profissionalExists = await this.profissionalRepository.findByEmail(profissional.email);
            if (profissionalExists) {
                return new SucessDto(false, 'Usuário já cadastrado');
            }

            const codigo = await this.emailService.enviarCodigoVerificacao(profissional.email);
            profissional.codigo = codigo;

            const geolocalizacaoExists = await this.geolocalizacaoRepository.findByCep(profissional.cep);
            if (!geolocalizacaoExists) {
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

    async findAll(filtros: GetProfissionallDto, userId: any): Promise<Partial<Profissional>[]> {
        const userData = await this.profissionalRepository.findById(userId);
        if (!userData?.cep) return [];

        if(filtros.horarios){
            const agendas = await this.agendaService.findByHorario(filtros.horarios)
            if (!agendas) return [];

            const agendaIds = agendas.map(agenda => agenda.tomadorId);
            const profissionais = await this.profissionalRepository.findByIds(agendaIds.filter(id => id !== undefined));
            return profissionais.map((profissional) => {
                const resultado: Partial<Profissional> = {
                    nome: profissional.nome,
                    descricao: profissional.descricao,
                    cidade: profissional.cidade,
                    estado: profissional.estado,
                    cro: profissional.cro,
                    link: profissional.link,
                    instagram: profissional.instagram,
                    facebook: profissional.facebook,
                    foto: profissional.foto,
                    cep: profissional.cep,
                    comentariosId: profissional.comentariosId,
                    especialidades: profissional.especialidades
                };
                if (profissional.exibirNumero) {
                    resultado.celular = profissional.celular;
                }
                return resultado;
            });
        }
        
        if (filtros.cidade && filtros.estado) {
            const filtrados = await this.profissionalRepository.findByFiltros(filtros);
            return filtrados.map((profissional) => {
                const resultado: Partial<Profissional> = {
                    nome: profissional.nome,
                    descricao: profissional.descricao,
                    cidade: profissional.cidade,
                    estado: profissional.estado,
                    cro: profissional.cro,
                    link: profissional.link,
                    instagram: profissional.instagram,
                    facebook: profissional.facebook,
                    foto: profissional.foto,
                    cep: profissional.cep,
                    comentariosId: profissional.comentariosId,
                    especialidades: profissional.especialidades
                };
                if (profissional.exibirNumero) {
                    resultado.celular = profissional.celular;
                }
                return resultado;
            });
        }

        if (filtros.cep) {
            const filtrados = await this.profissionalRepository.findByFiltros(filtros);
            return filtrados.map((profissional) => {
                const resultado: Partial<Profissional> = {
                    nome: profissional.nome,
                    descricao: profissional.descricao,
                    cidade: profissional.cidade,
                    estado: profissional.estado,
                    cro: profissional.cro,
                    link: profissional.link,
                    instagram: profissional.instagram,
                    facebook: profissional.facebook,
                    foto: profissional.foto,
                    cep: profissional.cep,
                    comentariosId: profissional.comentariosId,
                    especialidades: profissional.especialidades

                };
                if (profissional.exibirNumero) {
                    resultado.celular = profissional.celular;
                }
                return resultado;
            });
        }

        if (filtros.especialidade) {
            const filtrados = await this.profissionalRepository.findByFiltros(filtros);
            return filtrados.map((profissional) => {
                const resultado: Partial<Profissional> = {
                    nome: profissional.nome,
                    descricao: profissional.descricao,
                    cidade: profissional.cidade,
                    estado: profissional.estado,
                    cro: profissional.cro,
                    link: profissional.link,
                    instagram: profissional.instagram,
                    facebook: profissional.facebook,
                    foto: profissional.foto,
                    cep: profissional.cep,
                    comentariosId: profissional.comentariosId,
                    especialidades: profissional.especialidades
                };
                if (profissional.exibirNumero) {
                    resultado.celular = profissional.celular;
                }
                return resultado;
            });
        }
        const origem = await this.geolocalizacaoRepository.findByCep(userData.cep);
        if (!origem) return [];

        const todosProfissionais = await this.profissionalRepository.findAll();
        const profissionaisProximos: Partial<Profissional>[] = [];

        if(filtros.km){
            for (const profissional of todosProfissionais) {
                if (profissional.cep) {
                    const destino = await this.geolocalizacaoRepository.findByCep(profissional.cep);
    
                    if (destino) {
                        const distancia = await this.geoService.calcularDistancia(
                            { lat: parseFloat(origem.lat), lng: parseFloat(origem.lng) },
                            { lat: parseFloat(destino.lat), lng: parseFloat(destino.lng) }
                        );
    
                        if (distancia <= Number(filtros.km)) {
                            const resultado: Partial<Profissional> = {
                                nome: profissional.nome,
                                descricao: profissional.descricao,
                                cidade: profissional.cidade,
                                estado: profissional.estado,
                                cro: profissional.cro,
                                link: profissional.link,
                                instagram: profissional.instagram,
                                facebook: profissional.facebook,
                                foto: profissional.foto,
                                cep: profissional.cep,
                                comentariosId: profissional.comentariosId,
                                especialidades: profissional.especialidades
                            };
    
                            if (profissional.exibirNumero) {
                                resultado.celular = profissional.celular;
                            }
    
                            profissionaisProximos.push(resultado);
                        }
                    }
                }
            }
    
            return profissionaisProximos;
        }
        return todosProfissionais;
    }


    async findById(id: string): Promise<any | null> {
        const profissionalData = await this.profissionalRepository.findById(id);
        if (!profissionalData) return null;
      
        const agendaDisponivel = await this.agendaService.findByTomador(id);

        const profissional: Partial<Profissional> = {
          nome: profissionalData.nome,
          descricao: profissionalData.descricao,
          cidade: profissionalData.cidade,
          estado: profissionalData.estado,
          cro: profissionalData.cro,
          link: profissionalData.link,
          instagram: profissionalData.instagram,
          facebook: profissionalData.facebook,
          foto: profissionalData.foto,
          cep: profissionalData.cep,
          comentariosId: profissionalData.comentariosId,
          especialidades: profissionalData.especialidades
        };
      
        if (profissionalData.exibirNumero) {
            profissionalData.celular = profissionalData.celular;
        }
      
        return {profissionalData, agendaDisponivel};
      }

    async update(id: string, data: Partial<Profissional>): Promise<void> {
        return this.profissionalRepository.update(id, data);
    }

    async delete(id: string): Promise<void> {
        return this.profissionalRepository.delete(id);
    }
}
