import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../infrastructure/firebase/firebase.service';
import { Especialidade } from '../entities/especialidade.entity';

@Injectable()
export class EspecialidadeRepository {
  private collection = 'especialidades';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(especialidade: Especialidade): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection(this.collection).doc(especialidade.id).set({ ...especialidade });
  }

  async findAll(): Promise<Especialidade[]> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection(this.collection).get();
    return snapshot.docs.map(doc => doc.data() as Especialidade);
  }

  async update(id: string, data: Partial<Especialidade>): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection(this.collection).doc(id).update(data);
  }

  async delete(id: string): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection(this.collection).doc(id).delete();
  }
  
}
