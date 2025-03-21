import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../infrastructure/firebase/firebase.service';
import { Geolocalizacao } from '../entities/geolocalizacao.entity';

@Injectable()
export class GeolocalizacaoRepository {
  private collection = 'geolocalizacoes';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(geolocalizacao: Geolocalizacao): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection(this.collection).doc(geolocalizacao.id).set({ ...geolocalizacao });
  }

  async findAll(): Promise<Geolocalizacao[]> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection(this.collection).get();
    return snapshot.docs.map(doc => doc.data() as Geolocalizacao);
  }

  async findById(id: string): Promise<Geolocalizacao | null> {
    const db = this.firebaseService.getFirestore();
    const doc = await db.collection(this.collection).doc(id).get();
    return doc.exists ? (doc.data() as Geolocalizacao) : null;
  }

  async findByCep(cep: string): Promise<Geolocalizacao | null> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection(this.collection).where('cep', '==', cep).get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as Geolocalizacao;
  }


  async update(id: string, data: Partial<Geolocalizacao>): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection(this.collection).doc(id).update(data);
  }

  async delete(id: string): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection(this.collection).doc(id).delete();
  }
}
