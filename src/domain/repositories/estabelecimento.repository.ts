import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../infrastructure/firebase/firebase.service';
import { Estabelecimento } from '../entities/estabelecimento.entity';
import { GetEstabelecimentoDto } from 'src/presentation/dtos/estabelecimento/getEstabelecimento.dto';

@Injectable()
export class EstabelecimentoRepository {
  private collection = 'estabelecimentos';

  constructor(private readonly firebaseService: FirebaseService) { }

  async create(estabelecimento: Estabelecimento): Promise<void> {
    const db = this.firebaseService.getFirestore();

    if (typeof estabelecimento.especialidades === 'string') {
      estabelecimento.especialidades = [estabelecimento.especialidades];
    } else if (!Array.isArray(estabelecimento.especialidades)) {
      estabelecimento.especialidades = [];
    }

    estabelecimento.especialidades = estabelecimento.especialidades.map(e => e.trim().toUpperCase());

    await db.collection(this.collection).doc(estabelecimento.id).set({ ...estabelecimento });
  }


  async findAll(): Promise<Estabelecimento[]> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection(this.collection).get();
    return snapshot.docs.map(doc => doc.data() as Estabelecimento);
  }

  async findById(id: string): Promise<Estabelecimento | null> {
    const db = this.firebaseService.getFirestore();
    const doc = await db.collection(this.collection).doc(id).get();
    return doc.exists ? (doc.data() as Estabelecimento) : null;
  }

  async findByEmail(email: string): Promise<Estabelecimento | null> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection(this.collection).where('email', '==', email).get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as Estabelecimento;
  }

  async findByCnpj(cnpj: string): Promise<Estabelecimento | null> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection(this.collection).where('cnpj', '==', cnpj).get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as Estabelecimento;
  }

  async findByPhone(phone: string): Promise<Estabelecimento | null> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection(this.collection).where('celular', '==', phone).get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as Estabelecimento;
  }

  async update(id: string, data: Partial<Estabelecimento>): Promise<void> {
    const db = this.firebaseService.getFirestore();

    if (typeof data.especialidades === 'string') {
      data.especialidades = [data.especialidades];
    } else if (!Array.isArray(data.especialidades)) {
      data.especialidades = [];
    }


    data.especialidades = data.especialidades.map(e => e.trim().toUpperCase());

    if (typeof data.exibirNumero === 'string') {
      if (data.exibirNumero === 'true') {
        data.exibirNumero = true;
      } else if (data.exibirNumero === 'false') {
        data.exibirNumero = false;
      }

    }

    await db.collection(this.collection).doc(id).update(data);
  }

  async delete(id: string): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection(this.collection).doc(id).delete();
  }

  async findByIds(ids: string[]): Promise<Estabelecimento[]> {
    const db = this.firebaseService.getFirestore();

    const snapshot = await db
      .collection('estabelecimentos')
      .where('id', 'in', ids)
      .where('status', '==', 'ATIVO')
      .get();

    return snapshot.docs.map(doc => doc.data() as Estabelecimento);
  }

  async findByFiltros(filtros: GetEstabelecimentoDto): Promise<Estabelecimento[]> {
    const db = this.firebaseService.getFirestore();
    let ref = db.collection('estabelecimentos').where('status', '==', 'ATIVO') as FirebaseFirestore.Query;

    if (filtros.cep) {
      ref = ref.where('cep', '==', filtros.cep);
    } else if (filtros.cidade && filtros.estado) {
      ref = ref.where('cidade', '==', filtros.cidade);
      ref = ref.where('estado', '==', filtros.estado);
    }
    if (Array.isArray(filtros.especialidade) && filtros.especialidade.length > 0) {
      const especialidades = filtros.especialidade.map(e => e.trim().toUpperCase());
      ref = ref.where('especialidades', 'array-contains-any', especialidades);
    } else {
      if (filtros.especialidade) {
        ref = ref.where('especialidades', 'array-contains', filtros.especialidade);
      }

    }
    const snapshot = await ref.get();
    const result: Estabelecimento[] = [];

    snapshot.forEach(doc => {
      result.push(doc.data() as Estabelecimento);
    });

    return result;
  }

}
