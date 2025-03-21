import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../../infrastructure/firebase/firebase.service';
import { Consultorio } from '../entities/consultorio.entity';

@Injectable()
export class ConsultorioRepository {
  private collection = 'consultorios';

  constructor(private readonly firebaseService: FirebaseService) {}

  async create(consultorio: Consultorio): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection(this.collection).doc(consultorio.id).set({ ...consultorio });
  }

  async findAll(): Promise<Consultorio[]> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection(this.collection).get();
    return snapshot.docs.map(doc => doc.data() as Consultorio);
  }

  async findById(id: string): Promise<Consultorio | null> {
    const db = this.firebaseService.getFirestore();
    const doc = await db.collection(this.collection).doc(id).get();
    return doc.exists ? (doc.data() as Consultorio) : null;
  }

  async findByEmail(email: string): Promise<Consultorio | null> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection(this.collection).where('email', '==', email).get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as Consultorio;
  }

  async findByPhone(phone: string): Promise<Consultorio | null> {
    const db = this.firebaseService.getFirestore();
    const snapshot = await db.collection(this.collection).where('celular', '==', phone).get();
    if (snapshot.empty) return null;
    return snapshot.docs[0].data() as Consultorio;
  }

  async update(id: string, data: Partial<Consultorio>): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection(this.collection).doc(id).update(data);
  }

  async delete(id: string): Promise<void> {
    const db = this.firebaseService.getFirestore();
    await db.collection(this.collection).doc(id).delete();
  }
}
