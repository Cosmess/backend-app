import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../infrastructure/firebase/firebase.service';
import { Profissional } from '../entities/profissional.entity';

@Injectable()
export class ProfissionalRepository {
  private collection = 'profissionais';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(profissional: Profissional): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection(this.collection).doc(profissional.id).set({ ...profissional });
  }

  async findAll(): Promise<Profissional[]> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection(this.collection).get();
    return snapshot.docs.map(doc => doc.data() as Profissional);
  }

  async findById(id: string): Promise<Profissional | null> {
    const db = this.firebaseService.getFirestore();
    const doc = await db.collection(this.collection).doc(id).get();
    return doc.exists ? (doc.data() as Profissional) : null;
  }

  async update(id: string, data: Partial<Profissional>): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection(this.collection).doc(id).update(data);
  }

  async delete(id: string): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection(this.collection).doc(id).delete();
  }
}
