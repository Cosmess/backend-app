import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../infrastructure/firebase/firebase.service';
import { Profissional } from '../entities/profissional.entity';

@Injectable()
export class ProfissionalRepository {
  private collection = 'profissionais';

  constructor(private readonly firebaseService: FirebaseService) { }

  async create(profissional: Profissional): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection(this.collection).doc(profissional.id).set({ ...profissional });
  }

  async findAll(): Promise<Profissional[]> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db
      .collection(this.collection)
      .where('status', '==', 'ATIVO')
      .get();

    return snapshot.docs.map(doc => doc.data() as Profissional);
  }

  async findByIds(ids: string[]): Promise<Profissional[]> {
    const db = this.firebaseService.getFirestore();
  
    const snapshot = await db
      .collection('profissionais')
      .where('id', 'in', ids)
      .where('status', '==', 'ATIVO')
      .get();
  
    return snapshot.docs.map(doc => doc.data() as Profissional);
  }
  

  async findById(id: string): Promise<Profissional | null> {
    const db = this.firebaseService.getFirestore();
    const doc = await db.collection(this.collection).doc(id).get();
    return doc.exists ? (doc.data() as Profissional) : null;
  }

  async findByEmail(email: string): Promise<Profissional | null> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection(this.collection).where('email', '==', email).get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as Profissional;
  }

  async findByCro(email: string): Promise<Profissional | null> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection(this.collection).where('cro', '==', email).get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as Profissional;
  }

  async findByPhone(phone: string): Promise<Profissional | null> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection(this.collection).where('celular', '==', phone).get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as Profissional;
  }

  async update(id: string, data: Partial<Profissional>): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection(this.collection).doc(id).update(data);
  }

  async delete(id: string): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection(this.collection).doc(id).delete();
  }

  async findByFiltros(filtros: { cep?: string; cidade?: string; estado?: string; especialidade?: string[] }): Promise<Profissional[]> {
    const db = this.firebaseService.getFirestore();
    let ref = db.collection('profissionais').where('status', '==', 'ATIVO') as FirebaseFirestore.Query;

    if (filtros.cep) {
      ref = ref.where('cep', '==', filtros.cep);
    } else if (filtros.cidade) {
      ref = ref.where('cidade', '==', filtros.cidade);
    } else if (filtros.estado) {
      ref = ref.where('estado', '==', filtros.estado);
    }

    if (filtros.especialidade) {
      ref = ref.where('especialidades', 'array-contains', filtros.especialidade);
    }

    const snapshot = await ref.get();
    const result: Profissional[] = [];

    snapshot.forEach(doc => {
      result.push(doc.data() as Profissional);
    });

    return result;
  }

}
