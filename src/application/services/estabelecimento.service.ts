import { Injectable } from '@nestjs/common';
import { EstabelecimentoRepository } from '../../domain/repositories/estabelecimento.repository';
import { Estabelecimento } from '../../domain/entities/estabelecimento.entity';
import * as bcrypt from 'bcrypt';
import { SucessDto } from 'src/presentation/dtos/success.dto';
import { EmailService } from './email.service';
import { validarCNPJ } from 'src/crosscuting/utils';
import { CroApiService } from 'src/infrastructure/external/cro-api.service';
import { GeoLocateService } from './geolocate.service';
import { GeolocalizacaoRepository } from 'src/domain/repositories/geolocalizacao.repository';
import { AgendaService } from './agenda.service';
import { S3Service } from 'src/infrastructure/s3/s3.service';
import { Geolocalizacao } from 'src/domain/entities/geolocalizacao.entity';
import { v4 as uuidv4 } from 'uuid';
import { GetEstabelecimentoDto } from 'src/presentation/dtos/estabelecimento/getEstabelecimento.dto';
import { ProfissionalRepository } from 'src/domain/repositories/profissional.repository';

@Injectable()
export class EstabelecimentoService {
  constructor(private readonly estabelecimentoRepository: EstabelecimentoRepository,
    private readonly croApiService: CroApiService,
    private readonly emailService: EmailService,
    private readonly geoService: GeoLocateService,
    private readonly geolocalizacaoRepository: GeolocalizacaoRepository,
    private readonly agendaService: AgendaService,
    private readonly s3service: S3Service,
    private readonly profissionalRepository: ProfissionalRepository
  ) { }

  async create(estabelecimento: Estabelecimento, file?: File): Promise<SucessDto> {
    try {
      let estabelecimentoExists = await this.estabelecimentoRepository.findByCnpj(estabelecimento.cnpj)
      if (estabelecimentoExists) {
        return new SucessDto(false, 'Estabelecimento já cadastrado');
      } 

      estabelecimentoExists = await this.estabelecimentoRepository.findByEmail(estabelecimento.email)
      if (estabelecimentoExists) {
        return new SucessDto(false, 'Estabelecimento já cadastrado');
      }

      const isValidCnpj = await validarCNPJ(estabelecimento.cnpj);
      if (!isValidCnpj) {
        return new SucessDto(false, 'CNPJ Invalido');
      }


      const codigo = await this.emailService.enviarCodigoVerificacao(estabelecimento.email)
      estabelecimento.codigo = codigo;

      const geolocalizacaoExists = await this.geolocalizacaoRepository.findByCep(estabelecimento.cep);
      if (!geolocalizacaoExists) {
        const coordenadas = await this.geoService.obterLatLngPorCep(estabelecimento.cep);
        if (!coordenadas) {
          throw new Error('Falha ao obter coordenadas');
        }

        const geolocalizacao: Geolocalizacao = {
          id: uuidv4(),
          lat: coordenadas.lat,
          lng: coordenadas.lng,
          cep: estabelecimento.cep
        }
        
        await this.geolocalizacaoRepository.create(geolocalizacao);
      }
        const croValidate = await this.croApiService.buscarPorNumeroRegistro(estabelecimento.croResponsavel);
        if (!croValidate) {
          estabelecimento.status = 'PENDENTE';
        } else if (croValidate.situacao === 'ATIVO') {
          estabelecimento.status = 'ATIVO';
        } else {
          estabelecimento.status = croValidate.situacao;
        }

        const salt = await bcrypt.genSalt(10);
        estabelecimento.senha = await bcrypt.hash(estabelecimento.senha, salt);

        if (file) {
          estabelecimento.foto = await this.s3service.uploadFile(file, 'estabelecimentos');
        }
        await this.estabelecimentoRepository.create(estabelecimento);

        setTimeout(() => {
          this.estabelecimentoRepository.update(estabelecimento.id, { codigo: '' });
        }, 300_000);


      return new SucessDto(true, 'Codigo de verificação enviado por email');
    } catch (error) {
      console.error(error.message)
      return new SucessDto(false, error.message);
    }
  }

  async validatePassword(email: string, senha: string): Promise<boolean> {
    const estabelecimento = await this.estabelecimentoRepository.findByEmail(email);
    if (!estabelecimento) return false;
    return bcrypt.compare(senha, estabelecimento.senha);
  }

  async findByEmailOrPhone(emailOrPhone: string): Promise<Estabelecimento | null> {
    let estabelecimento = await this.estabelecimentoRepository.findByEmail(emailOrPhone);
    if (!estabelecimento) {
      estabelecimento = await this.estabelecimentoRepository.findByPhone(emailOrPhone);
    }
    return estabelecimento;
  }

