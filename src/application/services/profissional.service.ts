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
import { File } from 'multer';
import { AgendaService } from './agenda.service';
import { S3Service } from 'src/infrastructure/s3/s3.service';
import { EstabelecimentoRepository } from 'src/domain/repositories/estabelecimento.repository';
import * as moment from 'moment-timezone';
@Injectable()
export class ProfissionalService {
    constructor(private readonly profissionalRepository: ProfissionalRepository,
        private readonly croApiService: CroApiService,
        private readonly emailService: EmailService,
        private readonly geoService: GeoLocateService,
        private readonly geolocalizacaoRepository: GeolocalizacaoRepository,
        private readonly agendaService: AgendaService,
        private readonly s3service: S3Service,
        private readonly estabelecimentoRepository: EstabelecimentoRepository
    ) { }

    async create(profissional: Profissional, file?: File): Promise<SucessDto> {
        try {
            let profissionalExists = await this.profissionalRepository.findByCro(profissional.cro);
            if (profissionalExists) {
                return new SucessDto(false, 'Usuário já cadastrado');
            }

            profissionalExists = await this.profissionalRepository.findByEmail(profissional.email);
            if (profissionalExists) {
                return new SucessDto(false, 'Usuário já cadastrado');
            }

            const emailExists = await this.estabelecimentoRepository.findByEmail(profissional.email)
            if (emailExists) {
                return new SucessDto(false, 'Email já cadastrado');
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

            if (file) {
                const fileName = await this.s3service.uploadFile(file, 'estabelecimentos');
                if (!fileName.success) {
                    return new SucessDto(false, fileName.message);
                }
                profissional.foto = fileName.message;
            }

            const codigo = await this.emailService.enviarCodigoVerificacao(profissional.email);
            profissional.codigo = codigo;
            profissional.emailVerificado = false;
            profissional.dateLastPayment = moment().tz('America/Sao_Paulo').toDate();
            await this.profissionalRepository.create(profissional);


            setTimeout(() => {
                this.profissionalRepository.update(profissional.id, { codigo: '' });
            }, 300_000); // 5 minutes

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
        const userData = await this.estabelecimentoRepository.findById(userId);
        if (!userData?.cep) return [];

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
        
        const todosProfissionais = await this.profissionalRepository.findAll();

        return todosProfissionais;
    }


    async findById(id: string): Promise<any | null> {
        const profissionalData = await this.profissionalRepository.findById(id);
        if (!profissionalData) return null;

        const agendaDisponivel = await this.agendaService.findByTomador(id);

        const profissional: Partial<Profissional> = {
            id: profissionalData.id,
            nome: profissionalData.nome,
            email: profissionalData.email,
            celular: profissionalData.exibirNumero ? profissionalData.celular : undefined,
            endereco: profissionalData.endereco,
            cep: profissionalData.cep,
            numero: profissionalData.numero,
            cidade: profissionalData.cidade,
            bairro: profissionalData.bairro,
            estado: profissionalData.estado,
            descricao: profissionalData.descricao,
            link: profissionalData.link,
            instagram: profissionalData.instagram,
            cro: profissionalData.cro,
            foto: profissionalData.foto,
            exibirNumero: profissionalData.exibirNumero,
            especialidades: profissionalData.especialidades,
        };


        if (profissionalData.exibirNumero) {
            profissionalData.celular = profissionalData.celular;
        }

        return { Data: profissional, agendaDisponivel };
    }

    async update(id: string, data: Partial<Profissional>, userId: string, file?: File): Promise<void> {
        if (userId != id) {
            throw new BadRequestException('Você não tem permissão para atualizar este profissional');
        }
        if (file) {
            const fileName = await this.s3service.uploadFile(file, 'estabelecimentos');
            data.foto = fileName.message;
        }
        if (typeof data.exibirNumero === 'string') {
            if (data.exibirNumero === 'true') {
                data.exibirNumero = true;
            } else if (data.exibirNumero === 'false') {
                data.exibirNumero = false;
            }

        }
        return this.profissionalRepository.update(id, data);
    }

    async delete(id: string): Promise<void> {
        return this.profissionalRepository.delete(id);
    }
}