  async findAll(filtros: GetEstabelecimentoDto, userId: any): Promise<Partial<Estabelecimento>[]> {
    const userData = await this.profissionalRepository.findById(userId);
    if (!userData?.cep) return [];

    if (filtros.horarios) {
      const agendas = await this.agendaService.findByHorario(filtros.horarios)
      if (!agendas) return [];

      const agendaIds = agendas.map(agenda => agenda.tomadorId);
      const profissionais = await this.estabelecimentoRepository.findByIds(agendaIds.filter(id => id !== undefined));
      return profissionais.map((estabelecimento) => {
        const resultado: Partial<Estabelecimento> = {
          nome: estabelecimento.nome,
          descricao: estabelecimento.descricao,
          cidade: estabelecimento.cidade,
          bairro: estabelecimento.bairro,
          estado: estabelecimento.estado,
          croResponsavel: estabelecimento.croResponsavel,
          link: estabelecimento.link,
          instagram: estabelecimento.instagram,
          facebook: estabelecimento.facebook,
          foto: estabelecimento.foto,
          cep: estabelecimento.cep,
          comentariosId: estabelecimento.comentariosId,
          especialidades: estabelecimento.especialidades
        };
        if (estabelecimento.exibirNumero) {
          resultado.celular = estabelecimento.celular;
        }
        return resultado;
      });
    }

    if (filtros.cidade && filtros.estado) {
      const filtrados = await this.estabelecimentoRepository.findByFiltros(filtros);
      return filtrados.map((estabelecimento) => {
        const resultado: Partial<Estabelecimento> = {
          nome: estabelecimento.nome,
          descricao: estabelecimento.descricao,
          cidade: estabelecimento.cidade,
          estado: estabelecimento.estado,
          croResponsavel: estabelecimento.croResponsavel,
          link: estabelecimento.link,
          instagram: estabelecimento.instagram,
          facebook: estabelecimento.facebook,
          foto: estabelecimento.foto,
          cep: estabelecimento.cep,
          comentariosId: estabelecimento.comentariosId,
          especialidades: estabelecimento.especialidades
        };
        if (estabelecimento.exibirNumero) {
          resultado.celular = estabelecimento.celular;
        }
        return resultado;
      });
    }

    if (filtros.cep) {
      const filtrados = await this.estabelecimentoRepository.findByFiltros(filtros);
      return filtrados.map((estabelecimento) => {
        const resultado: Partial<Estabelecimento> = {
          nome: estabelecimento.nome,
          descricao: estabelecimento.descricao,
          cidade: estabelecimento.cidade,
          estado: estabelecimento.estado,
          croResponsavel: estabelecimento.croResponsavel,
          link: estabelecimento.link,
          instagram: estabelecimento.instagram,
          facebook: estabelecimento.facebook,
          foto: estabelecimento.foto,
          cep: estabelecimento.cep,
          comentariosId: estabelecimento.comentariosId,
          especialidades: estabelecimento.especialidades

        };
        if (estabelecimento.exibirNumero) {
          resultado.celular = estabelecimento.celular;
        }
        return resultado;
      });
    }

    if (filtros.especialidade) {
      const filtrados = await this.estabelecimentoRepository.findByFiltros(filtros);
      return filtrados.map((estabelecimento) => {
        const resultado: Partial<Estabelecimento> = {
          nome: estabelecimento.nome,
          descricao: estabelecimento.descricao,
          cidade: estabelecimento.cidade,
          estado: estabelecimento.estado,
          croResponsavel: estabelecimento.croResponsavel,
          link: estabelecimento.link,
          instagram: estabelecimento.instagram,
          facebook: estabelecimento.facebook,
          foto: estabelecimento.foto,
          cep: estabelecimento.cep,
          comentariosId: estabelecimento.comentariosId,
          especialidades: estabelecimento.especialidades
        };
        if (estabelecimento.exibirNumero) {
          resultado.celular = estabelecimento.celular;
        }
        return resultado;
      });
    }

    const origem = await this.geolocalizacaoRepository.findByCep(userData.cep);
    if (!origem) return [];

    const todosEstabelecimentos = await this.estabelecimentoRepository.findAll();
    const estabelecimentosProximos: Partial<Estabelecimento>[] = [];

    if (filtros.km) {
      for (const estabelecimento of todosEstabelecimentos) {
        if (estabelecimento.cep) {
          const destino = await this.geolocalizacaoRepository.findByCep(estabelecimento.cep);

          if (destino) {
            const distancia = await this.geoService.calcularDistancia(
              { lat: parseFloat(origem.lat), lng: parseFloat(origem.lng) },
              { lat: parseFloat(destino.lat), lng: parseFloat(destino.lng) }
            );

            if (distancia <= Number(filtros.km)) {
              const resultado: Partial<Estabelecimento> = {
                nome: estabelecimento.nome,
                descricao: estabelecimento.descricao,
                cidade: estabelecimento.cidade,
                estado: estabelecimento.estado,
                croResponsavel: estabelecimento.croResponsavel,
                link: estabelecimento.link,
                instagram: estabelecimento.instagram,
                facebook: estabelecimento.facebook,
                foto: estabelecimento.foto,
                cep: estabelecimento.cep,
                comentariosId: estabelecimento.comentariosId,
                especialidades: estabelecimento.especialidades
              };

              if (estabelecimento.exibirNumero) {
                resultado.celular = estabelecimento.celular;
              }

              estabelecimentosProximos.push(resultado);
            }
          }
        }
      }

      return estabelecimentosProximos;
    }
    return todosEstabelecimentos;
  }

  async findById(id: string): Promise<Estabelecimento | null> {
    return this.estabelecimentoRepository.findById(id);
  }

  async update(id: string, data: Partial<Estabelecimento>): Promise<void> {
    return this.estabelecimentoRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.estabelecimentoRepository.delete(id);
  }
}